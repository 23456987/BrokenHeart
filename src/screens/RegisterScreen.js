import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextPassword, setSecureTextPassword] = useState(true);
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);

  const handleRegister = async () => {
    if (!username || !firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    const formData = {
      'user_login-904': username,
      'first_name-904': firstName,
      'last_name-904': lastName,
      'user_email-904': email,
      'user_password-904': password,
      'confirm_user_password-904': confirmPassword,
    };

    try {
      const response = await fetch('https://brokenheart.in/wp-json/brokenheart-api/v1/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('API raw result:', JSON.stringify(result, null, 2));

      const isSuccess =
        response.ok &&
        !String(result?.message || '').toLowerCase().includes('already exists');

      if (isSuccess) {
        Alert.alert('Success', `Registered! Welcome, ${firstName}.`, [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        const errorMsg =
          typeof result === 'string'
            ? result
            : result.message || 'Username or email already exists.';
        Alert.alert('Registration Failed', errorMsg);
      }
    } catch (error) {
      console.log('Registration error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <LinearGradient colors={['#000', 'crimson']} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <Icon name="heart-broken" size={64} color="crimson" style={styles.icon} />
      <Text style={styles.title}>Welcome to BrokenHeart</Text>

      <TextInput style={styles.input} placeholder="Username" placeholderTextColor="#aaa" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="First Name" placeholderTextColor="#aaa" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last Name" placeholderTextColor="#aaa" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" keyboardType="email-address" value={email} onChangeText={setEmail} />

      {/* Password field with eye */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={secureTextPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setSecureTextPassword(!secureTextPassword)}>
          <Icon
            name={secureTextPassword ? 'eye-slash' : 'eye'}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password field with eye */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          secureTextEntry={secureTextConfirm}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setSecureTextConfirm(!secureTextConfirm)}>
          <Icon
            name={secureTextConfirm ? 'eye-slash' : 'eye'}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleRegister} style={{ width: '100%', borderRadius: 8 }}>
        <LinearGradient
          colors={['#8B0000', '#000']}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>Register</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'white',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    color: '#000',
  },
  gradientButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  link: {
    color: '#fff',
    marginTop: 12,
    textDecorationLine: 'underline',
  },
});
