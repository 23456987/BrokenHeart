/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

// 📦 Background message handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📥 Background message received:', remoteMessage);
  // Optional: Trigger local notification here
});


AppRegistry.registerComponent(appName, () => App);
