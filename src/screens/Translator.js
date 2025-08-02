// src/hooks/useTranslator.js
import { useState } from 'react';

const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxsKzumkEf5x0_XNIp0aJrJFsPxelsNmdyxtnBisvBLGDtVJEYn2q-aOnUrYA77Tjk/exec';

export default function useTranslator() {
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [targetLang, setTargetLang] = useState(null);

  const translatesText = async (text, lang) => {
    if (!text) return;

    // Toggle logic
    if (targetLang === lang && translatedText !== '') {
      setTranslatedText('');
      setTargetLang(null);
      return;
    }

    const url = `${GOOGLE_SCRIPT_URL}?text=${encodeURIComponent(text)}&target=${lang}`;
    setLoading(true);
    setTranslatedText('');
    setTargetLang(lang);

    try {
      const response = await fetch(url);
      const data = await response.text();
      setTranslatedText(data);
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslatedText('Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    translatesText,
    translatedText,
    loading,
    targetLang,
  };
}
