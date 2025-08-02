import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

const SplashScreen = ({ navigation }) => {
  const [version, setVersion] = useState('');

  useEffect(() => {
    let isMounted = true;

    const getVersion = async () => {
      const appVersion = await DeviceInfo.getVersion();
      if (isMounted) setVersion(appVersion);
    };

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

    getVersion();
    checkLogin();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/brokenheart.jpg')}
        style={styles.logo}
      />
      <ActivityIndicator size="large" color="#ff3366" />
      <Text style={styles.text}>Welcome to BrokenHeart ❤️</Text>
      <Text style={styles.version}>Version {version}</Text>
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
  version: {
    color: '#888',
    marginTop: 5,
    fontSize: 12,
  },
});
