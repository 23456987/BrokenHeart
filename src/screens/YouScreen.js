import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ContactScreen from './ContactScreen';
import ProfileIcon from 'react-native-vector-icons/FontAwesome';


export default function YouScreen({ navigation }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);


  useEffect(() => {
    fetchUserData();
    fetchMenu();
  }, []);

  const fetchUserData = async () => {
    try {
      const email = await AsyncStorage.getItem('username');
      const name = email?.split('@')[0] || 'Guest';
      setUserEmail(email);
      setUserName(name.charAt(0).toUpperCase() + name.slice(1));
    } catch (err) {
      console.log('Failed to load user info:', err);
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
        console.warn('API did not return pages as an array:', response.data);
        setMenuItems([]);
      }
    } catch (error) {
      console.log('Failed to fetch menu items:', error);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
  try {
    await AsyncStorage.clear(); // 🚨 This will remove ALL keys stored
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  } catch (e) {
    console.log('Logout error:', e);
  }
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <ProfileIcon name="user-circle" size={40} color="#555" style={styles.avatar} />
        <View>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.email}>{userEmail}</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#f00" style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => {
                const titleLower = item.title.toLowerCase();
                if (titleLower.includes('contact')) {
                  setModalVisible(true); // Show contact form popup
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

          
          {/* 🔒 Logout Button */}
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Icon name="logout" size={24} style={styles.menuIcon} />
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ✅ Contact Form Modal */}
      <ContactScreen visible={modalVisible} onClose={() => setModalVisible(false)} />
    </ScrollView>
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
