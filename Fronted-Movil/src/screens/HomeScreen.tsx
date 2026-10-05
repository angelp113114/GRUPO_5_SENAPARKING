import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

type Props = {
  navigation: any;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#087f23"
      />

      <View style={styles.content}>

        {/* Logo / icono */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🚲</Text>
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>SENA PARKING</Text>

        <Text style={styles.subtitle}>
          Control inteligente de parqueadero
        </Text>

        <Text style={styles.description}>
          Gestiona de manera fácil y segura el ingreso y salida
          de bicicletas y motocicletas en el SENA.
        </Text>

        {/* Botones */}
        <View style={styles.buttonsContainer}>

          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.registerButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerButtonText}>
              Registrarse
            </Text>
          </TouchableOpacity>

        </View>

        {/* Información inferior */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>
            🚗 Parqueadero seguro
          </Text>

          <Text style={styles.infoText}>
            Una solución digital para facilitar el control
            y la seguridad del parqueadero.
          </Text>
        </View>

      </View>

      {/* Pie de página */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          SENA Parking
        </Text>

        <Text style={styles.footerSubtext}>
          Complejo Sur • 2026
        </Text>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#087f23',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  logoContainer: {
    marginBottom: 18,
  },

  logoCircle: {
    width: 105,
    height: 105,
    borderRadius: 53,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  logoIcon: {
    fontSize: 52,
  },

  title: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 7,
  },

  subtitle: {
    color: '#d9ffe1',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 18,
  },

  description: {
    color: '#ffffff',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    opacity: 0.92,
    maxWidth: 350,
    marginBottom: 35,
  },

  buttonsContainer: {
    width: '100%',
    maxWidth: 350,
    gap: 14,
  },

  loginButton: {
    backgroundColor: '#ffffff',
    height: 56,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5,
  },

  loginButtonText: {
    color: '#087f23',
    fontSize: 17,
    fontWeight: '800',
  },

  registerButton: {
    height: 56,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  registerButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },

  infoContainer: {
    marginTop: 35,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    padding: 17,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },

  infoTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },

  infoText: {
    color: '#e5ffe9',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },

  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },

  footerText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },

  footerSubtext: {
    color: '#c9f5d1',
    fontSize: 11,
    marginTop: 3,
  },
});