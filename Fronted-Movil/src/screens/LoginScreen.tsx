import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../App';
import { auth, messageOf } from '../data/api';
import { colors, common } from '../theme';
import Field from '../components/Field';
import Button from '../components/Button';

type P = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: P) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('aprendiz');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async () => {
    if (!email.trim() || !password.trim()) {
      setError('El correo y la contraseña son obligatorios');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const r = await auth.login(email.trim(), password, rol);

      console.log('LOGIN RESPUESTA:', r.data);

      if (!r.data?.accessToken) {
        setError(
          r.data?.message ||
            'El servidor no devolvió el token de acceso'
        );
        return;
      }

      await AsyncStorage.setItem(
        'accessToken',
        r.data.accessToken
      );

      if (r.data.user) {
        await AsyncStorage.setItem(
          'user',
          JSON.stringify(r.data.user)
        );
      }

      navigation.replace('Dashboard');
    } catch (e: any) {
      console.log(
        'ERROR LOGIN:',
        e?.response?.data || e?.message || e
      );

      setError(messageOf(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={common.screen}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          padding: 20,
          justifyContent: 'center',
        }}
      >
        <View
          style={[
            common.card,
            {
              padding: 24,
            },
          ]}
        >
          <Image
            source={require('../../assets/logo-sena-parking.png')}
            style={{
              width: 120,
              height: 120,
              alignSelf: 'center',
              resizeMode: 'contain',
            }}
          />

          <Text
            style={{
              fontSize: 25,
              fontWeight: '900',
              textAlign: 'center',
              color: colors.dark,
              marginBottom: 20,
            }}
          >
            SENA PARKING
          </Text>

          <Text
            style={[
              common.label,
              {
                marginTop: 0,
              },
            ]}
          >
            ROL
          </Text>

          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              marginBottom: 5,
            }}
          >
            {[
              'aprendiz',
              'guarda',
              'administrador',
            ].map((x) => (
              <TouchableOpacity
                key={x}
                onPress={() => setRol(x)}
                style={{
                  flex: 1,
                  padding: 10,
                  borderRadius: 9,
                  borderWidth: 1,
                  borderColor:
                    rol === x
                      ? colors.primary
                      : colors.border,
                  backgroundColor:
                    rol === x
                      ? colors.light
                      : '#fff',
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    textAlign: 'center',
                    fontWeight: '700',
                    color:
                      rol === x
                        ? colors.dark
                        : colors.text,
                  }}
                >
                  {x}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Field
            label="CORREO"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Field
            label="CONTRASEÑA"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View
            style={{
              marginTop: 20,
            }}
          >
            <Button
              title="INICIAR SESIÓN"
              onPress={login}
              loading={loading}
            />
          </View>

          {error ? (
            <Text
              style={[
                common.error,
                {
                  marginTop: 12,
                  textAlign: 'center',
                },
              ]}
            >
              {error}
            </Text>
          ) : null}

          <View
            style={{
              marginTop: 18,
              alignItems: 'center',
              gap: 14,
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Register')
              }
            >
              <Text
                style={{
                  color: colors.dark,
                  fontWeight: '700',
                }}
              >
                ¿No tienes una cuenta? Regístrate
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Recovery')
              }
            >
              <Text
                style={{
                  color: colors.dark,
                  fontWeight: '700',
                }}
              >
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Home')
              }
              style={{
                marginTop: 4,
                paddingVertical: 8,
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontWeight: '800',
                  fontSize: 15,
                }}
              >
                ← Volver al inicio
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}