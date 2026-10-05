
import React, { useEffect, useState } from 'react';

import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../App';

import {
  resources,
  messageOf,
} from '../data/api';

import {
  colors,
  common,
} from '../theme';

import Header from '../components/Header';
import Button from '../components/Button';
import Field from '../components/Field';

type P = NativeStackScreenProps<
  RootStackParamList,
  'Feature'
>;

const config: any = {
  home: {
    kind: 'home',
  },

  vehicles: {
    kind: 'list',
    fn: 'vehicles',
    empty: 'No hay vehículos registrados.',
  },

  records: {
    kind: 'list',
    fn: 'records',
    empty: 'No hay registros de entrada y salida.',
  },

  users: {
    kind: 'list',
    fn: 'users',
    empty: 'No hay usuarios.',
  },

  pending: {
    kind: 'list',
    fn: 'requestsCarnet',
    empty: 'No hay solicitudes de carnet.',
  },

  updateRequests: {
    kind: 'list',
    fn: 'requestsUpdate',
    empty: 'No hay solicitudes de actualización.',
  },

  reports: {
    kind: 'list',
    fn: 'reports',
    empty: 'No hay reportes.',
  },

  support: {
    kind: 'support',
  },

  supportAdmin: {
    kind: 'list',
    fn: 'supports',
    empty: 'No hay soportes pendientes.',
  },

  notifications: {
    kind: 'list',
    fn: 'notifications',
    empty: 'No hay notificaciones.',
  },

  centers: {
    kind: 'list',
    fn: 'centers',
    empty: 'No hay centros.',
  },

  docs: {
    kind: 'list',
    fn: 'docs',
    empty: 'No hay tipos de documento.',
  },

  config: {
    kind: 'list',
    fn: 'config',
    empty: 'No hay configuración.',
  },

  request: {
    kind: 'form',
    form: 'request',
  },

  update: {
    kind: 'form',
    form: 'update',
  },

  ingreso: {
    kind: 'form',
    form: 'ingreso',
  },

  manual: {
    kind: 'manual',
  },

  blocks: {
    kind: 'list',
    fn: 'users',
    empty: 'Consulta los usuarios para gestionar bloqueos.',
  },
};

function pickData(d: any) {
  if (Array.isArray(d)) {
    return d;
  }

  return (
    d?.data ||
    d?.rows ||
    d?.users ||
    d?.notificaciones ||
    d?.solicitudes ||
    d?.registros ||
    []
  );
}

