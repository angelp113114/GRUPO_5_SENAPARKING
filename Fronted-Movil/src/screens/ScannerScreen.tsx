
import React, { useState } from 'react';

import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera';

import {
  resources,
  messageOf,
  fileUrl,
} from '../data/api';

import { colors } from '../theme';

export default function ScannerScreen({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();

  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  // ============================================================
  // PERMISOS DE CÁMARA
  // ============================================================

  if (!permission) {
    return (
      <View style={s.center}>
        <Text>
          Solicitando cámara…
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={s.center}>
        <Text
          style={{
            textAlign: 'center',
            marginBottom: 15,
          }}
        >
          Necesitamos acceso a la cámara para escanear
          el carnet QR.
        </Text>

        <TouchableOpacity
          style={s.btn}
          onPress={requestPermission}
        >
          <Text style={s.bt}>
            PERMITIR CÁMARA
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ============================================================
  // ESCANEAR QR
  // ============================================================

  const scan = async ({ data }: any) => {
    // Evita múltiples lecturas del mismo QR
    if (scanned || processing) {
      return;
    }

    // Validar que realmente exista información
    const codigoQr = String(data || '').trim();

    if (!codigoQr) {
      return;
    }

    console.log(
      '================================================'
    );

    console.log(
      '📷 QR ESCANEADO:'
    );

    console.log(
      codigoQr
    );

    console.log(
      '================================================'
    );

    // Bloquear nuevos escaneos mientras consulta el backend
    setScanned(true);
    setProcessing(true);

    try {
      /**
       * IMPORTANTE:
       *
       * Se manda EXACTAMENTE el código leído.
       *
       * NO buscamos:
       * - el usuario
       * - el primer carnet
       * - mi-carnet
       * - el primer vehículo
       *
       * El backend debe buscar:
       *
       * codigoQr -> Carnet -> vehicleId -> Vehiculo
       */

      const r = await resources.scan(codigoQr);

      console.log(
        '📦 RESPUESTA ESCANEO:',
        JSON.stringify(r?.data, null, 2)
      );

      const datos = r?.data;

      if (!datos) {
        throw new Error(
          'El servidor no devolvió información del carnet.'
        );
      }

      /**
       * Guardamos DIRECTAMENTE la respuesta del escaneo.
       *
       * No hacemos otra consulta a /mi-carnet.
       */
      setResult(datos);

      Alert.alert(
        'SENA PARKING',
        datos?.message ||
          'Movimiento registrado correctamente'
      );
    } catch (e) {
      console.log(
        '❌ ERROR ESCANEANDO QR:',
        e
      );

      const mensaje = messageOf(e);

      setResult({
        error: mensaje,
        codigoQr,
      });

      Alert.alert(
        'Error',
        mensaje
      );
    } finally {
      setProcessing(false);
    }
  };

  // ============================================================
  // PANTALLA DE RESULTADO
  // ============================================================

  if (result) {
    return (
      <ScrollView
        contentContainerStyle={s.resultPage}
      >
        <Text style={s.resultTitle}>
          Carnet validado
        </Text>

        {result.error ? (
          <>
            <View style={s.errorCard}>
              <Text style={s.error}>
                {result.error}
              </Text>
            </View>

            {result.codigoQr && (
              <View style={s.card}>
                <Text style={s.cardTitle}>
                  Código escaneado
                </Text>

                <Text style={s.qrText}>
                  {result.codigoQr}
                </Text>
              </View>
            )}
          </>
        ) : (
          <>
            {/* ==================================================
                INFORMACIÓN DEL CARNET
            ================================================== */}

            <View style={s.card}>
              <Text style={s.cardTitle}>
                Carnet escaneado
              </Text>

              <Text>
                ID carnet:{' '}
                {result.carnet?.id || '—'}
              </Text>

              <Text>
                ID solicitud:{' '}
                {result.carnet?.solicitudId || '—'}
              </Text>

              <Text>
                ID vehículo:{' '}
                {result.carnet?.vehicleId || '—'}
              </Text>

              <Text style={s.qrLabel}>
                Código QR
              </Text>

              <Text style={s.qrText}>
                {result.carnet?.codigoQr ||
                  result.codigoQr ||
                  '—'}
              </Text>

              <Text style={s.carnetState}>
                Estado:{' '}
                {result.carnet?.estado ||
                  '—'}
              </Text>
            </View>

            {/* ==================================================
                APRENDIZ
            ================================================== */}

            <View style={s.card}>
              <Text style={s.cardTitle}>
                Aprendiz
              </Text>

              {result.user?.foto ? (
                <Image
                  source={{
                    uri: fileUrl(
                      result.user.foto
                    ),
                  }}
                  style={s.photo}
                />
              ) : null}

              <Text style={s.name}>
                {result.user?.nombres || ''}{' '}
                {result.user?.apellidos || ''}
              </Text>

              <Text>
                Documento:{' '}
                {result.user?.documento || '—'}
              </Text>

              <Text>
                Ficha:{' '}
                {result.user?.ficha || '—'}
              </Text>

              <Text>
                Centro:{' '}
                {result.user?.centroFormacion
                  ?.nombre || '—'}
              </Text>
            </View>

            {/* ==================================================
                VEHÍCULO DEL CARNET ESCANEADO
            ================================================== */}

            {result.vehiculo && (
              <View style={s.card}>
                <Text style={s.cardTitle}>
                  Vehículo del carnet
                </Text>

                {result.vehiculo
                  .foto_principal ? (
                  <Image
                    source={{
                      uri: fileUrl(
                        result.vehiculo
                          .foto_principal
                      ),
                    }}
                    style={s.vehiclePhoto}
                  />
                ) : null}

                <Text>
                  Tipo:{' '}
                  {result.vehiculo.tipo ||
                    '—'}
                </Text>

                <Text>
                  Marca:{' '}
                  {result.vehiculo.marca ||
                    '—'}
                </Text>

                <Text>
                  Color:{' '}
                  {result.vehiculo.color ||
                    '—'}
                </Text>

                {result.vehiculo.placa ? (
                  <Text>
                    Placa:{' '}
                    {result.vehiculo.placa}
                  </Text>
                ) : null}

                {result.vehiculo.serial ? (
                  <Text>
                    Serial:{' '}
                    {result.vehiculo.serial}
                  </Text>
                ) : null}

                {result.vehiculo.modelo ? (
                  <Text>
                    Modelo:{' '}
                    {result.vehiculo.modelo}
                  </Text>
                ) : null}

                {result.vehiculo.cilindraje ? (
                  <Text>
                    Cilindraje:{' '}
                    {result.vehiculo.cilindraje}
                  </Text>
                ) : null}
              </View>
            )}

            {/* ==================================================
                MOVIMIENTO
            ================================================== */}

            <View style={s.card}>
              <Text style={s.cardTitle}>
                Movimiento
              </Text>

              <Text style={s.message}>
                {result.message ||
                  'Movimiento registrado'}
              </Text>

              <Text>
                Fecha:{' '}
                {result.registro?.fecha ||
                  '—'}
              </Text>

              <Text>
                Entrada:{' '}
                {result.registro
                  ?.hora_entrada
                  ? new Date(
                      result.registro
                        .hora_entrada
                    ).toLocaleString(
                      'es-CO'
                    )
                  : '—'}
              </Text>

              <Text>
                Salida:{' '}
                {result.registro
                  ?.hora_salida
                  ? new Date(
                      result.registro
                        .hora_salida
                    ).toLocaleString(
                      'es-CO'
                    )
                  : '—'}
              </Text>

              <Text style={s.state}>
                {result.estado === 'dentro'
                  ? '🟢 Entrada registrada'
                  : '⚪ Salida registrada'}
              </Text>
            </View>
          </>
        )}

        {/* ======================================================
            ESCANEAR OTRO
        ====================================================== */}

        <TouchableOpacity
          style={s.btn}
          onPress={() => {
            setResult(null);
            setScanned(false);
            setProcessing(false);
          }}
        >
          <Text style={s.bt}>
            ESCANEAR OTRO CARNET
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text style={s.backDark}>
            Volver
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ============================================================
  // CÁMARA
  // ============================================================

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000',
      }}
    >
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={
          scanned || processing
            ? undefined
            : scan
        }
      />

      <View style={s.overlay}>
        <Text style={s.title}>
          ESCANEAR CARNET
        </Text>

        <View style={s.square} />

        <Text style={s.hint}>
          Centra el código QR dentro del
          recuadro
        </Text>

        {processing && (
          <Text style={s.processing}>
            Consultando carnet...
          </Text>
        )}

        <TouchableOpacity
          style={s.btn}
          disabled={processing}
          onPress={() => {
            setScanned(false);
            setProcessing(false);
          }}
        >
          <Text style={s.bt}>
            ESCANEAR DE NUEVO
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text style={s.back}>
            Volver
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const s = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },

  
overlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 25,
},



  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 25,
  },

  square: {
    width: 260,
    height: 260,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 20,
  },

  hint: {
    color: '#fff',
    marginTop: 20,
    textAlign: 'center',
  },

  processing: {
    color: '#fff',
    fontWeight: '800',
    marginTop: 15,
  },

  btn: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },

  bt: {
    color: '#fff',
    fontWeight: '900',
  },

  back: {
    color: '#fff',
    fontWeight: '800',
    marginTop: 15,
  },

  resultPage: {
    padding: 20,
    backgroundColor: colors.bg,
    flexGrow: 1,
  },

  resultTitle: {
    fontSize: 27,
    fontWeight: '900',
    color: colors.dark,
    marginBottom: 15,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },

  errorCard: {
    backgroundColor: '#FFEBEE',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },

  photo: {
    width: 120,
    height: 150,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 12,
  },

  vehiclePhoto: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },

  name: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.dark,
    marginBottom: 8,
    textAlign: 'center',
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.dark,
    marginBottom: 10,
  },

  qrLabel: {
    marginTop: 12,
    fontWeight: '900',
    color: colors.dark,
  },

  qrText: {
    marginTop: 5,
    fontSize: 12,
    color: colors.dark,
    fontWeight: '700',
  },

  carnetState: {
    marginTop: 10,
    fontWeight: '900',
  },

  state: {
    fontWeight: '900',
    color: colors.dark,
    marginTop: 12,
  },

  message: {
    fontWeight: '800',
    marginBottom: 10,
  },

  error: {
    color: colors.danger,
    fontWeight: '800',
  },

  backDark: {
    color: colors.dark,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
});
