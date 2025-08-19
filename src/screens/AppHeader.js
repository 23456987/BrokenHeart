import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppHeader() {
  const [currentTime, setCurrentTime] = useState('');
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateString = now.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const timeString = now.toLocaleTimeString('en-US');
      setCurrentTime(`${dateString} - ${timeString}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUserData(parsed);
        } else {
          setUserData(null);
        }
      } catch (err) {
        // console.log('Failed to load userData:', err);
      }
    };

    loadUser();

    const unsubscribe = navigation.addListener('focus', loadUser);
    return unsubscribe;
  }, [navigation]);

  const displayName = userData?.first_name || 'Guest';
  // console.log("displayName:", displayName);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.timeText}>
          <Icon name="calendar" size={14} color="#ccc" /> {currentTime}
        </Text>

        <View style={styles.authButtons}>
          {userData ? (
            <Text style={styles.welcomeText}>
              <Icon name="user" size={14} color="#fff" /> Welcome, {displayName}
            </Text>
          ) : (
            <>
              <TouchableOpacity
                style={styles.authLink}
                onPress={() => navigation.navigate('Login')}>
                <Icon name="sign-in-alt" size={14} color="#fff" />
                <Text style={styles.authText}> Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.authLink}
                onPress={() => navigation.navigate('Register')}>
                <Icon name="user-plus" size={14} color="#fff" />
                <Text style={styles.authText}> Register</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>
          Broken <Icon name="heart-broken" size={20} color="red" /> Stories
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    paddingTop: 10,
    paddingBottom: 6,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 13,
    color: '#ccc',
  },
  authButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 14,
  },
  authText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 4,
    fontWeight: '500',
  },
  welcomeText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 6,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
});


