import React from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import AppHeader from '../screens/AppHeader';
import MainTabs from './MainTabs';

export default function MainTabsWithHeader() {
  return (
    <View style={styles.container}>
      {/* Status bar fix for Android */}
      <View style={styles.statusBarSpacer} />
      
      {/* Safe Area for header */}
      <SafeAreaView style={styles.safeArea}>
        <AppHeader />
      </SafeAreaView>

      <View style={styles.tabs}>
        <MainTabs />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    backgroundColor: '#000',
  }, 
  tabs: {
    flex: 1,
  },
  statusBarSpacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#000',
  },
});
