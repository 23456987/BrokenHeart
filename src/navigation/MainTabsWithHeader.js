import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // ✅ correct import
import AppHeader from '../screens/AppHeader';
import MainTabs from './MainTabs';

export default function MainTabsWithHeader() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header inside SafeArea */}
      <View style={styles.header}>
        <AppHeader />
      </View>

      {/* Main tab content area */}
      <View style={styles.tabs}>
        <MainTabs />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#1e1e1e',
  },
  tabs: {
    flex: 1,
    backgroundColor: '#000',
  },
});
