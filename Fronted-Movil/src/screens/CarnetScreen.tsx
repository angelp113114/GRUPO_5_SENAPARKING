import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  resources,
  messageOf,
  fileUrl,
} from '../data/api';

import {
  colors,
  common,
} from '../theme';

import Header from '../components/Header';
import Button from '../components/Button';

const menus: any = {
  aprendiz: [
    ['home', 'Inicio'],
    ['carnet', 'Visualizar carnet'],
    ['request', 'Petición de carnet'],
    ['update', 'Actualizar datos'],
    ['myVehicles', 'Mis vehículos'],
    ['support', 'Soporte técnico'],
    ['notifications', 'Notificaciones'],
    ['manual', 'Manual de uso'],
  ],

  guarda: [
    ['home', 'Inicio'],
    ['scanner', 'Escanear QR'],
    ['records', 'Entrada y salida'],
    ['manual', 'Manual de uso'],
  ],

  administrador: [
    ['home', 'Inicio'],
    ['pending', 'Peticiones de carnet'],
    ['updateRequests', 'Peticiones actualización'],
    ['vehicles', 'Vehículos'],
    ['reports', 'Reportes solucionados'],
    ['users', 'Usuarios'],
    ['supportAdmin', 'Soporte técnico'],
    ['manual', 'Manual de uso'],
  ],
};

