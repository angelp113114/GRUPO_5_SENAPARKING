import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './src/data/api';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RecoveryScreen from './src/screens/RecoveryScreen';
import VerifyCodeScreen from './src/screens/VerifyCodeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import FeatureScreen from './src/screens/FeatureScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import CarnetScreen from './src/screens/CarnetScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import PerfilAprendiz from './src/screens/PerfilAprendiz';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Recovery: undefined;
  VerifyCode: undefined;
  ResetPassword: undefined;
  Dashboard: undefined;
  Carnet: undefined;
  Scanner: undefined;
  PerfilAprendiz: undefined;
  Feature: {
    key: string;
    title: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [ready, setReady] = useState(false);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');

        setLogged(!!token);
      } catch (error) {
        console.log('Error verificando sesión:', error);
        setLogged(false);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={logged ? 'Dashboard' : 'Home'}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />

        <Stack.Screen
          name="Recovery"
          component={RecoveryScreen}
        />

        <Stack.Screen
          name="VerifyCode"
          component={VerifyCodeScreen}
        />

        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
        />

        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
        />

        <Stack.Screen
          name="Carnet"
          component={CarnetScreen}
        />

        <Stack.Screen
          name="Scanner"
          component={ScannerScreen}
        />

        {/* Pantalla de perfil del aprendiz */}
        <Stack.Screen
          name="PerfilAprendiz"
          component={PerfilAprendiz}
        />

        <Stack.Screen
          name="Feature"
          component={FeatureScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
