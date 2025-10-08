/**
 * @format
 */
import { AppRegistry, LogBox } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// 🔹 Import Crashlytics
import crashlytics from '@react-native-firebase/crashlytics';

// Ignore noisy warnings (optional)
LogBox.ignoreLogs(['Warning: ...']);

// 🔹 Capture unhandled JS errors
const defaultErrorHandler = ErrorUtils.getGlobalHandler();
ErrorUtils.setGlobalHandler((error, isFatal) => {
  crashlytics().recordError(error); // send to Firebase
  if (isFatal) {
    crashlytics().log('Fatal JS error: ' + error.message);
  }
  // Call default handler so redbox still shows in dev
  defaultErrorHandler(error, isFatal);
});

AppRegistry.registerComponent(appName, () => App);
