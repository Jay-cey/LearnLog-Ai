from sentence_transformers import SentenceTransformer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from uuid import UUID
import numpy as np

class AIValidator:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AIValidator, cls).__new__(cls)
            cls._instance.model = SentenceTransformer('all-MiniLM-L6-v2')
            cls._instance.similarity_threshold = 0.85
            cls._instance.min_word_count = 10
        return cls._instance

    async def validate_entry(self, content: str, user_id: UUID, db: AsyncSession):
        """
        Returns: (is_valid: bool, reason: str, feedback: str)
        """
        word_count = len(content.split())
        if word_count < self.min_word_count:
            return False, 'too_short', f'Please write at least {self.min_word_count} words (currently {word_count}).'
        
        if self._is_generic(content):
            return False, 'generic', 'This entry seems a bit generic. Tying it to a specific event or person from today makes it more memorable.'
        
        embedding = self.model.encode(content)
        
        # Check similarity using pgvector
        # We need to ensure the embedding is formatted correctly for pgvector
        # pgvector expects a string representation of the list for resizing/casting if needed, 
        # but often driving libraries handle lists. 
        # For raw SQL, casting to vector is safer: CAST(:embedding AS vector)
        
        query = text("""
            SELECT id, date, content, (embedding <=> :embedding) as distance
            FROM entries
            WHERE user_id = :user_id
            ORDER BY distance ASC
            LIMIT 1
        """)
        
        try:
            # Explicitly casting list to string for some driver compatibility if needed, 
            # though asyncpg usually handles lists for vector types if registered.
            # We will pass the list directly first.
            result = await db.execute(query, {
                'embedding': str(embedding.tolist()), 
                'user_id': user_id
            })
            row = result.fetchone()
            
            if row:
                distance = row.distance
                # Cosine similarity = 1 - cosine distance
                similarity = 1 - distance
                
                if similarity >= self.similarity_threshold:
                    return False, 'duplicate', f'This is very similar to your entry from {row.date} ("{row.content[:30]}..."). Try reflecting on something new.'
        except Exception as e:
             # Log the error but allow entry if vector search fails (fail open)
            print(f"Vector search warning: {e}")
            pass
            
        return True, 'accepted', ''
    
    def _is_generic(self, content: str) -> bool:
        """
        Detect generic/cliché content using heuristic analysis.
        """
        generic_phrases = [
            'never give up', 'hard work pays off', 'believe in yourself',
            'stay positive', 'work hard', 'life lesson', 'success is',
            'good day', 'bad day', 'learned a lot'
        ]
        content_lower = content.lower()
        
        # 1. Check for clichéd phrases
        generic_count = sum(1 for phrase in generic_phrases if phrase in content_lower)
        
        # 2. Check for lack of specificity (Capitalized words usually indicate proper nouns/specifics)
        # Exclude start of sentences.
        words = content.split()
        proper_nouns = [
            w for i, w in enumerate(words) 
            if w[0].isupper() and i > 0 and w.strip(".,!?") not in ["I", "The", "A", "An"]
        ]
        
        # 3. Check for specific numbers (dates, times, quantities)
        has_numbers = any(char.isdigit() for char in content)
        
        # Heuristic: If it has multiple generic phrases AND few proper nouns/numbers, it's generic.
        if generic_count >= 2 and len(proper_nouns) < 2 and not has_numbers:
            return True
            
        # Very short entries without specifics are often generic
        if len(words) < 20 and len(proper_nouns) == 0 and not has_numbers:
             # Double check against generic phrases list purely
             if generic_count >= 1:
                 return True

        return False

ai_validator = AIValidator()
