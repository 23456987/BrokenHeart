import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppHeader({ heartColor = 'crimson' }) {
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const loadName = async () => {
      try {
        const name = await AsyncStorage.getItem('firstname');
        if (name) setFirstName(name);
      } catch (err) {
        console.log('Failed to load first name:', err);
      }
    };

    loadName();
  }, []);

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <Text style={styles.title}>
          Broken <Icon name="heart-broken" size={20} color={heartColor} /> Heart
        </Text>
      </View>

      <View style={styles.rightSection}>
        {firstName !== '' && (
          <Text style={styles.welcomeText}>Welcome, {firstName}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
