import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Header from '../Header';
import { colors, common } from '../../theme';
import styles from './featureStyles';

export default function Manual({
  title,
  navigation,
  user,
}: any) {
  const role =
    user?.rol ||
    'aprendiz';

  const content: any = {
    aprendiz: [
      [
        '01',
        'Inicio',
        'La pantalla de inicio es informativa. Usa el menú para entrar a las funciones disponibles.',
      ],
      [
        '02',
        'Carnet',
        'Consulta tu carnet, estado, información personal, vehículo asociado y código QR.',
      ],
      [
        '03',
        'Petición de carnet',
        'Selecciona el tipo de vehículo, completa los datos y adjunta los documentos requeridos para la primera solicitud.',
      ],
      [
        '04',
        'Actualizar datos',
        'En datos personales la cédula es opcional y no se solicitan fotos de serial, tarjeta de propiedad ni foto de cédula. En vehículo, serial y documentos son opcionales; en moto los documentos son opcionales.',
      ],
      [
        '05',
        'Soporte técnico',
        'Crea una solicitud con asunto y descripción. Luego consulta la pestaña Respondidos para ver la respuesta del administrador.',
      ],
      [
        '06',
        'Notificaciones',
        'La campana muestra el contador de pendientes y las respuestas de soporte aparecen como notificaciones.',
      ],
      [
        '07',
        'Mis vehículos',
        'Consulta las fotos, datos y vehículo registrado.',
      ],
    ],

    guarda: [
      [
        '01',
        'Inicio',
        'La pantalla de inicio es únicamente informativa.',
      ],
      [
        '02',
        'Escanear QR',
        'Permite leer el QR del carnet activo. Después del escaneo se muestran los datos del aprendiz y del vehículo antes de registrar el movimiento.',
      ],
      [
        '03',
        'Entrada y salida',
        'Cada escaneo alterna entre entrada y salida. El historial se muestra en páginas de 10 registros.',
      ],
      [
        '04',
        'Reportes',
        'Desde Entrada y salida puedes generar un resumen diario, semanal o mensual con totales y movimientos del periodo.',
      ],
    ],

    administrador: [
      [
        '01',
        'Inicio',
        'La pantalla de inicio es únicamente informativa.',
      ],
      [
        '02',
        'Peticiones de carnet',
        'Revisa información, fotografías y archivos anexos. Abre cada documento desde la tarjeta antes de aprobar o rechazar.',
      ],
      [
        '03',
        'Actualizaciones',
        'Compara datos anteriores y nuevos. Los archivos adjuntos se muestran como tarjetas y se pueden abrir.',
      ],
      [
        '04',
        'Vehículos y usuarios',
        'Consulta y administra la información registrada.',
      ],
      [
        '05',
        'Soporte técnico',
        'Atiende solicitudes y responde al aprendiz. Al resolver una solicitud se envía una notificación automáticamente.',
      ],
      [
        '06',
        'Entradas y salidas',
        'Consulta el historial paginado de 10 en 10 y genera reportes por día, semana o mes.',
      ],
      [
        '07',
        'Catálogos y bloqueos',
        'Gestiona centros, tipos de documento y estados de usuario.',
      ],
    ],
  };

  const sections =
    content[role] || [];

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
          style={
            styles.manualIntro
          }
        >
          <Text
            style={common.title}
          >
            Manual del {role}
          </Text>

          <Text
            style={
              common.subtitle
            }
          >
            Guía rápida para utilizar
            SENA Parking.
          </Text>
        </View>

        {sections.map(
          (x: any) => (
            <View
              key={x[0]}
              style={
                styles.manualCard
              }
            >
              <View
                style={styles.num}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontWeight:
                      '900',
                  }}
                >
                  {x[0]}
                </Text>
              </View>

              <View
                style={{ flex: 1 }}
              >
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  {x[1]}
                </Text>

                <Text
                  style={{
                    lineHeight: 22,
                    color:
                      colors.text,
                    marginTop: 4,
                  }}
                >
                  {x[2]}
                </Text>
              </View>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}

/* =========================================================
   ESTILOS
========================================================= */

