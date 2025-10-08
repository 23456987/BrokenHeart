import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ContactScreen from './ContactScreen';
import ProfileIcon from 'react-native-vector-icons/FontAwesome';
import ChatBotWidget from '../chatbot/ChatBotWidget';  // 👈 Import chatbot widget

export default function YouScreen({ navigation }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchMenu();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchUserData();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('userData');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserData(parsedUser);
      } else {
        setUserData(null);
      }
    } catch (err) {
      setUserData(null);
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await axios.get(
        'https://brokenheart.in/wp-json/brokenheart-api/v1/pages'
      );
      const pages = response.data?.pages;
      if (Array.isArray(pages)) {
        setMenuItems(pages);
      } else {
        setMenuItems([]);
      }
    } catch (error) {
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUserData(null);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (e) {}
  };

  const getIcon = (title) => {
    const key = title.toLowerCase();
    if (key.includes('about')) return 'info';
    if (key.includes('terms')) return 'gavel';
    if (key.includes('contact')) return 'mail';
    if (key.includes('disclaimer')) return 'error-outline';
    if (key.includes('faq')) return 'question-answer';
    if (key.includes('pricing')) return 'attach-money';
    if (key.includes('submit your story')) return 'send';
    return 'arrow-forward';
  };

  const displayName = userData?.first_name || 'Guest';
  const displayEmail = userData?.email || '';

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.profileSection}>
          <ProfileIcon name="user-circle" size={40} color="#555" style={styles.avatar} />
          <View>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.email}>{displayEmail}</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color="#f00" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.menuContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => {
                  const titleLower = item.title.toLowerCase();
                  if (titleLower.includes('contact')) {
                    setModalVisible(true);
                  } else {
                    navigation.navigate('PageScreen', {
                      title: item.title,
                      content: item.content,
                    });
                  }
                }}
              >
                <Icon name={getIcon(item.title)} size={24} style={styles.menuIcon} />
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            ))}

            {/* 🔐 Login / Logout */}
            {userData ? (
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Icon name="logout" size={24} style={styles.menuIcon} />
                <Text style={styles.menuText}>Logout</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('Login')}
              >
                <Icon name="login" size={24} style={styles.menuIcon} />
                <Text style={styles.menuText}>Login</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* 📩 Contact Modal */}
        <ContactScreen visible={modalVisible} onClose={() => setModalVisible(false)} />
      </ScrollView>

      {/* 💬 Chatbot Widget Floating Button */}
      <ChatBotWidget />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#222',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    color: '#ccc',
    fontSize: 14,
  },
  menuContainer: {
    padding: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#222',
    borderBottomWidth: 1,
  },
  menuIcon: {
    marginRight: 20,
    color: '#f00',
  },
  menuText: {
    fontSize: 16,
    color: '#fff',
  },
});
