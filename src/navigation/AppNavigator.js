import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MainTabsWithHeader from './MainTabsWithHeader';
import PostDetailScreen from '../screens/PostDetailScreen';
import PageScreen from '../screens/PageScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import SplashScreen from '../screens/SplashScreen';
import ContactScreen from '../screens/ContactScreen';
import ChatBotWidget from '../chatbot/ChatBotWidget';
import EpisodeDetailScreen from '../screens/EpisodeDetailScreen';
import TitleHeaderWithBack from './TitleHeaderWithBack';

const RootStack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <RootStack.Navigator initialRouteName="Splash">
      <RootStack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="ContactScreen" component={ContactScreen} />
      <RootStack.Screen name="ChatBotWidget" component={ChatBotWidget} />
      <RootStack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <RootStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Forgot Password' }} />
      <RootStack.Screen name="Main" component={MainTabsWithHeader} options={{ headerShown: false }} />
      <RootStack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{
          header: () => <TitleHeaderWithBack title="Stories" />,
        }}
      />
      <RootStack.Screen
        name="EpisodeDetail"
        component={EpisodeDetailScreen}
        options={{
          header: () => <TitleHeaderWithBack title="Episodes" />,
        }}
      />

   <RootStack.Screen
  name="PageScreen"
  component={PageScreen}
  options={({ route, navigation }) => ({
    header: () => <TitleHeaderWithBack title={route.params.title} navigation={navigation} />,
  })}
/>

    </RootStack.Navigator>
  );
}
