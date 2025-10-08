import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/context/LanguageContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from './src/errorBoundary/ErrorBoundary';


export default function App() {
 
  return (
    <ErrorBoundary>
    <SafeAreaProvider>
      <LanguageProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </LanguageProvider>
    </SafeAreaProvider>
    </ErrorBoundary>
  );
}
