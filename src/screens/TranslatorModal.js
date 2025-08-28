// src/components/TranslatorModal.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

export default function TranslatorModal({
  isVisible,
  onClose,
  translatesText,
  translatedText,
  loading,
  content,
}) {
  const languages = [
    { code: 'hi', label: 'Hindi' },
    { code: 'te', label: 'Telugu' },
    { code: 'ta', label: 'Tamil' },
    { code: 'ml', label: 'Malayalam' },
    { code: 'bn', label: 'Bengali' },
  ];

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.header}>Translate Content</Text>

          <View style={styles.langContainer}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={styles.langBtn}
                onPress={() => translatesText(content, lang.code)}
              >
                <Text style={styles.langText}>{lang.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#b30059" style={{ marginTop: 15 }} />
          ) : (
            translatedText !== '' && (
              <View style={styles.resultBox}>
                <Text style={styles.resultText}>{translatedText}</Text>
              </View>
            )
          )}

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    maxHeight: '70%',
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    color: '#b30059',
    marginBottom: 10,
  },
  langContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  langBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#f3f3f3',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  langText: {
    fontSize: 14,
    color: '#333',
  },
  resultBox: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#f9f1f5',
    borderRadius: 8,
  },
  resultText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  closeBtn: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#b30059',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
