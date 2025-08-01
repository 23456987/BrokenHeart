import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function AppHeader({
  onBellPress,
  searchText,
  onSearchChange,
  onSearchSubmit,
  heartColor = 'crimson', // customizable heart color
}) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <Text style={styles.title}>
          Broken <Icon name="heart-broken" size={20} color={heartColor} /> Heart
        </Text>
      </View>

      <View style={styles.rightSection}>
        {!showSearch && (
          <TouchableOpacity style={styles.iconButton} onPress={() => setShowSearch(true)}>
            <Icon name="search" size={18} color="#fff" />
          </TouchableOpacity>
        )}

        {showSearch && (
          <View style={styles.searchContainer}>
            <TextInput
              autoFocus
              style={styles.searchInput}
              placeholder="Search stories, pain, healing..."
              placeholderTextColor="#aaa"
              value={searchText}
              onChangeText={onSearchChange}
              onSubmitEditing={onSearchSubmit}
              returnKeyType="search"
            />
          </View>
        )}

        <TouchableOpacity style={styles.iconButton} onPress={onBellPress}>
          <Icon name="bell" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1e1e1e',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  iconButton: {
    padding: 6,
    marginLeft: 8,
  },
  searchContainer: {
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    justifyContent: 'center',
    marginRight: 8,
    width: 180,
  },
  searchInput: {
    color: '#fff',
    flex: 1,
    paddingVertical: 0,
  },
});
