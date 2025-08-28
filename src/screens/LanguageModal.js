import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function LanguageModal({ isVisible, onClose, onSelect }) {
  const languages = [
    { code: "en-US", label: "English (US)" },
    { code: "te-IN", label: "Telugu" },
    { code: "hi-IN", label: "Hindi" },
  ];

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.heading}>Choose Language</Text>

          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={styles.option}
              onPress={() => {
                onSelect(lang.code);
                onClose();
              }}
            >
              <Text style={styles.optionText}>{lang.label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
  },
  cancelBtn: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#b30059",
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontSize: 16,
  },
});
