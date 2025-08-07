import React,{useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/context/LanguageContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';

export default function App() {
    // Request notification permission and get token
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission enabled:', authStatus);
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      // 👉 Optionally send this token to your server
    } else {
      console.log('Notification permission not granted');
    }
  };

  // Foreground notification listener
  const foregroundMessageListener = () => {
    return messaging().onMessage(async remoteMessage => {
      console.log('📲 Foreground Notification:', remoteMessage);
      Alert.alert(
        remoteMessage.notification?.title || 'Notification',
        remoteMessage.notification?.body || 'You have a new message.'
      );
    });
  };

  useEffect(() => {
    // 🔓 Request permissions and get FCM token
    requestUserPermission();

    // 💬 Foreground listener
    const unsubscribeForeground = foregroundMessageListener();

    // 🚪 App opened from background
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('🔙 Notification opened from background:', remoteMessage);
      // You can navigate based on remoteMessage.data here
    });

    // 💤 App opened from quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('❗ App opened from quit state by notification:', remoteMessage);
          // You can navigate based on remoteMessage.data here
        }
      });

    return () => {
      unsubscribeForeground();
    };
  }, []);
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