export default function GenericScreen({
  route,
  navigation,
}: P) {

  const { key, title } = route.params;

  console.log(
    'FEATURE ABIERTA:',
    key,
    title
  );

  const c =
    config[key] || {
      kind: 'home',
    };

  const [items, setItems] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refresh, setRefresh] =
    useState(false);

  const [error, setError] =
    useState('');

  const ITEMS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalItems, setTotalItems] =
    useState(0);

  const [search, setSearch] =
    useState('');

  /*
   * Estas dos pantallas usan
   * paginación real del backend.
   */
  const isBackendPaginated =
    key === 'pending' ||
    key === 'updateRequests';

  /*
   * =====================================================
   * CAMBIO DE PANTALLA
   * =====================================================
   */

  useEffect(() => {

    setCurrentPage(1);
    setSearch('');
    setItems([]);
    setTotalPages(1);
    setTotalItems(0);
    setError('');

  }, [key]);

  /*
   * =====================================================
   * CARGAR INFORMACIÓN
   * =====================================================
   */

  useEffect(() => {

    load();

  }, [
    key,
    currentPage,
    search,
  ]);

  const load = async () => {

    if (!c.fn) {

      setLoading(false);

      return;
    }

    try {

      setLoading(true);
      setError('');

      /*
       * =================================================
       * PETICIONES DE CARNET
       * =================================================
       */

      if (key === 'pending') {

        console.log(
          'CARGANDO PETICIONES CARNET:',
          {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            search: search.trim(),
          }
        );

        const r = await resources.requestsCarnet({
  page: currentPage,
  limit: ITEMS_PER_PAGE,
  search: search.trim(),
});

        console.log(
          'RESPUESTA PETICIONES CARNET:',
          r?.data
        );

        const response =
          r?.data || {};

        const data =
          Array.isArray(response)
            ? response
            : Array.isArray(response.data)
              ? response.data
              : [];

        const pagination =
          response.pagination || {};

        console.log(
          'DATOS CARNET:',
          data
        );

        console.log(
          'PAGINACIÓN CARNET:',
          pagination
        );

        setItems(data);

        setTotalItems(
          Number(
            pagination.total ??
            data.length
          )
        );

        setTotalPages(
          Math.max(
            1,
            Number(
              pagination.totalPages ??
              1
            )
          )
        );

        return;
      }

      /*
       * =================================================
       * PETICIONES DE ACTUALIZACIÓN
       * =================================================
       */

      if (key === 'updateRequests') {

        console.log(
          'CARGANDO PETICIONES ACTUALIZACIÓN:',
          {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            search: search.trim(),
          }
        );

        const r =
          await resources.requestsUpdate(
            currentPage,
            ITEMS_PER_PAGE,
            search.trim()
          );

        console.log(
          'RESPUESTA ACTUALIZACIONES:',
          r?.data
        );

        const response =
          r?.data || {};

        const data =
          Array.isArray(response)
            ? response
            : Array.isArray(response.data)
              ? response.data
              : [];

        const pagination =
          response.pagination || {};

        console.log(
          'DATOS ACTUALIZACIONES:',
          data
        );

        console.log(
          'PAGINACIÓN ACTUALIZACIONES:',
          pagination
        );

        setItems(data);

        setTotalItems(
          Number(
            pagination.total ??
            data.length
          )
        );

        setTotalPages(
          Math.max(
            1,
            Number(
              pagination.totalPages ??
              1
            )
          )
        );

        return;
      }

      /*
       * =================================================
       * RESTO DE LISTAS
       * =================================================
       */

      const fn =
        (resources as any)[c.fn];

      if (typeof fn !== 'function') {

        throw new Error(
          `No existe la función ${c.fn} en resources`
        );
      }

      const r =
        await fn();

      const data =
        pickData(r?.data);

      const lista =
        Array.isArray(data)
          ? data
          : [];

      setItems(lista);

      setTotalItems(
        lista.length
      );

      setTotalPages(
        Math.max(
          1,
          Math.ceil(
            lista.length /
            ITEMS_PER_PAGE
          )
        )
      );

    } catch (e) {

      console.error(
        `ERROR CARGANDO ${key}:`,
        e
      );

      setError(
        messageOf(e)
      );

      setItems([]);

    } finally {

      setLoading(false);
      setRefresh(false);

    }
  };

  /*
   * =====================================================
   * PAGINACIÓN LOCAL
   * =====================================================
   */

  const paginatedItems =
    isBackendPaginated
      ? items
      : items.slice(
          (currentPage - 1) *
          ITEMS_PER_PAGE,

          currentPage *
          ITEMS_PER_PAGE
        );

  /*
   * =====================================================
   * APROBAR
   * =====================================================
   */

  const aprobar = async (
    id: any
  ) => {

    try {

      if (key === 'pending') {

        await resources.approveCarnetRequest(
          id
        );

      } else if (
        key === 'updateRequests'
      ) {

        await resources.updateRequestsApprove(
          id
        );
      }

      Alert.alert(
        'Listo',
        'Solicitud aprobada correctamente.'
      );

      await load();

    } catch (e) {

      Alert.alert(
        'Error',
        messageOf(e)
      );

    }
  };

  /*
   * =====================================================
   * RECHAZAR
   * =====================================================
   */

  const rechazar = async (
    id: any
  ) => {

    try {

      if (key === 'pending') {

        if (
          typeof (
            resources as any
          ).rejectCarnetRequest !==
          'function'
        ) {

          Alert.alert(
            'Aviso',
            'El backend todavía no tiene configurado el rechazo de solicitudes de carnet.'
          );

          return;
        }

        await (
          resources as any
        ).rejectCarnetRequest(id);

      } else if (
        key === 'updateRequests'
      ) {

        await resources.updateRequestsReject(
          id
        );
      }

      Alert.alert(
        'Listo',
        'Solicitud rechazada correctamente.'
      );

      await load();

    } catch (e) {

      Alert.alert(
        'Error',
        messageOf(e)
      );

    }
  };

  /*
   * =====================================================
   * RENDER ITEM
   * =====================================================
   */

  const renderItem = (
    x: any,
    i: number
  ) => {

    const usuario =
      x?.user ||
      x?.usuario ||
      {};

    const nombre =
      usuario?.nombres ||
      x?.nombres ||
      x?.nombre ||
      x?.titulo ||
      x?.asunto ||
      x?.codigoQr ||
      `Registro #${x?.id ?? i + 1}`;

    const apellido =
      usuario?.apellidos ||
      x?.apellidos ||
      '';

    const documento =
      usuario?.documento ||
      x?.documento ||
      '';

    const placaSerial =
      x?.serialPlaca ||
      x?.placa ||
      x?.serial ||
      x?.vehiculo?.placa ||
      x?.vehiculo?.serial ||
      '';

    const estado =
      x?.estado ||
      '';

    return (

      <View
        key={
          x?.id ??
          x?.codigoQr ??
          i
        }
        style={common.card}
      >

        <Text
          style={{
            fontWeight: '900',
            color: colors.dark,
            fontSize: 17,
          }}
        >
          {nombre} {apellido}
        </Text>

        {/* PETICIÓN DE CARNET */}

        {key === 'pending' && (

          <View
            style={{
              marginTop: 10,
            }}
          >

            <Text
              style={{
                fontWeight: '700',
                marginBottom: 4,
              }}
            >
              Documento:{' '}
              {documento || '—'}
            </Text>

            <Text
              style={{
                fontWeight: '700',
                marginBottom: 4,
              }}
            >
              Placa / Serial:{' '}
              {placaSerial || '—'}
            </Text>

            <Text
              style={{
                marginBottom: 4,
              }}
            >
              Tipo de vehículo:{' '}
              {x?.tipoVehiculo ||
                x?.vehiculo?.tipo ||
                '—'}
            </Text>

            <Text
              style={{
                marginBottom: 4,
              }}
            >
              Estado:{' '}
              {estado || 'pendiente'}
            </Text>

          </View>

        )}

        {/* PETICIÓN ACTUALIZACIÓN */}

        {key === 'updateRequests' && (

          <View
            style={{
              marginTop: 10,
            }}
          >

            <Text>
              Documento:{' '}
              {documento || '—'}
            </Text>

            <Text>
              Estado:{' '}
              {estado || '—'}
            </Text>

            <Text
              style={{
                color: colors.muted,
                marginTop: 5,
              }}
            >
              {x?.tipo ||
                x?.descripcion ||
                x?.mensaje ||
                ''}
            </Text>

          </View>

        )}

        {/* RESTO */}

        {key !== 'pending' &&
          key !== 'updateRequests' && (

          <Text
            style={{
              color: colors.muted,
              marginTop: 5,
            }}
          >
            {x?.email ||
              x?.estado ||
              x?.descripcion ||
              x?.mensaje ||
              x?.hora_entrada ||
              JSON.stringify(x)
                .slice(0, 180)}
          </Text>

        )}

        {/* BOTONES */}

        {(key === 'pending' ||
          key === 'updateRequests') && (

          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              marginTop: 15,
            }}
          >

            <Button
              title="APROBAR"
              onPress={() =>
                aprobar(x.id)
              }
            />

            <Button
              title="RECHAZAR"
              outline
              onPress={() =>
                rechazar(x.id)
              }
            />

          </View>

        )}

      </View>
    );
  };

  /*
   * =====================================================
   * FORMULARIOS
   * =====================================================
   */

  const [desc, setDesc] =
    useState('');

  const [qr, setQr] =
    useState('');

  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {

    import(
      '@react-native-async-storage/async-storage'
    )
      .then(
        (m) =>
          m.default
            .getItem('user')
            .then(
              (x) => {

                if (x) {

                  setUser(
                    JSON.parse(x)
                  );

                }

              }
            )
      );

  }, []);

  const submit = async (
    form: string
  ) => {

    try {

      if (form === 'support') {

        await resources.createSupport({
          asunto:
            'Soporte desde app móvil',
          descripcion: desc,
        });

      } else if (
        form === 'request'
      ) {

        Alert.alert(
          'Solicitud de carnet',
          'La solicitud de carnet debe realizarse desde el formulario de Petición de carnet.'
        );

        return;

      } else if (
        form === 'update'
      ) {

        await resources.updateUser(
          user?.id,
          {
            ...user,
          }
        );

      } else if (
        form === 'ingreso'
      ) {

        await resources.scan(
          qr
        );
      }

      Alert.alert(
        'SENA PARKING',
        'Operación realizada correctamente.'
      );

      setDesc('');

      await load();

    } catch (e) {

      Alert.alert(
        'Error',
        messageOf(e)
      );
    }
  };

  /*
   * =====================================================
   * PANTALLA
   * =====================================================
   */

  return (

    <View style={common.screen}>

      <Header
        title={title}
        navigation={navigation}
      />

      <ScrollView
        contentContainerStyle={
          common.content
        }
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {

              setRefresh(true);

              load();

            }}
          />
        }
      >

        {/* HOME */}

        {c.kind === 'home' && (

          <View style={common.card}>

            <Text style={common.title}>
              Inicio
            </Text>

            <Text
              style={common.subtitle}
            >
              Gestiona las funciones de
              SENA Parking desde tu
              dispositivo móvil.
            </Text>

          </View>

        )}

        {/* MANUAL */}

        {c.kind === 'manual' && (

          <View style={common.card}>

            <Text style={common.title}>
              Manual de uso
            </Text>

            <Text
              style={{
                lineHeight: 24,
                color: colors.text,
              }}
            >
              Usa el menú para entrar a
              cada módulo. Los aprendices
              pueden consultar su carnet,
              vehículos, solicitudes,
              soporte y registros. Los
              guardas pueden escanear QR y
              controlar entradas y salidas.
              Los administradores gestionan
              usuarios, solicitudes,
              reportes y catálogos.
            </Text>

          </View>

        )}

        {/* FORMULARIOS */}

        {c.kind === 'form' && (

          <View style={common.card}>

            {c.form === 'support' ? (

              <Field
                label="Descripción"
                value={desc}
                onChangeText={setDesc}
                multiline
                numberOfLines={5}
              />

            ) : c.form === 'ingreso' ? (

              <>
                <Field
                  label="Código QR"
                  value={qr}
                  onChangeText={setQr}
                />

                <Text
                  style={common.subtitle}
                >
                  También puedes usar el
                  módulo Escanear QR del
                  guarda.
                </Text>
              </>

            ) : c.form === 'request' ? (

              <Text
                style={common.subtitle}
              >
                La solicitud se crea con
                los datos y documentos del
                aprendiz.
              </Text>

            ) : (

              <Text
                style={common.subtitle}
              >
                Aquí puedes gestionar la
                información asociada a tu
                usuario.
              </Text>

            )}

            <Button
              title="GUARDAR / ENVIAR"
              onPress={() =>
                submit(c.form)
              }
            />

          </View>

        )}

        {/* SOPORTE */}

        {c.kind === 'support' && (

          <View style={common.card}>

            <Text style={common.title}>
              Soporte técnico
            </Text>

            <Field
              label="Descripción"
              value={desc}
              onChangeText={setDesc}
              multiline
              numberOfLines={5}
            />

            <Button
              title="ENVIAR SOPORTE"
              onPress={() =>
                submit('support')
              }
            />

          </View>

        )}

        {/* =================================================
            LISTAS
        ================================================= */}

        {c.kind === 'list' && (

          <>

            {error ? (

              <Text
                style={common.error}
              >
                {error}
              </Text>

            ) : null}

            {/* =================================================
                BUSCADOR
            ================================================= */}

            {(key === 'pending' ||
              key === 'updateRequests') && (

              <View
                style={[
                  common.card,
                  {
                    marginBottom: 12,
                  },
                ]}
              >

                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '900',
                    color: colors.dark,
                    marginBottom: 10,
                  }}
                >
                  Buscar petición
                </Text>

                <TextInput
                  value={search}
                  onChangeText={(text) => {

                    setSearch(text);
                    setCurrentPage(1);

                  }}
                  placeholder={
                    key === 'pending'
                      ? 'Documento, placa o serial'
                      : 'Documento'
                  }
                  placeholderTextColor={
                    colors.muted
                  }
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    borderWidth: 1,
                    borderColor:
                      colors.border,
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 11,
                    color: colors.text,
                    backgroundColor: '#fff',
                  }}
                />

                {search.trim() !== '' && (

                  <Text
                    style={{
                      marginTop: 8,
                      color: colors.muted,
                    }}
                  >
                    Resultados encontrados:{' '}
                    {totalItems}
                  </Text>

                )}

              </View>

            )}

            {/* LOADING */}

            {loading && (

              <View
                style={common.card}
              >

                <Text>
                  Cargando...
                </Text>

              </View>

            )}

            {/* SIN RESULTADOS */}

            {!loading &&
              items.length === 0 && (

                <View
                  style={common.card}
                >

                  <Text>
                    {search.trim()
                      ? 'No se encontraron resultados con esa búsqueda.'
                      : c.empty}
                  </Text>

                </View>

            )}

            {/* CONTADOR */}

            {!loading &&
              isBackendPaginated && (

                <View
                  style={{
                    marginBottom: 10,
                  }}
                >

                  <Text
                    style={{
                      fontWeight: '800',
                      color: colors.dark,
                    }}
                  >
                    {totalItems} registros
                  </Text>

                  <Text
                    style={{
                      color: colors.muted,
                      marginTop: 3,
                    }}
                  >
                    Página {currentPage} de{' '}
                    {totalPages}
                  </Text>

                </View>

            )}

            {/* REGISTROS */}

            {!loading &&
              paginatedItems.map(
                renderItem
              )}

            {/* =================================================
                PAGINACIÓN
            ================================================= */}

            {!loading &&
              isBackendPaginated &&
              totalPages > 1 && (

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent:
                      'space-between',
                    marginTop: 8,
                    marginBottom: 20,
                  }}
                >

                  {/* ANTERIOR */}

                  <TouchableOpacity
                    disabled={
                      currentPage <= 1
                    }
                    onPress={() => {

                      if (
                        currentPage > 1
                      ) {

                        setCurrentPage(
                          currentPage - 1
                        );

                      }

                    }}
                    style={{
                      paddingHorizontal: 18,
                      paddingVertical: 12,
                      borderRadius: 10,
                      backgroundColor:
                        currentPage <= 1
                          ? '#ddd'
                          : colors.dark,
                    }}
                  >

                    <Text
                      style={{
                        color:
                          currentPage <= 1
                            ? '#888'
                            : '#fff',
                        fontWeight: '800',
                      }}
                    >
                      ANTERIOR
                    </Text>

                  </TouchableOpacity>

                  {/* PÁGINA */}

                  <Text
                    style={{
                      fontWeight: '900',
                      color: colors.dark,
                    }}
                  >
                    {currentPage} /{' '}
                    {totalPages}
                  </Text>

                  {/* SIGUIENTE */}

                  <TouchableOpacity
                    disabled={
                      currentPage >=
                      totalPages
                    }
                    onPress={() => {

                      if (
                        currentPage <
                        totalPages
                      ) {

                        setCurrentPage(
                          currentPage + 1
                        );

                      }

                    }}
                    style={{
                      paddingHorizontal: 18,
                      paddingVertical: 12,
                      borderRadius: 10,
                      backgroundColor:
                        currentPage >=
                        totalPages
                          ? '#ddd'
                          : colors.dark,
                    }}
                  >

                    <Text
                      style={{
                        color:
                          currentPage >=
                          totalPages
                            ? '#888'
                            : '#fff',
                        fontWeight: '800',
                      }}
                    >
                      SIGUIENTE
                    </Text>

                  </TouchableOpacity>

                </View>

            )}

          </>

        )}

      </ScrollView>

    </View>
  );
}

