import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const SplashScreen = ({ navigation }) => {
  const [version, setVersion] = useState('');

useEffect(() => {
  let isMounted = true;

  const getVersion = async () => {
    const appVersion = await DeviceInfo.getVersion();
    if (isMounted) setVersion(appVersion);
  };

  const navigateToMain = () => {
    setTimeout(() => {
      if (isMounted) {
        navigation.replace('Main'); // 👈 Directly navigate to Main screen
      }
    }, 1500);
  };

  getVersion();
  navigateToMain();

  return () => {
    isMounted = false;
  };
}, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/broken_heart.png')}
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
    width: 120,
    height: 120,
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
