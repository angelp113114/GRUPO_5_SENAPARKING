import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Header from '../Header';
import { colors, common } from '../../theme';
import styles from './featureStyles';

export default function InfoHome({
  title,
  navigation,
  user,
}: any) {
  const role =
    user?.rol ||
    'aprendiz';

  return (
    <View
      style={common.screen}
    >
      <Header
        title={title}
        navigation={
          navigation
        }
      />

      <ScrollView
        contentContainerStyle={
          common.content
        }
      >
        <View
          style={styles.hero}
        >
          <Text
            style={
              styles.heroSmall
            }
          >
            SENA PARKING
          </Text>

          <Text
            style={
              styles.heroTitle
            }
          >
            Control y gestión
            de acceso
          </Text>

          <Text
            style={
              styles.heroText
            }
          >
            Plataforma móvil para
            apoyar la administración
            del parqueadero, la
            identificación de
            aprendices y el control
            de entradas y salidas.
          </Text>
        </View>

        <View
          style={common.card}
        >
          <Text
            style={common.title}
          >
            Tu rol: {role}
          </Text>

          <Text
            style={{
              lineHeight: 23,
              color: colors.text,
            }}
          >
            Desde el menú puedes
            consultar únicamente
            las funciones habilitadas
            para tu perfil. Esta
            pantalla es informativa
            y no realiza operaciones.
          </Text>
        </View>

        <View
          style={common.card}
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Información general
          </Text>

          <Text
            style={
              styles.infoRow
            }
          >
            • Mantén tus datos
            actualizados.
          </Text>

          <Text
            style={
              styles.infoRow
            }
          >
            • Consulta documentos y
            solicitudes cuando estén
            disponibles.
          </Text>

          <Text
            style={
              styles.infoRow
            }
          >
            • Revisa las
            notificaciones para
            conocer respuestas y
            novedades.
          </Text>

          <Text
            style={
              styles.infoRow
            }
          >
            • El personal de guarda
            valida el carnet mediante
            QR.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* =========================================================
   MANUAL
========================================================= */

