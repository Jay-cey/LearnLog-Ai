import pytest
import pytest_asyncio
from app.services.ai_validator import ai_validator

@pytest.mark.asyncio
async def test_is_generic_logic():
    # Test generic content
    generic_text = "I learned that hard work pays off. You should never give up on your dreams. Stay positive."
    assert ai_validator._is_generic(generic_text) == True
    
    # Test specific content
    specific_text = "I learned how to configure Docker with Next.js 13 today. It took 2 hours to fix the volume mapping."
    assert ai_validator._is_generic(specific_text) == False
    
    # Test short specific content
    short_specific = "Fixed the API bug in port 8000."
    assert ai_validator._is_generic(short_specific) == False

@pytest.mark.asyncio
async def test_word_count():
    short_text = "Too short"
    # Mocking db calls isn't needed for this unit check if we extract logic, 
    # but validate_entry integration test would need DB mock.
    # Here we just verify the internal logic constants or separate method if we had one.
    assert len(short_text.split()) < ai_validator.min_word_count
