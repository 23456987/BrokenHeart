// LogoutScreen.js
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogoutScreen({ navigation }) {
  useEffect(() => {
    const logout = async () => {
      try {
        await AsyncStorage.clear();
        Alert.alert('Logged Out', 'You have been logged out.');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } catch (e) {
        Alert.alert('Error', 'Logout failed.');
      }
    };
    logout();
  }, []);

  return null;
}
