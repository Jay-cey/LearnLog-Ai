from sentence_transformers import SentenceTransformer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from uuid import UUID
import numpy as np
import re
from typing import Tuple, Dict, Optional
from datetime import datetime

class AIValidator:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AIValidator, cls).__new__(cls)
            cls._instance._model = None # Lazy load storage
            cls._instance.similarity_threshold = 0.85
            cls._instance.min_word_count = 15  # Increased from 10 for more substance
        return cls._instance

    @property
    def model(self):
        if self._model is None:
            print("[AIValidator] Loading embedding model (lazy)...")
            self._model = SentenceTransformer('all-MiniLM-L6-v2')
            print("[AIValidator] Model loaded.")
        return self._model

    async def validate_entry(
        self, 
        content: str, 
        user_id: UUID, 
        db: AsyncSession
    ) -> Tuple[bool, str, str]:
        """
        Validates a journal entry for authenticity, specificity, and novelty.
        
        Args:
            content: The journal entry text
            user_id: The user's unique identifier
            db: Async database session
            
        Returns:
            Tuple of (is_valid: bool, reason: str, feedback: str)
        """
        # 1. Length validation
        word_count = len(content.split())
        if word_count < self.min_word_count:
            return (
                False, 
                'too_short', 
                f'Please write at least {self.min_word_count} words to capture meaningful reflection (currently {word_count}).'
            )
        
        # 2. Generic content detection with detailed analysis
        is_generic, analysis = self._is_generic(content)
        if is_generic:
            feedback = self._generate_generic_feedback(analysis)
            return False, 'generic', feedback
        
        # 3. Novelty check via semantic similarity
        is_novel, similarity_feedback = await self._check_novelty(content, user_id, db)
        if not is_novel:
            return False, 'duplicate', similarity_feedback
            
        return True, 'accepted', ''
    
    async def _check_novelty(
        self, 
        content: str, 
        user_id: UUID, 
        db: AsyncSession
    ) -> Tuple[bool, str]:
        """
        Check if entry is semantically novel compared to previous entries.
        
        Returns:
            Tuple of (is_novel: bool, feedback: str)
        """
        try:
            embedding = self.model.encode(content)
            
            # Query for most similar entry
            query = text("""
                SELECT id, date, content, (embedding <=> CAST(:embedding AS vector)) as distance
                FROM entries
                WHERE user_id = :user_id
                ORDER BY distance ASC
                LIMIT 1
            """)
            
            result = await db.execute(query, {
                'embedding': str(embedding.tolist()),
                'user_id': user_id
            })
            row = result.fetchone()
            
            if row:
                distance = row.distance
                similarity = 1 - distance
                
                if similarity >= self.similarity_threshold:
                    # Format the date nicely
                    entry_date = row.date
                    if isinstance(entry_date, datetime):
                        date_str = entry_date.strftime('%B %d, %Y')
                    else:
                        date_str = str(entry_date)
                    
                    # Provide context and actionable feedback
                    similar_snippet = row.content[:50] + "..." if len(row.content) > 50 else row.content
                    
                    feedback = (
                        f"This entry is {similarity:.0%} similar to your entry from {date_str}:\n\n"
                        f'"{similar_snippet}"\n\n'
                        f"Try exploring: What's different today? What new angle or insight can you add?"
                    )
                    return False, feedback
                    
        except Exception as e:
            # Fail open: Allow entry if vector search fails, but log for monitoring
            print(f"[AIValidator] Vector search error: {e}")
            # In production, consider logging to a proper logger
            # logger.warning(f"Vector search failed for user {user_id}: {e}")
            
        return True, ''
    
    def _is_generic(self, content: str) -> Tuple[bool, Dict[str, any]]:
        """
        Detect generic/cliché content using multi-dimensional heuristic analysis.
        
        Returns:
            Tuple of (is_generic: bool, analysis_details: dict)
        """
        # Categorized generic phrases with severity weights
        generic_phrases = {
            'platitudes': [
                'never give up', 'hard work pays off', 'believe in yourself',
                'stay positive', 'think positive', 'positive vibes', 'good vibes',
                'everything happens for a reason', 'live laugh love', 'follow your dreams',
                'you miss 100% of the shots', 'rome wasn\'t built in a day',
                'practice makes perfect', 'time heals all wounds'
            ],
            'vague_statements': [
                'learned a lot', 'learned so much', 'was interesting', 'really cool',
                'pretty good', 'went well', 'didn\'t go well', 'had fun',
                'was productive', 'made progress', 'getting better', 'doing well'
            ],
            'surface_observations': [
                'good day', 'bad day', 'tough day', 'long day', 'busy day',
                'great experience', 'interesting experience', 'life lesson',
                'success is', 'failure is', 'the key is', 'important to'
            ]
        }
        
        content_lower = content.lower()
        words = content.split()
        word_count = len(words)
        
        # Initialize scoring
        specificity_score = 0
        generic_score = 0
        
        # 1. GENERIC PHRASE DETECTION (weighted by severity)
        phrase_matches = []
        for category, phrases in generic_phrases.items():
            for phrase in phrases:
                if phrase in content_lower:
                    weight = 2 if category == 'platitudes' else 1
                    generic_score += weight
                    phrase_matches.append((phrase, category))
        
        # 2. SPECIFICITY INDICATORS
        
        # Named entities (improved proper noun detection)
        proper_nouns = []
        for i, word in enumerate(words):
            cleaned = word.strip(".,!?;:\"'")
            if (i > 0 and 
                cleaned and 
                len(cleaned) > 1 and
                cleaned[0].isupper() and 
                cleaned.lower() not in ['i', 'the', 'a', 'an', 'it', 'this', 'that', 'these', 'those']):
                proper_nouns.append(cleaned)
                specificity_score += 1
        
        # Numbers and quantitative data
        numbers = re.findall(r'\d+', content)
        if numbers:
            specificity_score += len(numbers)
        
        # Time expressions (temporal specificity)
        time_patterns = [
            r'\d{1,2}:\d{2}',  # 3:45
            r'\d{1,2}\s?(am|pm)',  # 3pm
            r'\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b',
            r'\b(january|february|march|april|may|june|july|august|september|october|november|december)\b',
            r'(this\s)?(morning|afternoon|evening|night)',
            r'for \d+ (minute|hour|day|week)s?',
            r'(yesterday|today|tonight|last\s\w+)'
        ]
        time_matches = sum(1 for pattern in time_patterns if re.search(pattern, content_lower))
        specificity_score += time_matches * 2
        
        # Concrete action verbs (past tense indicating actual actions)
        action_verbs = [
            'implemented', 'debugged', 'refactored', 'analyzed', 'discovered',
            'tested', 'wrote', 'built', 'created', 'designed', 'solved',
            'practiced', 'completed', 'reviewed', 'studied', 'experimented',
            'measured', 'calculated', 'researched', 'interviewed', 'presented',
            'noticed', 'realized', 'figured out', 'identified', 'attempted'
        ]
        action_count = sum(1 for verb in action_verbs if verb in content_lower)
        specificity_score += action_count * 2
        
        # Quoted text or specific dialogue
        quotes = re.findall(r'["\']([^"\']{3,})["\']', content)
        if quotes:
            specificity_score += len(quotes) * 2
        
        # 3. RED FLAGS
        
        # Vague learning statements
        if re.search(r'\blearned (that|about|how)\b', content_lower):
            # Check if there's substantial follow-up
            learned_pos = content_lower.find('learned')
            remaining = content_lower[learned_pos:]
            if len(remaining.split()) < 15:  # Not much substance after "learned"
                generic_score += 1
        
        # Excessive intensifiers without substance
        intensifiers = ['very', 'really', 'extremely', 'super', 'so', 'quite']
        intensifier_count = sum(1 for word in words if word.lower() in intensifiers)
        if intensifier_count >= 3 and word_count < 50:
            generic_score += 1
        
        # Calculate specificity ratio
        specificity_ratio = specificity_score / word_count if word_count > 0 else 0
        
        # 4. ANALYSIS SUMMARY
        analysis = {
            'word_count': word_count,
            'generic_score': generic_score,
            'specificity_score': specificity_score,
            'specificity_ratio': specificity_ratio,
            'proper_nouns': len(proper_nouns),
            'numbers': len(numbers),
            'time_references': time_matches,
            'action_verbs': action_count,
            'phrase_matches': phrase_matches
        }
        
        # 5. DECISION LOGIC (graduated thresholds by length)
        is_generic = False
        
        # Critical: Multiple generic phrases with minimal specifics
        if generic_score >= 3 and specificity_score < 2:
            is_generic = True
        
        # High generic language with low specificity ratio
        elif generic_score >= 2 and specificity_ratio < 0.12:
            is_generic = True
        
        # Short entries (< 30 words)
        elif word_count < 30:
            if generic_score >= 1 and specificity_score == 0:
                is_generic = True
            elif generic_score > 0 and specificity_ratio < 0.1:
                is_generic = True
        
        # Medium entries (30-100 words)
        elif 30 <= word_count < 100:
            if generic_score >= 2 and specificity_score < 3:
                is_generic = True
        
        # Longer entries (100+ words)
        elif word_count >= 100:
            if generic_score >= 3 and specificity_ratio < 0.08:
                is_generic = True
        
        return is_generic, analysis
    
    def _generate_generic_feedback(self, analysis: Dict[str, any]) -> str:
        """
        Generate constructive feedback based on what's missing from the entry.
        """
        suggestions = []
        
        if analysis['proper_nouns'] < 2:
            suggestions.append("specific names, places, or tools you used")
        
        if analysis['numbers'] == 0:
            suggestions.append("quantitative details (how many? how long? what time?)")
        
        if analysis['action_verbs'] == 0:
            suggestions.append("concrete actions you took")
        
        if analysis['time_references'] == 0:
            suggestions.append("when this happened (morning, 3pm, during lunch)")
        
        # Base feedback
        feedback = "This entry seems too general. "
        
        # Add specific suggestions
        if suggestions:
            feedback += "Try including: " + ", ".join(suggestions) + ". "
        
        # Mention specific generic phrases found
        if analysis['phrase_matches']:
            example_phrase = analysis['phrase_matches'][0][0]
            feedback += f'Instead of phrases like "{example_phrase}", describe the specific situation that led to this insight.'
        
        return feedback


# Singleton instance
ai_validator = AIValidator()