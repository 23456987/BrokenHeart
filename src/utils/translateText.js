import axios from 'axios';

const translateText = async (text, targetLang = 'en') => {
  if (!text || text.trim().length < 2) {
    console.warn('Text is empty or too short to translate.');
    return;
  }

  try {
    setLoading(true);
    const response = await axios.post('https://libretranslate.com/translate', {
      q: text,
      source: 'te', // Telugu
      target: targetLang, // 'en' or 'hi'
      format: 'text',
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    setTranslatedText(response.data.translatedText);
  } catch (error) {
    console.error('Translation error:', error.response?.data || error.message);
    setTranslatedText('Translation failed');
  } finally {
    setLoading(false);
  }
};
