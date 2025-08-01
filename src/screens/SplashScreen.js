import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    let isMounted = true;

    const checkLogin = async () => {
      try {
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');

        setTimeout(() => {
          if (!isMounted) return;

          if (username && password) {
            navigation.replace('Main');
          } else {
            navigation.replace('Login');
          }
        }, 1500);
      } catch (e) {
        if (isMounted) navigation.replace('Login');
      }
    };

    checkLogin();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/brokenheart.jpg')} style={styles.logo} />
      <ActivityIndicator size="large" color="#ff3366" />
      <Text style={styles.text}>Welcome to BrokenHeart ❤️</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  text: {
    color: '#fff',
    marginTop: 15,
    fontSize: 16,
  },
});
