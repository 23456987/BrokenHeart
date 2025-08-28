import React, { useState, useEffect } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
  Animated,
  Easing,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '939312410171-0i5tk5rqolulpuftvnrss4chropoj50b.apps.googleusercontent.com',
      offlineAccess: true,
    });

    const checkLogin = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('userData');
        if (savedUser) navigation.replace('Main');
      } catch (err) {
        // console.log('AsyncStorage read error:', err);
      }
    };
    checkLogin();
  }, [navigation]);

  const startPulse = () => {
    scaleAnim.setValue(1);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    startPulse();

    try {
      const response = await fetch(
        'https://brokenheart.in/wp-json/brokenheart-api/v1/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: email, password }),
        }
      );

      const result = await response.json();

      if (response.ok && result?.success) {
        const userData = {
          user_id: result.user_id || '',
          username: result.username || '',
          first_name: result.first_name || '',
          display_name: result.display_name || '',
          email: result.email || '',
          role: result.role || '',
          registered: result.registered || new Date().toISOString(),
        };

        if (userData.user_id) {
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          Alert.alert('Success', '❤️ Login successful!');
          navigation.replace('Main');
        } else {
          Alert.alert('Login Failed', 'User ID missing.');
        }
      } else {
        const errorMessage =
          result?.message || 'Invalid credentials. Please try again.';
        Alert.alert('Login Failed', errorMessage);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
      console.log('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
const handleGoogleLogin = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    // Access user data correctly from userInfo.data.user
    const user = userInfo?.data?.user;
    if (!user?.id) {
      Alert.alert('Error', 'Google Sign-in returned invalid user data.');
      return;
    }

    const userData = {
      user_id: user.id,
      username: user.email || '',
      first_name: user.givenName || '',
      display_name: user.name || '',
      email: user.email || '',
      role: 'google_user',
      photo: user.photo || '',
      registered: new Date().toISOString(),
    };

    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    Alert.alert('Success', 'Google Login successful!');
    navigation.replace('Main');
  } catch (error) {
    // console.log('Google Sign-in error:', error);
    Alert.alert('Error', `Google Sign-in failed: ${error.code || error.message}`);
  }
};

  return (
    <LinearGradient
      colors={['#000', 'crimson']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inner}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={20} color="#fff" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Icon name="heart-broken" size={64} color="crimson" style={styles.icon} />

        <Text style={styles.title}>
          Welcome to <Text style={styles.redBold}>Broken Heart Stories</Text>
          {'\n'}Login to access exclusive stories and content
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry={secureText}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <Icon
              name={secureText ? 'eye-slash' : 'eye'}
              size={20}
              color="#888"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {loading ? (
          <Animated.View style={{ transform: [{ scale: scaleAnim }], marginVertical: 20 }}>
            <Icon name="heart-broken" size={40} color="crimson" solid />
          </Animated.View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <Icon name="google" size={20} color="#fff" />
          <Text style={styles.googleButtonText}> Sign in with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  backButton: { position: 'absolute', top: 50, left: 20, flexDirection: 'row', alignItems: 'center' },
  backText: { marginLeft: 5, fontSize: 16, color: '#fff' },
  icon: { marginBottom: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 30, textAlign: 'center' },
  input: { width: '100%', padding: 12, marginBottom: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: '#ffffffcc', color: '#000' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, backgroundColor: '#ffffffcc', marginBottom: 15, paddingHorizontal: 10 },
  passwordInput: { flex: 1, paddingVertical: 12, color: '#000' },
  eyeIcon: { marginLeft: 10 },
  button: { backgroundColor: '#fff', padding: 14, borderRadius: 8, width: '100%', alignItems: 'center', marginBottom: 10 },
  buttonText: { color: '#8B0000', fontWeight: 'bold' },
  googleButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DB4437', padding: 14, borderRadius: 8, width: '100%', justifyContent: 'center', marginBottom: 10 },
  googleButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 10 },
  link: { color: '#fff', marginTop: 10, textDecorationLine: 'underline' },
  redBold: { color: 'red', fontWeight: 'bold' },
});