function Drawer({
  visible,
  onClose,
  user,
  navigation,
}: any) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,.35)',
        }}
      >
        <View
          style={{
            width: '84%',
            height: '100%',
            backgroundColor: '#fff',
            padding: 48,
            paddingHorizontal: 18,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 18,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: '900',
                color: colors.dark,
                flex: 1,
              }}
            >
              SENA PARKING
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Text style={{ fontSize: 28 }}>×</Text>
            </TouchableOpacity>
          </View>

          {(menus[user?.rol] || menus.aprendiz).map(
            (m: any) => (
              <TouchableOpacity
                key={m[0]}
                onPress={() => {
                  onClose();

                  if (m[0] === 'home') {
                    navigation.navigate('Dashboard');
                  } else if (m[0] === 'carnet') {
                    return;
                  } else if (m[0] === 'scanner') {
                    navigation.navigate('Scanner');
                  } else {
                    navigation.navigate('Feature', {
                      key: m[0],
                      title: m[1],
                    });
                  }
                }}
                style={{
                  paddingVertical: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <Text style={{ fontWeight: '800' }}>
                  {m[1]}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    </Modal>
  );
}

export default function CarnetScreen({
  navigation,
}: any) {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCarnets();
  }, []);

  const cargarCarnets = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await resources.carnet();

      console.log('CARNETS RECIBIDOS:', response.data);

      /*
       * El backend puede devolver:
       *
       * 1. Un solo carnet
       * 2. Un arreglo de carnets
       *
       * Normalizamos ambos casos para que
       * la aplicación siempre trabaje con un arreglo.
       */

      if (Array.isArray(response.data)) {
        setData(response.data);
      } else if (response.data) {
        setData([response.data]);
      } else {
        setData([]);
      }
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setLoading(false);
    }
  };

  const primerCarnet = data[0];

  const usuario = primerCarnet?.user || {};

  return (
    <View style={common.screen}>

      <Header
        title="Mi carnet SENA"
        navigation={navigation}
        onMenu={() => setMenu(true)}
      />

      <ScrollView
        contentContainerStyle={common.content}
      >

        {loading ? (
          <ActivityIndicator size="large" />

        ) : error ? (

          <Text style={common.error}>
            {error}
          </Text>

        ) : data.length === 0 ? (

          <View style={common.card}>
            <Text style={common.title}>
              SIN CARNETS
            </Text>

            <Text style={{ textAlign: 'center' }}>
              Aún no tienes ningún carnet generado.
            </Text>
          </View>

        ) : (

          <>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '900',
                color: colors.dark,
                marginBottom: 15,
              }}
            >
              Mis carnets ({data.length})
            </Text>

            {data.map(
              (carnet: any, index: number) => {

                const u = carnet?.user || usuario;
                const v = carnet?.vehiculo;

                return (
                  <View
                    key={
                      carnet.id ||
                      carnet.codigoQr ||
                      index
                    }
                  >

                    {/* =========================
                        CARNET
                    ========================== */}

                    <View style={common.card}>

                      <Text style={common.title}>
                        CARNET #{index + 1}
                      </Text>

                      <Text
                        style={{
                          textAlign: 'center',
                          marginBottom: 10,
                          fontWeight: '700',
                          color: colors.dark,
                        }}
                      >
                        CARNET DE INGRESO
                      </Text>

                      <View
                        style={{
                          alignItems: 'center',
                        }}
                      >

                        {u.foto && (
                          <Image
                            source={{
                              uri: fileUrl(u.foto),
                            }}
                            style={{
                              width: 130,
                              height: 160,
                              borderRadius: 12,
                              marginVertical: 10,
                            }}
                          />
                        )}

                        <Text
                          style={{
                            fontSize: 21,
                            fontWeight: '900',
                            textAlign: 'center',
                          }}
                        >
                          {u.nombres} {u.apellidos}
                        </Text>

                        <Text>
                          Rol: {u.rol || '—'}
                        </Text>

                        <Text>
                          Tipo de documento:{' '}
                          {u.tipoDocumento || '—'}
                        </Text>

                        <Text>
                          Documento: {u.documento || '—'}
                        </Text>

                        <Text>
                          Correo: {u.email || '—'}
                        </Text>

                        <Text>
                          Celular: {u.celular || '—'}
                        </Text>

                        <Text>
                          Ficha: {u.ficha || '—'}
                        </Text>

                        <Text>
                          Centro:{' '}
                          {u.centroFormacion?.nombre || '—'}
                        </Text>

                        <Text>
                          Vinculación:{' '}
                          {u.fechaVinculacion || '—'}
                        </Text>

                        <Text>
                          Finalización:{' '}
                          {u.fechaFinalizacion || '—'}
                        </Text>

                        <Text
                          style={{
                            fontWeight: '800',
                            marginTop: 5,
                          }}
                        >
                          Estado carnet:{' '}
                          {carnet.estado || '—'}
                        </Text>

                        {carnet.qrImage && (
                          <Image
                            source={{
                              uri: carnet.qrImage,
                            }}
                            style={{
                              width: 210,
                              height: 210,
                              margin: 18,
                            }}
                          />
                        )}

                      </View>
                    </View>


                    {/* =========================
                        VEHÍCULO DE ESTE CARNET
                    ========================== */}

                    {v && (
                      <View
                        style={[
                          common.card,
                          { marginTop: 0 },
                        ]}
                      >

                        <Text style={common.title}>
                          Vehículo del carnet #{index + 1}
                        </Text>

                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 10,
                          }}
                        >

                          {v.foto_principal && (
                            <Image
                              source={{
                                uri: fileUrl(
                                  v.foto_principal
                                ),
                              }}
                              style={{
                                flex: 1,
                                height: 150,
                                borderRadius: 12,
                              }}
                            />
                          )}

                          {v.foto_secundaria && (
                            <Image
                              source={{
                                uri: fileUrl(
                                  v.foto_secundaria
                                ),
                              }}
                              style={{
                                flex: 1,
                                height: 150,
                                borderRadius: 12,
                              }}
                            />
                          )}

                        </View>

                        <Text>
                          Tipo: {v.tipo || '—'}
                        </Text>

                        {v.marca && (
                          <Text>
                            Marca: {v.marca}
                          </Text>
                        )}

                        {v.color && (
                          <Text>
                            Color: {v.color}
                          </Text>
                        )}

                        {v.tipo === 'moto' &&
                          v.placa && (
                            <Text>
                              Placa: {v.placa}
                            </Text>
                          )}

                        {v.tipo === 'bicicleta' &&
                          v.serial && (
                            <Text>
                              Serial: {v.serial}
                            </Text>
                          )}

                        {v.cilindraje && (
                          <Text>
                            Cilindraje: {v.cilindraje}
                          </Text>
                        )}

                        {v.modelo && (
                          <Text>
                            Modelo: {v.modelo}
                          </Text>
                        )}

                      </View>
                    )}

                  </View>
                );
              }
            )}

            <Button
              title="VOLVER"
              outline
              onPress={() => navigation.goBack()}
            />
          </>
        )}

      </ScrollView>

      <Drawer
        visible={menu}
        onClose={() => setMenu(false)}
        user={usuario}
        navigation={navigation}
      />

    </View>
  );
}