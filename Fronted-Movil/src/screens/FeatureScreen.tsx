import React, { useEffect, useState } from 'react';

import {
  Alert,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import {
  resources,
  auth,
  messageOf,
  fileUrl,
  api,
} from '../data/api';

import {
  colors,
  common,
} from '../theme';

import Header from '../components/Header';
import Button from '../components/Button';
import Field from '../components/Field';
import SelectField from '../components/SelectField';
import DatePickerField from '../components/DatePickerField';
import FileViewerModal from '../components/FileViewerModal';

/* =========================================================
   UTILIDADES
========================================================= */

const statusText = (s: any) =>
  ({
    pendiente: '⏳ Pendiente',
    aprobada: '🟢 Aprobada',
    rechazada: '❌ Rechazada',
    carnet_generado: '⚡ Carnet generado',
    Pendiente: '⏳ Pendiente',
    'En proceso': '🟡 En proceso',
    Resuelto: '✅ Resuelto',
  } as any)[s] || s || 'Sin estado';

const arr = (d: any) =>
  Array.isArray(d)
    ? d
    : (
        d?.data ||
        d?.rows ||
        d?.users ||
        d?.solicitudes ||
        d?.registros ||
        d?.notificaciones ||
        []
      );

const uriFile = (a: any) =>
  a
    ? {
        uri: a.uri,
        name: a.fileName || a.name || `archivo-${Date.now()}`,
        type: a.mimeType || 'application/octet-stream',
      }
    : null;

/* =========================================================
   MENÚS
========================================================= */

const menus: any = {
  aprendiz: [
    ['home', 'Inicio', '⌂'],
    ['perfil', 'Mi perfil', '👤'],
    ['carnet', 'Visualizar carnet', '▣'],
    ['request', 'Petición de carnet', '▤'],
    ['update', 'Actualizar datos', '✎'],
    ['myVehicles', 'Mis vehículos', '🚗'],
    ['support', 'Soporte técnico', '⚙'],
    ['notifications', 'Notificaciones', '🔔'],
    ['manual', 'Manual del aprendiz', '?'],
  ],

  guarda: [
    ['home', 'Inicio', '⌂'],
    ['scanner', 'Escanear QR', '⌗'],
    ['records', 'Entrada y salida', '↕'],
    ['manual', 'Manual del guarda', '?'],
  ],

  administrador: [
    ['home', 'Inicio', '⌂'],
    ['pending', 'Peticiones de carnet', '✓'],
    ['updateRequests', 'Peticiones actualización', '↻'],
    ['vehicles', 'Vehículos', '🚗'],
    ['blocks', 'Bloqueos', '⛔'],
    ['reports', 'Reportes solucionados', '▤'],
    ['centers', 'Centros de formación', '⌖'],
    ['docs', 'Tipos de documento', '▥'],
    ['users', 'Usuarios', '♟'],
    ['supportAdmin', 'Soporte técnico', '◉'],
    ['records', 'Entradas y salidas', '↕'],
    ['manual', 'Manual de administrador', '?'],
  ],
};

/* =========================================================
   DRAWER
========================================================= */

function RoleDrawer({
  visible,
  onClose,
  user,
  navigation,
}: {
  visible: boolean;
  onClose: () => void;
  user: any;
  navigation: any;
}) {
  const list =
    menus[user?.rol || 'aprendiz'] || menus.aprendiz;

  const go = (k: string, t: string) => {
    onClose();

    if (k === 'home') {
      navigation.navigate('Dashboard');
    } else if (k === 'perfil') {
      navigation.navigate('PerfilAprendiz');
    } else if (k === 'carnet') {
      navigation.navigate('Carnet');
    } else if (k === 'scanner') {
      navigation.navigate('Scanner');
    } else {
      navigation.navigate('Feature', {
        key: k,
        title: t,
      });
    }
  };

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
            width: '86%',
            height: '100%',
            backgroundColor: '#fff',
            paddingTop: 48,
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
            <View style={styles.logo}>
              <Text style={{ fontSize: 22 }}>🅿️</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.brand}>
                SENA PARKING
              </Text>

              <Text style={styles.role}>
                {user?.rol || ''}
              </Text>
            </View>

            <TouchableOpacity onPress={onClose}>
              <Text style={{ fontSize: 28 }}>
                ×
              </Text>
            </TouchableOpacity>
          </View>

          {list.map((m: any) => (
            <TouchableOpacity
              key={m[0]}
              onPress={() => go(m[0], m[1])}
              style={styles.menuItem}
            >
              <Text style={styles.menuIcon}>
                {m[2]}
              </Text>

              <Text style={styles.menuText}>
                {m[1]}
              </Text>

              <Text
                style={{
                  color: colors.muted,
                  fontSize: 20,
                }}
              >
                ›
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

/* =========================================================
   FEATURE SCREEN
========================================================= */

export default function FeatureScreen({
  route,
  navigation,
}: any) {
  const { key, title } = route.params;

  const [user, setUser] = useState<any>({});
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [menu, setMenu] = useState(false);

  const [supportTab, setSupportTab] =
    useState('todos');

  const [filterName, setFilterName] = useState('');
  const [filterDoc, setFilterDoc] = useState('');

  /* =======================================================
     VEHÍCULOS
  ======================================================= */

  const [vehicleSearch, setVehicleSearch] =
    useState('');

  const [vehicleTotal, setVehicleTotal] =
    useState(0);

  /* =======================================================
     BLOQUEOS
  ======================================================= */

  const [blockSearch, setBlockSearch] =
    useState('');

  const [blockTotal, setBlockTotal] =
    useState(0);

  /* =======================================================
     SOPORTE ADMIN
  ======================================================= */

  const [supportSearch, setSupportSearch] =
    useState('');

  const [supportTotal, setSupportTotal] =
    useState(0);

  /* =======================================================
     PETICIONES DE CARNET
  ======================================================= */

  const [carnetSearch, setCarnetSearch] =
    useState('');

  const [carnetTotal, setCarnetTotal] =
    useState(0);

  const [carnetReport, setCarnetReport] =
    useState<any>(null);

  const [
    carnetReportLoading,
    setCarnetReportLoading,
  ] = useState(false);

  /* =======================================================
     PETICIONES DE ACTUALIZACIÓN
  ======================================================= */

  const [updateSearch, setUpdateSearch] =
    useState('');

  const [updateTotal, setUpdateTotal] =
    useState(0);

  const pageSize = 10;

  const isVehicleKey =
    key === 'vehicles' ||
    key === 'myVehicles';

  const isBlockKey =
    key === 'blocks';

  const isSupportAdminKey =
    key === 'supportAdmin';

  const isCarnetKey =
    key === 'pending';

  const isUpdateKey =
    key === 'updateRequests';

  /* =======================================================
     CARGAR INFORMACIÓN
  ======================================================= */

  const load = async (
    targetPage = page,
    targetSearch = ''
  ) => {
    setError('');
    setLoading(true);

    try {
      let r: any;

      switch (key) {
        case 'notifications':
          r = await resources.notifications();
          break;

        case 'support':
          r = await resources.mySupports();
          break;

        case 'supportAdmin':
          r = await resources.supports({
            page: targetPage,
            limit: pageSize,
            search: targetSearch.trim(),
          });
          break;

        case 'myVehicles':
          r = await resources.myVehicles({
            page: targetPage,
            limit: pageSize,
            search: targetSearch.trim(),
          });
          break;

        case 'vehicles':
          r = await resources.vehicles({
            page: targetPage,
            limit: pageSize,
            search: targetSearch.trim(),
          });
          break;

        case 'records':
          r = await resources.records();
          break;

        case 'users':
          r = await resources.users();
          break;

        case 'pending':
          r = await resources.requestsCarnet({
            page: targetPage,
            limit: pageSize,
            search: targetSearch.trim(),
          });
          break;

        case 'updateRequests':
          r = await resources.requestsUpdate(
            targetPage,
            pageSize,
            targetSearch.trim()
          );
          break;

        case 'centers':
          r = await resources.centers();
          break;

        case 'docs':
          r = await resources.docs();
          break;

        case 'reports':
          r = await resources.reports();
          break;

        case 'blocks':
          r = await resources.users({
            page: targetPage,
            limit: pageSize,
            search: targetSearch.trim(),
          });
          break;

        default:
          r = null;
      }

      if (r) {
        setItems(arr(r.data));

        if (isVehicleKey) {
          setVehicleTotal(
            Number(
              r.data?.total ??
              r.data?.pagination?.total ??
              0
            )
          );
        }

        if (key === 'blocks') {
          setBlockTotal(
            Number(
              r.data?.total ??
              r.data?.pagination?.total ??
              0
            )
          );
        }

        if (key === 'supportAdmin') {
          setSupportTotal(
            Number(
              r.data?.total ??
              r.data?.pagination?.total ??
              0
            )
          );
        }

        if (key === 'pending') {
          setCarnetTotal(
            Number(
              r.data?.total ??
              r.data?.pagination?.total ??
              0
            )
          );
        }

        if (key === 'updateRequests') {
          setUpdateTotal(
            Number(
              r.data?.pagination?.total ??
              r.data?.total ??
              0
            )
          );
        }
      }
    } catch (e) {
      setError(messageOf(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =======================================================
     EFECTO INICIAL
  ======================================================= */

  useEffect(() => {
    AsyncStorage.getItem('user').then(
      (x) =>
        x &&
        setUser(JSON.parse(x))
    );

    setPage(1);

    setVehicleSearch('');
    setVehicleTotal(0);

    setBlockSearch('');
    setBlockTotal(0);

    setSupportSearch('');
    setSupportTotal(0);

    setCarnetSearch('');
    setCarnetTotal(0);

    setUpdateSearch('');
    setUpdateTotal(0);

    setCarnetReport(null);

    load(1, '');
  }, [key]);

  /* =======================================================
     FORMULARIOS
  ======================================================= */

  if (
    [
      'request',
      'update',
      'support',
      'createCenter',
      'createDoc',
    ].includes(key)
  ) {
    return (
      <FormScreen
        keyName={key}
        title={title}
        user={user}
        navigation={navigation}
        onDone={load}
      />
    );
  }

  if (key === 'manual') {
    return (
      <Manual
        title={title}
        navigation={navigation}
        user={user}
      />
    );
  }

  if (key === 'home') {
    return (
      <InfoHome
        title={title}
        navigation={navigation}
        user={user}
      />
    );
  }

  /* =======================================================
     REFRESH
  ======================================================= */

  const refresh = () => {
    setRefreshing(true);

    if (isVehicleKey) {
      load(page, vehicleSearch);
      return;
    }

    if (isBlockKey) {
      load(page, blockSearch);
      return;
    }

    if (isCarnetKey) {
      load(page, carnetSearch);
      return;
    }

    if (isSupportAdminKey) {
      load(page, supportSearch);
      return;
    }

    if (isUpdateKey) {
      load(page, updateSearch);
      return;
    }

    load();
  };

  /* =======================================================
     NOTIFICACIONES
  ======================================================= */

  const markRead = async () => {
    await resources
      .markNotificationsRead()
      .catch(() => {});

    setItems(
      items.map((n) => ({
        ...n,
        leida: true,
        leido: true,
      }))
    );
  };

  /* =======================================================
     FILTROS LOCALES
  ======================================================= */

  let visibleItems = [...items];

  if (key === 'support') {
  visibleItems = visibleItems.filter((x) => {
    const estado = String(x.estado || '')
      .trim()
      .toLowerCase();

    if (supportTab === 'pendientes') {
      return ![
        'resuelto',
        'solucionado',
        'solucionada',
        'cerrado',
        'cerrada',
      ].includes(estado);
    }

    if (supportTab === 'resueltos') {
      return [
        'resuelto',
        'solucionado',
        'solucionada',
        'cerrado',
        'cerrada',
      ].includes(estado);
    }

    return true;
  });
}

  if (key === 'users') {
    visibleItems =
      visibleItems.filter(
        (x) =>
          (
            `${x.nombres || ''} ${
              x.apellidos || ''
            }`
          )
            .toLowerCase()
            .includes(
              filterName.toLowerCase()
            ) &&
          String(
            x.documento || ''
          ).includes(filterDoc)
      );
  }

  if (key === 'reports') {
    visibleItems =
      visibleItems.filter((x) =>
        [
          'resuelto',
          'solucionado',
          'solucionada',
        ].includes(
          String(
            x.estado || ''
          ).toLowerCase()
        )
      );
  }

  /* =======================================================
     PAGINACIÓN
  ======================================================= */

  const paged =
    isVehicleKey ||
    isBlockKey ||
    isSupportAdminKey ||
    isCarnetKey ||
    isUpdateKey
      ? visibleItems
      : key === 'users' ||
        key === 'records'
      ? visibleItems.slice(
          (page - 1) * pageSize,
          page * pageSize
        )
      : visibleItems;

  /* =======================================================
     BÚSQUEDA VEHÍCULOS
  ======================================================= */

  const searchVehicles = () => {
    setPage(1);
    load(
      1,
      vehicleSearch.trim()
    );
  };

  const clearVehicleSearch = () => {
    setVehicleSearch('');
    setPage(1);
    load(1, '');
  };

  const changeVehiclePage = (
    nextPage: number
  ) => {
    const totalPages = Math.max(
      1,
      Math.ceil(
        vehicleTotal / pageSize
      )
    );

    const newPage = Math.min(
      totalPages,
      Math.max(1, nextPage)
    );

    if (newPage === page) {
      return;
    }

    setPage(newPage);

    load(
      newPage,
      vehicleSearch
    );
  };

  /* =======================================================
     BÚSQUEDA BLOQUEOS
  ======================================================= */

  const searchBlocks = () => {
    setPage(1);
    load(
      1,
      blockSearch.trim()
    );
  };

  const clearBlockSearch = () => {
    setBlockSearch('');
    setPage(1);
    load(1, '');
  };

  const changeBlockPage = (
    nextPage: number
  ) => {
    const totalPages = Math.max(
      1,
      Math.ceil(
        blockTotal / pageSize
      )
    );

    const newPage = Math.min(
      totalPages,
      Math.max(1, nextPage)
    );

    if (newPage === page) {
      return;
    }

    setPage(newPage);

    load(
      newPage,
      blockSearch
    );
  };

  /* =======================================================
     BÚSQUEDA SOPORTE ADMIN
  ======================================================= */

  const searchSupport = () => {
    setPage(1);
    load(
      1,
      supportSearch.trim()
    );
  };

  const clearSupportSearch = () => {
    setSupportSearch('');
    setPage(1);
    load(1, '');
  };

  const changeSupportPage = (
    nextPage: number
  ) => {
    const totalPages = Math.max(
      1,
      Math.ceil(
        supportTotal / pageSize
      )
    );

    const newPage = Math.min(
      totalPages,
      Math.max(1, nextPage)
    );

    if (newPage === page) {
      return;
    }

    setPage(newPage);

    load(
      newPage,
      supportSearch
    );
  };

  /* =======================================================
     BÚSQUEDA PETICIONES DE CARNET
  ======================================================= */

  const searchCarnets = () => {
    setPage(1);
    load(
      1,
      carnetSearch.trim()
    );
  };

  const clearCarnetSearch = () => {
    setCarnetSearch('');
    setPage(1);
    load(1, '');
  };

  const changeCarnetPage = (
    nextPage: number
  ) => {
    const totalPages = Math.max(
      1,
      Math.ceil(
        carnetTotal / pageSize
      )
    );

    const newPage = Math.min(
      totalPages,
      Math.max(1, nextPage)
    );

    if (newPage === page) {
      return;
    }

    setPage(newPage);

    load(
      newPage,
      carnetSearch
    );
  };

  /* =======================================================
     BÚSQUEDA PETICIONES DE ACTUALIZACIÓN
  ======================================================= */

  const searchUpdates = () => {
    setPage(1);

    load(
      1,
      updateSearch.trim()
    );
  };

  const clearUpdateSearch = () => {
    setUpdateSearch('');
    setPage(1);
    load(1, '');
  };

  const changeUpdatePage = (
    nextPage: number
  ) => {
    const totalPages = Math.max(
      1,
      Math.ceil(
        updateTotal / pageSize
      )
    );

    const newPage = Math.min(
      totalPages,
      Math.max(1, nextPage)
    );

    if (newPage === page) {
      return;
    }

    setPage(newPage);

    load(
      newPage,
      updateSearch
    );
  };

  /* =======================================================
     PANTALLA
  ======================================================= */

  return (
    <View style={common.screen}>
      <Header
        title={title}
        navigation={navigation}
        onMenu={() => setMenu(true)}
        onBell={
          user?.rol === 'aprendiz'
            ? () =>
                navigation.navigate(
                  'Feature',
                  {
                    key: 'notifications',
                    title: 'Notificaciones',
                  }
                )
            : undefined
        }
      />

      <ScrollView
        contentContainerStyle={
          common.content
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
          />
        }
      >
        {/* =================================================
            SOPORTE
        ================================================= */}

        {key === 'support' && (
  <View
    style={[
      common.card,
      {
        flexDirection: 'row',
        gap: 8,
      },
    ]}
  >
    <Tab
      active={supportTab === 'todos'}
      text="Todas"
      onPress={() => setSupportTab('todos')}
    />

    <Tab
      active={supportTab === 'pendientes'}
      text="Pendientes"
      onPress={() => setSupportTab('pendientes')}
    />

    <Tab
      active={supportTab === 'resueltos'}
      text="Resueltos"
      onPress={() => setSupportTab('resueltos')}
    />
  </View>
)}

        {/* =================================================
            FILTRO USUARIOS
        ================================================= */}

        {key === 'users' && (
          <View style={common.card}>
            <Text
              style={
                common.sectionTitle
              }
            >
              Filtrar usuarios
            </Text>

            <Field
              label="NOMBRE"
              value={filterName}
              onChangeText={(v) => {
                setFilterName(v);
                setPage(1);
              }}
            />

            <Field
              label="DOCUMENTO"
              value={filterDoc}
              onChangeText={(v) => {
                setFilterDoc(v);
                setPage(1);
              }}
              keyboardType="numeric"
            />
          </View>
        )}

        {/* =================================================
            BÚSQUEDA VEHÍCULOS
        ================================================= */}

        {isVehicleKey && (
          <View style={common.card}>
            <Text
              style={
                common.sectionTitle
              }
            >
              Buscar vehículo
            </Text>

            <Text
              style={[
                common.subtitle,
                {
                  marginTop: 4,
                  marginBottom: 8,
                },
              ]}
            >
              Busca por nombre,
              documento, placa o
              serial.
            </Text>

            <Field
              label="NOMBRE, DOCUMENTO, PLACA O SERIAL"
              value={vehicleSearch}
              onChangeText={
                setVehicleSearch
              }
            />

            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                marginTop: 10,
              }}
            >
              <View
                style={{ flex: 1 }}
              >
                <Button
                  title="BUSCAR"
                  onPress={
                    searchVehicles
                  }
                />
              </View>

              <View
                style={{ flex: 1 }}
              >
                <Button
                  title="LIMPIAR"
                  outline
                  onPress={
                    clearVehicleSearch
                  }
                />
              </View>
            </View>

            <Text
              style={{
                marginTop: 10,
                fontWeight: '700',
                color: colors.muted,
              }}
            >
              {vehicleTotal > 0
                ? `Vehículos encontrados: ${vehicleTotal}`
                : 'Sin resultados'}
            </Text>
          </View>
        )}

        {/* =================================================
            BÚSQUEDA BLOQUEOS
        ================================================= */}

        {key === 'blocks' && (
          <View style={common.card}>
            <Text
              style={
                common.sectionTitle
              }
            >
              Buscar usuario
            </Text>

            <Text
              style={[
                common.subtitle,
                {
                  marginTop: 4,
                  marginBottom: 8,
                },
              ]}
            >
              Busca por nombre,
              documento o correo.
            </Text>

            <Field
              label="NOMBRE, DOCUMENTO O CORREO"
              value={blockSearch}
              onChangeText={
                setBlockSearch
              }
            />

            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                marginTop: 10,
              }}
            >
              <View
                style={{ flex: 1 }}
              >
                <Button
                  title="BUSCAR"
                  onPress={
                    searchBlocks
                  }
                />
              </View>

              <View
                style={{ flex: 1 }}
              >
                <Button
                  title="LIMPIAR"
                  outline
                  onPress={
                    clearBlockSearch
                  }
                />
              </View>
            </View>

            <Text
              style={{
                marginTop: 10,
                fontWeight: '700',
                color: colors.muted,
              }}
            >
              {blockTotal > 0
                ? `Usuarios encontrados: ${blockTotal}`
                : 'Sin resultados'}
            </Text>
          </View>
        )}

        {/* =================================================
            BÚSQUEDA SOPORTE ADMIN
        ================================================= */}

        {key === 'supportAdmin' && (
          <View style={common.card}>
            <Text
              style={
                common.sectionTitle
              }
            >
              Buscar soporte
            </Text>

            <Text
              style={[
                common.subtitle,
                {
                  marginTop: 4,
                  marginBottom: 8,
                },
              ]}
            >
              Busca por nombre,
              documento, asunto o
              descripción.
            </Text>

            <Field
              label="NOMBRE, DOCUMENTO, ASUNTO O DESCRIPCIÓN"
              value={supportSearch}
              onChangeText={
                setSupportSearch
              }
            />

            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                marginTop: 10,
              }}
            >
              <View
                style={{ flex: 1 }}
              >
                <Button
                  title="BUSCAR"
                  onPress={
                    searchSupport
                  }
                />
              </View>

              <View
                style={{ flex: 1 }}
              >
                <Button
                  title="LIMPIAR"
                  outline
                  onPress={
                    clearSupportSearch
                  }
                />
              </View>
            </View>

            <Text
              style={{
                marginTop: 10,
                fontWeight: '700',
                color: colors.muted,
              }}
            >
              {supportTotal > 0
                ? `Soportes encontrados: ${supportTotal}`
                : 'Sin resultados'}
            </Text>
          </View>
        )}

        {/* =================================================
            BÚSQUEDA PETICIONES CARNET
        ================================================= */}

        {key === 'pending' && (
          <View style={common.card}>
            <Text
              style={
                common.sectionTitle
              }
            >
              Buscar petición de
              carnet
            </Text>

            <Text
              style={[
                common.subtitle,
                {
                  marginTop: 4,
                  marginBottom: 8,
                },
              ]}
            >
              Busca por nombre,
              documento, serial o
              placa.
            </Text>

            <Field
              label="NOMBRE, DOCUMENTO, SERIAL O PLACA"
              value={carnetSearch}
              onChangeText={
                setCarnetSearch
              }
            />

            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                marginTop: 10,
              }}
            >
              <View
                style={{ flex: 1 }}
              >
                <Button
                  title="BUSCAR"
                  onPress={
                    searchCarnets
                  }
                />
              </View>

              <View
                style={{ flex: 1 }}
              >
                <Button
                  title="LIMPIAR"
                  outline
                  onPress={
                    clearCarnetSearch
                  }
                />
              </View>
            </View>

            <Text
              style={{
                marginTop: 10,
                fontWeight: '700',
                color: colors.muted,
              }}
            >
              {carnetTotal > 0
                ? `Peticiones encontradas: ${carnetTotal}`
                : 'Sin resultados'}
            </Text>
          </View>
        )}

        {/* =================================================
            BÚSQUEDA PETICIONES ACTUALIZACIÓN
        ================================================= */}

        {key === 'updateRequests' && (
          <View style={common.card}>
            <Text
              style={
                common.sectionTitle
              }
            >
              Buscar solicitud de
              actualización
            </Text>

            <Text
              style={[
                common.subtitle,
                {
                  marginTop: 4,
                  marginBottom: 8,
                },
              ]}
            >
              Busca por nombre,
              documento, correo o
              ficha.
            </Text>

            <Field
              label="NOMBRE, DOCUMENTO, CORREO O FICHA"
              value={updateSearch}
              onChangeText={
                setUpdateSearch
              }
            />

            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                marginTop: 10,
              }}
            >
              <View
                style={{ flex: 1 }}
              >
                <Button
                  title="BUSCAR"
                  onPress={
                    searchUpdates
                  }
                />
              </View>

              <View
                style={{ flex: 1 }}
              >
                <Button
                  title="LIMPIAR"
                  outline
                  onPress={
                    clearUpdateSearch
                  }
                />
              </View>
            </View>

            <Text
              style={{
                marginTop: 10,
                fontWeight: '700',
                color: colors.muted,
              }}
            >
              {updateTotal > 0
                ? `Solicitudes encontradas: ${updateTotal}`
                : 'Sin resultados'}
            </Text>
          </View>
        )}

        {/* =================================================
            REPORTE PETICIONES CARNET
        ================================================= */}

        {key === 'pending' && (
          <CarnetReportPanel
            report={carnetReport}
            setReport={
              setCarnetReport
            }
            loading={
              carnetReportLoading
            }
            setLoading={
              setCarnetReportLoading
            }
          />
        )}

        {/* =================================================
            NUEVO CENTRO
        ================================================= */}

        {key === 'centers' && (
          <Button
            title="＋ NUEVO CENTRO"
            onPress={() =>
              navigation.navigate(
                'Feature',
                {
                  key: 'createCenter',
                  title:
                    'Nuevo centro de formación',
                }
              )
            }
          />
        )}

        {/* =================================================
            NUEVO DOCUMENTO
        ================================================= */}

        {key === 'docs' && (
          <Button
            title="＋ NUEVO TIPO DE DOCUMENTO"
            onPress={() =>
              navigation.navigate(
                'Feature',
                {
                  key: 'createDoc',
                  title:
                    'Nuevo tipo de documento',
                }
              )
            }
          />
        )}

        {/* =================================================
            REPORTES ENTRADAS / SALIDAS
        ================================================= */}

        {key === 'records' && (
          <ReportPanel />
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error ? (
          <Text style={common.error}>
            {error}
          </Text>
        ) : null}

        {/* =================================================
            NOTIFICACIONES
        ================================================= */}

        {key === 'notifications' && (
          <Button
            title="MARCAR TODAS COMO LEÍDAS"
            outline
            onPress={markRead}
          />
        )}

        {/* =================================================
            CARGANDO / LISTA
        ================================================= */}

        {loading ? (
          <Text
            style={common.subtitle}
          >
            Cargando...
          </Text>
        ) : paged.length === 0 ? (
          <View style={common.card}>
            <Text
              style={{
                fontWeight: '700',
              }}
            >
              {emptyFor(key)}
            </Text>
          </View>
        ) : (
          paged.map(
            (
              x: any,
              i: number
            ) => (
              <RenderCard
                key={
                  x.id ?? i
                }
                x={x}
                i={i}
                kind={key}
                currentUser={user}
                load={() => {
                  if (isVehicleKey) {
                    load(
                      page,
                      vehicleSearch
                    );
                    return;
                  }

                  if (key === 'blocks') {
                    load(
                      page,
                      blockSearch
                    );
                    return;
                  }

                  if (key === 'pending') {
                    load(
                      page,
                      carnetSearch
                    );
                    return;
                  }

                  if (
                    key ===
                    'supportAdmin'
                  ) {
                    load(
                      page,
                      supportSearch
                    );
                    return;
                  }

                  if (
                    key ===
                    'updateRequests'
                  ) {
                    load(
                      page,
                      updateSearch
                    );
                    return;
                  }

                  load();
                }}
              />
            )
          )
        )}

        {/* =================================================
            PAGINACIÓN VEHÍCULOS
        ================================================= */}

        {isVehicleKey &&
          vehicleTotal >
            pageSize && (
            <View
              style={[
                common.card,
                {
                  flexDirection:
                    'row',
                  alignItems:
                    'center',
                  justifyContent:
                    'space-between',
                },
              ]}
            >
              <Button
                title="‹"
                outline
                onPress={() =>
                  changeVehiclePage(
                    page - 1
                  )
                }
              />

              <Text
                style={{
                  fontWeight:
                    '900',
                }}
              >
                Página {page} de{' '}
                {Math.max(
                  1,
                  Math.ceil(
                    vehicleTotal /
                      pageSize
                  )
                )}
              </Text>

              <Button
                title="›"
                outline
                onPress={() =>
                  changeVehiclePage(
                    page + 1
                  )
                }
              />
            </View>
          )}

        {/* =================================================
            PAGINACIÓN BLOQUEOS
        ================================================= */}

        {key === 'blocks' &&
          blockTotal >
            pageSize && (
            <View
              style={[
                common.card,
                {
                  flexDirection:
                    'row',
                  alignItems:
                    'center',
                  justifyContent:
                    'space-between',
                },
              ]}
            >
              <Button
                title="‹"
                outline
                onPress={() =>
                  changeBlockPage(
                    page - 1
                  )
                }
              />

              <Text
                style={{
                  fontWeight:
                    '900',
                }}
              >
                Página {page} de{' '}
                {Math.max(
                  1,
                  Math.ceil(
                    blockTotal /
                      pageSize
                  )
                )}
              </Text>

              <Button
                title="›"
                outline
                onPress={() =>
                  changeBlockPage(
                    page + 1
                  )
                }
              />
            </View>
          )}

        {/* =================================================
            PAGINACIÓN SOPORTE
        ================================================= */}

        {key === 'supportAdmin' &&
          supportTotal >
            pageSize && (
            <View
              style={[
                common.card,
                {
                  flexDirection:
                    'row',
                  alignItems:
                    'center',
                  justifyContent:
                    'space-between',
                },
              ]}
            >
              <Button
                title="‹"
                outline
                onPress={() =>
                  changeSupportPage(
                    page - 1
                  )
                }
              />

              <Text
                style={{
                  fontWeight:
                    '900',
                }}
              >
                Página {page} de{' '}
                {Math.max(
                  1,
                  Math.ceil(
                    supportTotal /
                      pageSize
                  )
                )}
              </Text>

              <Button
                title="›"
                outline
                onPress={() =>
                  changeSupportPage(
                    page + 1
                  )
                }
              />
            </View>
          )}

        {/* =================================================
            PAGINACIÓN PETICIONES CARNET
        ================================================= */}

        {key === 'pending' &&
          carnetTotal >
            pageSize && (
            <View
              style={[
                common.card,
                {
                  flexDirection:
                    'row',
                  alignItems:
                    'center',
                  justifyContent:
                    'space-between',
                },
              ]}
            >
              <Button
                title="‹"
                outline
                onPress={() =>
                  changeCarnetPage(
                    page - 1
                  )
                }
              />

              <Text
                style={{
                  fontWeight:
                    '900',
                }}
              >
                Página {page} de{' '}
                {Math.max(
                  1,
                  Math.ceil(
                    carnetTotal /
                      pageSize
                  )
                )}
              </Text>

              <Button
                title="›"
                outline
                onPress={() =>
                  changeCarnetPage(
                    page + 1
                  )
                }
              />
            </View>
          )}

        {/* =================================================
            PAGINACIÓN PETICIONES ACTUALIZACIÓN
        ================================================= */}

        {key === 'updateRequests' &&
          updateTotal >
            pageSize && (
            <View
              style={[
                common.card,
                {
                  flexDirection:
                    'row',
                  alignItems:
                    'center',
                  justifyContent:
                    'space-between',
                },
              ]}
            >
              <Button
                title="‹"
                outline
                onPress={() =>
                  changeUpdatePage(
                    page - 1
                  )
                }
              />

              <Text
                style={{
                  fontWeight:
                    '900',
                }}
              >
                Página {page} de{' '}
                {Math.max(
                  1,
                  Math.ceil(
                    updateTotal /
                      pageSize
                  )
                )}
              </Text>

              <Button
                title="›"
                outline
                onPress={() =>
                  changeUpdatePage(
                    page + 1
                  )
                }
              />
            </View>
          )}

        {/* =================================================
            PAGINACIÓN LOCAL USUARIOS / RECORDS
        ================================================= */}

        {(key === 'users' ||
          key === 'records') &&
          visibleItems.length >
            pageSize && (
            <Pagination
              page={page}
              total={
                visibleItems.length
              }
              pageSize={
                pageSize
              }
              setPage={
                setPage
              }
            />
          )}
      </ScrollView>

      <RoleDrawer
        visible={menu}
        onClose={() =>
          setMenu(false)
        }
        user={user}
        navigation={
          navigation
        }
      />
    </View>
  );
}

/* =========================================================
   TAB
========================================================= */

function Tab({
  active,
  text,
  onPress,
}: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor:
          active
            ? colors.primary
            : colors.border,
        backgroundColor:
          active
            ? colors.light
            : '#fff',
      }}
    >
      <Text
        style={{
          textAlign: 'center',
          fontWeight: '900',
          color: active
            ? colors.dark
            : colors.text,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

/* =========================================================
   REPORTE ENTRADAS / SALIDAS
========================================================= */

function ReportPanel() {
  const [report, setReport] =
    useState<any>(null);

  const [busy, setBusy] =
    useState(false);

  const run = async (
    p: string
  ) => {
    setBusy(true);

    try {
      const r =
        await resources.reportRecords(
          p
        );

      setReport(r.data);
    } catch (e) {
      Alert.alert(
        'Error',
        messageOf(e)
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={common.card}>
      <Text
        style={
          common.sectionTitle
        }
      >
        Generar reporte de
        entradas y salidas
      </Text>

      <Text
        style={common.subtitle}
      >
        Consulta el movimiento
        del periodo seleccionado.
      </Text>

      <View
        style={{
          flexDirection: 'row',
          gap: 7,
        }}
      >
        {[
          ['diario', 'Día'],
          ['semanal', 'Semana'],
          ['mensual', 'Mes'],
        ].map(([v, l]) => (
          <View
            key={v}
            style={{ flex: 1 }}
          >
            <Button
              title={
                busy ? '...' : l
              }
              outline
              onPress={() =>
                run(v)
              }
            />
          </View>
        ))}
      </View>

      {report && (
        <View
          style={styles.report}
        >
          <Text
            style={
              styles.reportTitle
            }
          >
            Reporte{' '}
            {report.periodo}
          </Text>

          <Text>
            Total registros:{' '}
            {report.total}
          </Text>

          <Text>
            Entradas:{' '}
            {report.entradas}
          </Text>

          <Text>
            Salidas:{' '}
            {report.salidas}
          </Text>

          <Text
            style={{
              marginTop: 6,
              color: colors.muted,
            }}
          >
            Desde:{' '}
            {new Date(
              report.desde
            ).toLocaleString(
              'es-CO'
            )}
          </Text>
        </View>
      )}
    </View>
  );
}

/* =========================================================
   REPORTE PETICIONES DE CARNET
========================================================= */

function CarnetReportPanel({
  report,
  setReport,
  loading,
  setLoading,
}: any) {
  const run = async (
    tipo: string
  ) => {
    setLoading(true);

    try {
      const r =
        await resources.carnetReport(
          tipo
        );

      setReport(r.data);
    } catch (e) {
      Alert.alert(
        'Error',
        messageOf(e)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={common.card}>
      <Text
        style={
          common.sectionTitle
        }
      >
        Reportes de peticiones
        de carnet
      </Text>

      <Text
        style={[
          common.subtitle,
          {
            marginTop: 4,
            marginBottom: 10,
          },
        ]}
      >
        Consulta las solicitudes
        realizadas durante el día,
        semana o mes actual.
      </Text>

      <View
        style={{
          flexDirection: 'row',
          gap: 7,
        }}
      >
        <View style={{ flex: 1 }}>
          <Button
            title={
              loading
                ? '...'
                : 'DÍA'
            }
            outline
            onPress={() =>
              run('diario')
            }
          />
        </View>

        <View style={{ flex: 1 }}>
          <Button
            title={
              loading
                ? '...'
                : 'SEMANA'
            }
            outline
            onPress={() =>
              run('semanal')
            }
          />
        </View>

        <View style={{ flex: 1 }}>
          <Button
            title={
              loading
                ? '...'
                : 'MES'
            }
            outline
            onPress={() =>
              run('mensual')
            }
          />
        </View>
      </View>

      {report && (
        <View
          style={styles.report}
        >
          <Text
            style={
              styles.reportTitle
            }
          >
            Reporte{' '}
            {report.tipo || ''}
          </Text>

          <Text>
            Total solicitudes:{' '}
            {report.resumen
              ?.total ?? 0}
          </Text>

          <Text>
            Aprobadas:{' '}
            {report.resumen
              ?.aprobadas ?? 0}
          </Text>

          <Text>
            Carnets generados:{' '}
            {report.resumen
              ?.carnetsGenerados ??
              0}
          </Text>

          <Text>
            Rechazadas:{' '}
            {report.resumen
              ?.rechazadas ?? 0}
          </Text>

          <Text>
            Pendientes:{' '}
            {report.resumen
              ?.pendientes ?? 0}
          </Text>

          {report.fechaInicio && (
            <Text
              style={{
                marginTop: 8,
                color: colors.muted,
              }}
            >
              Desde:{' '}
              {new Date(
                report.fechaInicio
              ).toLocaleString(
                'es-CO'
              )}
            </Text>
          )}

          {report.fechaFin && (
            <Text
              style={{
                color: colors.muted,
              }}
            >
              Hasta:{' '}
              {new Date(
                report.fechaFin
              ).toLocaleString(
                'es-CO'
              )}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function emptyFor(k: string) {
  return (
    {
      notifications:
        'No tienes notificaciones.',

      support:
        'No tienes solicitudes de soporte.',

      supportAdmin:
        'No hay soportes que coincidan con la búsqueda.',

      myVehicles:
        'No tienes vehículos registrados.',

      vehicles:
        'No hay vehículos registrados.',

      records:
        'No hay registros de entrada y salida.',

      users:
        'No hay usuarios que coincidan con el filtro.',

      blocks:
        'No hay usuarios que coincidan con la búsqueda.',

      pending:
        'No hay peticiones de carnet.',

      updateRequests:
        'No hay peticiones de actualización.',

      centers:
        'No hay centros de formación.',

      docs:
        'No hay tipos de documento.',

      reports:
        'No hay reportes solucionados.',
    } as any
  )[k] || 'No hay información.';
}

/* =========================================================
   PAGINACIÓN
========================================================= */

function Pagination({
  page,
  total,
  pageSize,
  setPage,
}: any) {
  const pages = Math.max(
    1,
    Math.ceil(
      total / pageSize
    )
  );

  return (
    <View
      style={[
        common.card,
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent:
            'space-between',
        },
      ]}
    >
      <Button
        title="‹"
        outline
        onPress={() =>
          setPage(
            Math.max(
              1,
              page - 1
            )
          )
        }
      />

      <Text
        style={{
          fontWeight: '900',
        }}
      >
        Página {page} de {pages}
      </Text>

      <Button
        title="›"
        outline
        onPress={() =>
          setPage(
            Math.min(
              pages,
              page + 1
            )
          )
        }
      />
    </View>
  );
}

/* =========================================================
   FOTO
========================================================= */

function Photo({
  name,
  label,
}: {
  name?: string;
  label: string;
}) {
  if (!name) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() =>
        Alert.alert(
          label,
          'Este archivo se puede abrir desde la solicitud.'
        )
      }
      style={{
        marginTop: 10,
      }}
    >
      <Text
        style={{
          fontWeight: '800',
          marginBottom: 5,
        }}
      >
        {label}
      </Text>

      <Image
        source={{
          uri: fileUrl(name),
        }}
        style={{
          width: '100%',
          height: 190,
          borderRadius: 12,
        }}
      />
    </TouchableOpacity>
  );
}

/* =========================================================
   ARCHIVOS
========================================================= */

function FileButtonView({
  name,
  label,
  onOpen,
}: {
  name?: string;
  label: string;
  onOpen: (
    n: string,
    l: string
  ) => void;
}) {
  if (!name) {
    return null;
  }

  const image =
    /\.(jpg|jpeg|png|gif|webp)$/i.test(
      String(name)
    );

  return (
    <TouchableOpacity
      onPress={() =>
        onOpen(
          name,
          label
        )
      }
      style={styles.fileCard}
    >
      <View style={styles.fileIcon}>
        <Text
          style={{
            fontSize: 20,
          }}
        >
          {image
            ? '🖼️'
            : '📄'}
        </Text>
      </View>

      <View
        style={{ flex: 1 }}
      >
        <Text
          style={styles.fileTitle}
          numberOfLines={2}
        >
          {label}
        </Text>

        <Text
          style={styles.fileSub}
          numberOfLines={1}
        >
          {String(name)
            .split('/')
            .pop()}
        </Text>
      </View>

      <Text
        style={{
          color: colors.primary,
          fontWeight: '900',
        }}
      >
        ABRIR
      </Text>
    </TouchableOpacity>
  );
}

/* =========================================================
   DOCUMENTOS ARRAY
========================================================= */

function docsArray(value: any) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    const p = JSON.parse(value);

    return Array.isArray(p)
      ? p
      : [
          {
            nombre: String(value),
            ruta: String(value),
          },
        ];
  } catch {
    return [
      {
        nombre: String(value),
        ruta: String(value),
      },
    ];
  }
}

/* =========================================================
   TARJETAS
========================================================= */

function RenderCard({
  x,
  kind,
  i,
  load,
  currentUser,
}: any) {
  const [viewer, setViewer] =
    useState<any>(null);

  const open = (
    name: string,
    label: string
  ) =>
    setViewer({
      name,
      title: label,
    });

  const user =
    x.user ||
    x.User ||
    {};

  return (
    <View style={common.card}>
      <Text
        style={styles.cardTitle}
      >
        {user.nombres
          ? `${user.nombres} ${
              user.apellidos ||
              ''
            }`
          : x.nombres
          ? `${x.nombres} ${
              x.apellidos ||
              ''
            }`
          : x.nombre ||
            x.titulo ||
            x.asunto ||
            `Registro #${
              x.id ??
              i + 1
            }`}
      </Text>

      {kind === 'notifications' ? (
        <>
          <Text
            style={{
              marginTop: 7,
            }}
          >
            {x.mensaje}
          </Text>

          <Text
            style={styles.date}
          >
            {x.createdAt
              ? new Date(
                  x.createdAt
                ).toLocaleString(
                  'es-CO'
                )
              : ''}
          </Text>
        </>
      ) : kind === 'support' || kind === 'supportAdmin' ? (
  <>
    <Text style={styles.boldLine}>
      Asunto: {x.asunto || '—'}
    </Text>

    <Text style={{ marginTop: 8 }}>
      {x.descripcion || '—'}
    </Text>

    {/* ESTADO */}
    <View
      style={{
        marginTop: 12,
        padding: 10,
        borderRadius: 10,
        backgroundColor:
          [
            'resuelto',
            'solucionado',
            'solucionada',
            'cerrado',
            'cerrada',
          ].includes(
            String(x.estado || '')
              .trim()
              .toLowerCase()
          )
            ? '#E8F5E9'
            : '#FFF8E1',
      }}
    >
      <Text
        style={{
          fontWeight: '900',
          color:
            [
              'resuelto',
              'solucionado',
              'solucionada',
              'cerrado',
              'cerrada',
            ].includes(
              String(x.estado || '')
                .trim()
                .toLowerCase()
            )
              ? '#2E7D32'
              : '#B26A00',
        }}
      >
        {[
          'resuelto',
          'solucionado',
          'solucionada',
          'cerrado',
          'cerrada',
        ].includes(
          String(x.estado || '')
            .trim()
            .toLowerCase()
        )
          ? '✅ RESUELTO'
          : '⏳ PENDIENTE'}
      </Text>
    </View>

    {/* FECHA */}
    {(x.createdAt || x.fechaCreacion) && (
      <Text style={styles.date}>
        Solicitud:{' '}
        {new Date(
          x.createdAt || x.fechaCreacion
        ).toLocaleString('es-CO')}
      </Text>
    )}

    {/* RESPUESTA DEL ADMINISTRADOR */}
    {x.respuesta ? (
      <View style={styles.answer}>
        <Text style={styles.answerTitle}>
          💬 Respuesta del administrador
        </Text>

        <Text>
          {x.respuesta}
        </Text>

        {(x.updatedAt || x.fechaRespuesta) && (
          <Text style={styles.date}>
            Respondido:{' '}
            {new Date(
              x.fechaRespuesta || x.updatedAt
            ).toLocaleString('es-CO')}
          </Text>
        )}
      </View>
    ) : (
      <View
        style={{
          marginTop: 10,
          padding: 10,
          borderRadius: 10,
          backgroundColor: '#F5F5F5',
        }}
      >
        <Text style={{ color: colors.muted }}>
          El administrador todavía no ha respondido esta solicitud.
        </Text>
      </View>
    )}

    {/* SOLO ADMINISTRADOR PUEDE RESPONDER */}
    {kind === 'supportAdmin' &&
      ![
        'resuelto',
        'solucionado',
        'solucionada',
        'cerrado',
        'cerrada',
      ].includes(
        String(x.estado || '')
          .trim()
          .toLowerCase()
      ) && (
        <SupportReply
          id={x.id}
          load={load}
        />
      )}
  </>
) : kind === 'pending' ? (
        <>
          <Text>
            Documento:{' '}
            {user.documento ||
              '—'}
          </Text>

          <Text>
            Tipo documento:{' '}
            {user.tipoDocumento ||
              '—'}
          </Text>

          <Text>
            Correo:{' '}
            {user.email || '—'}
          </Text>

          <Text>
            Celular:{' '}
            {user.celular ||
              '—'}
          </Text>

          <Text>
            Ficha:{' '}
            {user.ficha || '—'}
          </Text>

          <Text>
            Centro:{' '}
            {user
              .centroFormacion
              ?.nombre ||
              '—'}
          </Text>

          <Text
            style={
              styles.subhead
            }
          >
            Vehículo
          </Text>

          <Text>
            Tipo:{' '}
            {x.tipoVehiculo ||
              '—'}
          </Text>

          <Text>
            Marca:{' '}
            {x.marca || '—'}
          </Text>

          <Text>
            Color:{' '}
            {x.color || '—'}
          </Text>

          <Text>
            {x.tipoVehiculo ===
            'moto'
              ? 'Placa'
              : 'Serial'}:{' '}
            {x.serialPlaca ||
              '—'}
          </Text>

          {x.tipoVehiculo ===
            'moto' && (
            <>
              <Text>
                Cilindraje:{' '}
                {x.cilindraje ||
                  '—'}
              </Text>

              <Text>
                Modelo:{' '}
                {x.modelo || '—'}
              </Text>
            </>
          )}

          <Photo
            name={
              x.fotoAprendiz
            }
            label="Foto del aprendiz"
          />

          <Photo
            name={
              x.fotoVehiculo
            }
            label="Foto del vehículo"
          />

          {x.formatoDiligenciado && (
            <FileButtonView
              name={
                x.formatoDiligenciado
              }
              label="Formato diligenciado"
              onOpen={open}
            />
          )}

          {docsArray(
            x.documentosAnexos
          ).map(
            (
              d: any,
              j: number
            ) => (
              <FileButtonView
                key={j}
                name={
                  d.ruta ||
                  d.nombre ||
                  d
                }
                label={
                  d.tipo ||
                  d.nombre ||
                  `Anexo ${
                    j + 1
                  }`
                }
                onOpen={open}
              />
            )
          )}

          {x.estado ===
            'pendiente' && (
            <AdminActions
              id={x.id}
              kind="carnet"
              load={load}
            />
          )}

          {x.estado ===
            'aprobada' && (
            <Button
              title="GENERAR CARNET"
              onPress={async () => {
                try {
                  await resources.generateCarnet(
                    x.id
                  );

                  Alert.alert(
                    'Listo',
                    'Carnet generado'
                  );

                  load();
                } catch (e) {
                  Alert.alert(
                    'Error',
                    messageOf(e)
                  );
                }
              }}
            />
          )}
        </>
      ) : kind ===
        'updateRequests' ? (
        <>
          <Text
            style={
              styles.boldLine
            }
          >
            Tipo:{' '}
            {x.tipo ===
            'datos_vehiculo'
              ? 'Datos del vehículo'
              : 'Datos personales'}
          </Text>

          <CompareData
            title="DATOS ANTERIORES"
            data={
              x.datosActuales
            }
          />

          <CompareData
            title="DATOS A ACTUALIZAR"
            data={
              x.datosNuevos
            }
          />

          {x.fotoNueva && (
            <Photo
              name={x.fotoNueva}
              label="Nueva foto"
            />
          )}

          {docsArray(
            x.documentos
          ).map(
            (
              d: any,
              j: number
            ) => (
              <FileButtonView
                key={j}
                name={
                  d.ruta ||
                  d.nombre ||
                  d
                }
                label={
                  d.nombre ||
                  d.tipo ||
                  `Documento ${
                    j + 1
                  }`
                }
                onOpen={open}
              />
            )
          )}

          <Text
            style={
              styles.boldLine
            }
          >
            {statusText(
              x.estado
            )}
          </Text>

          {x.estado ===
            'pendiente' && (
            <AdminActions
              id={x.id}
              kind="update"
              load={load}
            />
          )}
        </>
      ) : kind ===
          'vehicles' ||
        kind ===
          'myVehicles' ? (
        <>
          <Text>
            Tipo:{' '}
            {x.tipo || '—'}
          </Text>

          <Text>
            Marca:{' '}
            {x.marca || '—'}
          </Text>

          <Text>
            Color:{' '}
            {x.color || '—'}
          </Text>

          {x.tipo ===
          'moto' ? (
            <>
              <Text>
                Placa:{' '}
                {x.placa || '—'}
              </Text>

              <Text>
                Cilindraje:{' '}
                {x.cilindraje ||
                  '—'}
              </Text>

              <Text>
                Modelo:{' '}
                {x.modelo || '—'}
              </Text>
            </>
          ) : (
            <Text>
              Serial:{' '}
              {x.serial || '—'}
            </Text>
          )}

          <Text
            style={
              styles.subhead
            }
          >
            Propietario
          </Text>

          <Text>
            {user.nombres
              ? `${user.nombres} ${
                  user.apellidos ||
                  ''
                }`
              : '—'}
          </Text>

          <Text>
            Documento:{' '}
            {user.documento ||
              '—'}
          </Text>

          <Text>
            Ficha:{' '}
            {user.ficha || '—'}
          </Text>

          <Text>
            Centro:{' '}
            {user
              .centroFormacion
              ?.nombre ||
              '—'}
          </Text>

          <Photo
            name={
              x.foto_principal
            }
            label="Foto principal"
          />

          <Photo
            name={
              x.foto_secundaria
            }
            label="Foto secundaria"
          />

          {kind ===
            'vehicles' && (
            <AdminVehicleActions
              item={x}
              load={load}
            />
          )}
        </>
      ) : kind ===
          'users' ||
        kind ===
          'blocks' ? (
        <>
          <Text>
            Documento:{' '}
            {x.documento ||
              '—'}
          </Text>

          <Text>
            Correo:{' '}
            {x.email || '—'}
          </Text>

          <Text>
            Rol:{' '}
            {x.rol || '—'}
          </Text>

          <Text>
            Estado:{' '}
            {x.estado ||
              'activo'}
          </Text>

          {kind ===
            'blocks' && (
            <BlockActions
              user={x}
              load={load}
            />
          )}
        </>
      ) : kind ===
        'records' ? (
        <>
          <Text>
            Aprendiz:{' '}
            {x.aprendiz ||
              '—'}
          </Text>

          <Text>
            Vehículo:{' '}
            {x.vehiculo ||
              '—'}{' '}
            ·{' '}
            {x.placaSerial ||
              '—'}
          </Text>

          <Text>
            Entrada:{' '}
            {x.hora_entrada
              ? new Date(
                  x.hora_entrada
                ).toLocaleString(
                  'es-CO'
                )
              : '—'}
          </Text>

          <Text>
            Salida:{' '}
            {x.hora_salida
              ? new Date(
                  x.hora_salida
                ).toLocaleString(
                  'es-CO'
                )
              : '—'}
          </Text>

          <Text
            style={styles.status}
          >
            {x.estado ===
            'dentro'
              ? '🟢 Dentro'
              : '⚪ Fuera'}
          </Text>

          {currentUser?.rol === 'guarda' && (
            <View style={{ marginTop: 12 }}>
              <Button
                title="ELIMINAR REGISTRO"
                outline
                onPress={() =>
                  Alert.alert(
                    'Eliminar registro',
                    `¿Seguro que deseas eliminar el registro #${x.id}? Esta acción no se puede deshacer.`,
                    [
                      {
                        text: 'Cancelar',
                        style: 'cancel',
                      },
                      {
                        text: 'Eliminar',
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            await resources.deleteRecord(x.id);

                            Alert.alert(
                              'Registro eliminado',
                              'El registro de entrada y salida fue eliminado correctamente.'
                            );

                            load();
                          } catch (e) {
                            Alert.alert(
                              'Error',
                              messageOf(e)
                            );
                          }
                        },
                      },
                    ]
                  )
                }
              />
            </View>
          )}
        </>
      ) : kind ===
        'reports' ? (
        <>
          <Text>
            Asunto:{' '}
            {x.asunto || '—'}
          </Text>

          <Text
            style={{
              marginTop: 6,
            }}
          >
            {x.descripcion ||
              '—'}
          </Text>

          <Text
            style={
              styles.boldLine
            }
          >
            Estado:{' '}
            {statusText(
              x.estado
            )}
          </Text>

          {x.respuesta && (
            <Text
              style={{
                marginTop: 5,
              }}
            >
              Solución:{' '}
              {x.respuesta}
            </Text>
          )}
        </>
      ) : kind ===
        'centers' ? (
        <>
          <Text>
            Ciudad:{' '}
            {x.ciudad || '—'}
          </Text>

          <Text>
            Dirección:{' '}
            {x.direccion ||
              '—'}
          </Text>

          <CenterActions
            item={x}
            load={load}
          />
        </>
      ) : kind === 'docs' ? (
        <>
          <Text>
            Sigla:{' '}
            {x.sigla || '—'}
          </Text>

          <Text>
            Nombre:{' '}
            {x.nombre_documento ||
              x.descripcion ||
              x.nombre ||
              '—'}
          </Text>

          <DocActions
            item={x}
            load={load}
          />
        </>
      ) : (
        <Text>
          {JSON.stringify(x).slice(
            0,
            500
          )}
        </Text>
      )}

      <FileViewerModal
        visible={!!viewer}
        onClose={() =>
          setViewer(null)
        }
        name={viewer?.name}
        title={
          viewer?.title
        }
      />
    </View>
  );
}

/* =========================================================
   ACCIONES ADMIN
========================================================= */

function AdminActions({
  id,
  kind,
  load,
}: any) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
      }}
    >
      <View style={{ flex: 1 }}>
        <Button
          title="APROBAR"
          onPress={async () => {
            try {
              if (
                kind ===
                'carnet'
              ) {
                await resources.approveCarnetRequest(
                  id
                );
              } else {
                await resources.approveUpdate(
                  id
                );
              }

              Alert.alert(
                'Listo',
                'Solicitud aprobada'
              );

              load();
            } catch (e) {
              Alert.alert(
                'Error',
                messageOf(e)
              );
            }
          }}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Button
          title="RECHAZAR"
          outline
          onPress={async () => {
            try {
              if (
                kind ===
                'carnet'
              ) {
                await resources.rejectCarnetRequest(
                  id
                );
              } else {
                await resources.rejectUpdate(
                  id
                );
              }

              Alert.alert(
                'Listo',
                'Solicitud rechazada'
              );

              load();
            } catch (e) {
              Alert.alert(
                'Error',
                messageOf(e)
              );
            }
          }}
        />
      </View>
    </View>
  );
}

/* =========================================================
   SOPORTE
========================================================= */

function SupportReply({
  id,
  load,
}: any) {
  const [r, setR] =
    useState('');

  return (
    <View
      style={{
        marginTop: 10,
      }}
    >
      <Field
        label="RESPUESTA"
        value={r}
        onChangeText={setR}
        multiline
      />

      <Button
        title="RESPONDER Y RESOLVER"
        onPress={async () => {
          try {
            await resources.respondSupport(
              id,
              {
                respuesta: r,
              }
            );

            Alert.alert(
              'Listo',
              'Respuesta enviada y notificación creada'
            );

            load();
          } catch (e) {
            Alert.alert(
              'Error',
              messageOf(e)
            );
          }
        }}
      />
    </View>
  );
}

/* =========================================================
   BLOQUEOS
========================================================= */

function BlockActions({
  user,
  load,
}: any) {
  const bloqueo =
    user.estado ===
    'bloqueado';

  return (
    <Button
      title={
        bloqueo
          ? 'DESBLOQUEAR'
          : 'BLOQUEAR'
      }
      outline
      onPress={async () => {
        try {
          await resources.action({
            userId: user.id,
            tipo: bloqueo
              ? 'desbloqueo'
              : 'bloqueo',
            motivo: bloqueo
              ? 'Reactivación desde app'
              : 'Bloqueo desde app',
          });

          load();
        } catch (e) {
          Alert.alert(
            'Error',
            messageOf(e)
          );
        }
      }}
    />
  );
}

/* =========================================================
   VEHÍCULOS ADMIN
========================================================= */

function AdminVehicleActions({
  item,
  load,
}: any) {
  const [editing, setEditing] =
    useState(false);

  const [tipo, setTipo] =
    useState(
      item.tipo ||
        'bicicleta'
    );

  const [marca, setMarca] =
    useState(
      item.marca || ''
    );

  const [color, setColor] =
    useState(
      item.color || ''
    );

  const [serial, setSerial] =
    useState(
      item.tipo === 'moto'
        ? item.placa || ''
        : item.serial || ''
    );

  const [
    cilindraje,
    setCilindraje,
  ] = useState(
    item.cilindraje || ''
  );

  const [modelo, setModelo] =
    useState(
      item.modelo || ''
    );

  const save = async () => {
    try {
      await resources.updateVehicle(
        item.id,
        {
          tipo,
          marca,
          color,
          serial:
            tipo ===
            'bicicleta'
              ? serial
              : null,
          placa:
            tipo === 'moto'
              ? serial
              : null,
          cilindraje:
            tipo === 'moto'
              ? cilindraje
              : null,
          modelo:
            tipo === 'moto'
              ? modelo
              : null,
        }
      );

      setEditing(false);
      load();
    } catch (e) {
      Alert.alert(
        'Error',
        messageOf(e)
      );
    }
  };

  return (
    <View
      style={{
        marginTop: 12,
      }}
    >
      {editing ? (
        <>
          <SelectField
            label="TIPO"
            value={tipo}
            options={[
              {
                label:
                  'Bicicleta',
                value:
                  'bicicleta',
              },
              {
                label: 'Moto',
                value: 'moto',
              },
            ]}
            onChange={setTipo}
          />

          <Field
            label="MARCA"
            value={marca}
            onChangeText={
              setMarca
            }
          />

          <Field
            label="COLOR"
            value={color}
            onChangeText={
              setColor
            }
          />

          <Field
            label={
              tipo === 'moto'
                ? 'PLACA'
                : 'SERIAL'
            }
            value={serial}
            onChangeText={
              setSerial
            }
          />

          {tipo === 'moto' && (
            <>
              <Field
                label="CILINDRAJE"
                value={
                  cilindraje
                }
                onChangeText={
                  setCilindraje
                }
              />

              <Field
                label="MODELO"
                value={modelo}
                onChangeText={
                  setModelo
                }
              />
            </>
          )}

          <Button
            title="GUARDAR CAMBIOS"
            onPress={save}
          />

          <Button
            title="CANCELAR"
            outline
            onPress={() =>
              setEditing(false)
            }
          />
        </>
      ) : (
        <Button
          title="EDITAR VEHÍCULO"
          outline
          onPress={() =>
            setEditing(true)
          }
        />
      )}
    </View>
  );
}

/* =========================================================
   COMPARAR DATOS
========================================================= */

function CompareData({
  title,
  data,
}: any) {
  const d = data || {};

  return (
    <View
      style={{
        marginTop: 10,
        padding: 12,
        borderRadius: 12,
        backgroundColor:
          colors.bg,
      }}
    >
      <Text
        style={{
          fontWeight: '900',
          color: colors.dark,
          marginBottom: 5,
        }}
      >
        {title}
      </Text>

      {Object.entries(d)
        .length ? (
        Object.entries(d).map(
          ([k, v]) => (
            <Text
              key={k}
              style={{
                marginVertical: 2,
              }}
            >
              {pretty(k)}:{' '}
              {String(
                v ?? '—'
              )}
            </Text>
          )
        )
      ) : (
        <Text>
          Sin datos registrados
        </Text>
      )}
    </View>
  );
}

const pretty = (
  k: string
) =>
  ({
    nombres: 'Nombres',
    apellidos: 'Apellidos',
    documento: 'Documento',
    tipoDocumento:
      'Tipo de documento',
    celular: 'Celular',
    ficha: 'Ficha',
    centroFormacionId:
      'Centro de formación',
    fechaVinculacion:
      'Fecha de vinculación',
    fechaFinalizacion:
      'Fecha de finalización',
    tipoVehiculo:
      'Tipo de vehículo',
    marca: 'Marca',
    color: 'Color',
    serialPlaca:
      'Serial / placa',
    cilindraje:
      'Cilindraje',
    modelo: 'Modelo',
  } as any)[k] || k;

/* =========================================================
   CENTROS
========================================================= */

function CenterActions({
  item,
  load,
}: any) {
  const [editing, setEditing] =
    useState(false);

  const [nombre, setNombre] =
    useState(
      item.nombre || ''
    );

  const [ciudad, setCiudad] =
    useState(
      item.ciudad || ''
    );

  const [
    direccion,
    setDireccion,
  ] = useState(
    item.direccion || ''
  );

  return (
    <View
      style={{
        marginTop: 10,
      }}
    >
      {editing ? (
        <>
          <Field
            label="NOMBRE"
            value={nombre}
            onChangeText={
              setNombre
            }
          />

          <Field
            label="CIUDAD"
            value={ciudad}
            onChangeText={
              setCiudad
            }
          />

          <Field
            label="DIRECCIÓN"
            value={direccion}
            onChangeText={
              setDireccion
            }
          />

          <Button
            title="GUARDAR"
            onPress={async () => {
              try {
                await resources.updateCenter(
                  item.id,
                  {
                    nombre,
                    ciudad,
                    direccion,
                  }
                );

                setEditing(false);
                load();
              } catch (e) {
                Alert.alert(
                  'Error',
                  messageOf(e)
                );
              }
            }}
          />
        </>
      ) : (
        <View
          style={{
            flexDirection:
              'row',
            gap: 8,
          }}
        >
          <View
            style={{ flex: 1 }}
          >
            <Button
              title="EDITAR"
              outline
              onPress={() =>
                setEditing(
                  true
                )
              }
            />
          </View>

          <View
            style={{ flex: 1 }}
          >
            <Button
              title="ELIMINAR"
              outline
              onPress={() =>
                Alert.alert(
                  'Eliminar',
                  '¿Eliminar este centro?',
                  [
                    {
                      text:
                        'Cancelar',
                    },
                    {
                      text:
                        'Eliminar',
                      style:
                        'destructive',
                      onPress:
                        async () => {
                          try {
                            await resources.deleteCenter(
                              item.id
                            );

                            load();
                          } catch (e) {
                            Alert.alert(
                              'Error',
                              messageOf(
                                e
                              )
                            );
                          }
                        },
                    },
                  ]
                )
              }
            />
          </View>
        </View>
      )}
    </View>
  );
}

/* =========================================================
   DOCUMENTOS
========================================================= */

function DocActions({
  item,
  load,
}: any) {
  const [nombre, setNombre] =
    useState(
      item.nombre_documento ||
        item.descripcion ||
        item.nombre ||
        ''
    );

  const [editing, setEditing] =
    useState(false);

  return (
    <View
      style={{
        marginTop: 10,
      }}
    >
      {editing ? (
        <>
          <Field
            label="TIPO DE DOCUMENTO"
            value={nombre}
            onChangeText={
              setNombre
            }
          />

          <Button
            title="GUARDAR"
            onPress={async () => {
              try {
                await resources.updateDoc(
                  item.id,
                  {
                    nombre_documento:
                      nombre,
                    descripcion:
                      nombre,
                  }
                );

                setEditing(false);
                load();
              } catch (e) {
                Alert.alert(
                  'Error',
                  messageOf(e)
                );
              }
            }}
          />
        </>
      ) : (
        <View
          style={{
            flexDirection:
              'row',
            gap: 8,
          }}
        >
          <View
            style={{ flex: 1 }}
          >
            <Button
              title="EDITAR"
              outline
              onPress={() =>
                setEditing(
                  true
                )
              }
            />
          </View>

          <View
            style={{ flex: 1 }}
          >
            <Button
              title="ELIMINAR"
              outline
              onPress={() =>
                Alert.alert(
                  'Eliminar',
                  '¿Eliminar este tipo?',
                  [
                    {
                      text:
                        'Cancelar',
                    },
                    {
                      text:
                        'Eliminar',
                      style:
                        'destructive',
                      onPress:
                        async () => {
                          try {
                            await resources.deleteDoc(
                              item.id
                            );

                            load();
                          } catch (e) {
                            Alert.alert(
                              'Error',
                              messageOf(
                                e
                              )
                            );
                          }
                        },
                    },
                  ]
                )
              }
            />
          </View>
        </View>
      )}
    </View>
  );
}

/* =========================================================
   FORM SCREEN
========================================================= */

function FormScreen({
  keyName,
  title,
  user,
  navigation,
  onDone,
}: any) {
  const [tipo, setTipo] =
    useState('bicicleta');

  const [marca, setMarca] =
    useState('');

  const [color, setColor] =
    useState('');

  const [serial, setSerial] =
    useState('');

  const [
    cilindraje,
    setCilindraje,
  ] = useState('');

  const [modelo, setModelo] =
    useState('');

  const [asunto, setAsunto] =
    useState('');

  const [
    descripcion,
    setDescripcion,
  ] = useState('');

  const [form, setForm] =
    useState<any>({
      tipo: 'datos_personales',
    });

  const [loading, setLoading] =
    useState(false);

  const [photo, setPhoto] =
    useState<any>(null);

  const [
    vehiclePhoto,
    setVehiclePhoto,
  ] = useState<any>(null);

  const [docs, setDocs] =
    useState<any[]>([]);

  const [personal, setPersonal] =
    useState<any>({});

  const [vehicle, setVehicle] =
    useState<any>(null);

  const [centers, setCenters] =
    useState<any[]>([]);

  const [docTypes, setDocTypes] =
    useState<any[]>([]);

  useEffect(() => {
    if (
      keyName === 'request' ||
      keyName === 'update'
    ) {
      Promise.all([
        resources.centers(),
        resources.docs(),
        resources.myVehicles(),
      ])
        .then(
          ([c, d, v]) => {
            setCenters(
              arr(c.data)
            );

            setDocTypes(
              arr(d.data)
            );

            const vv =
              arr(v.data)[0] ||
              null;

            setVehicle(vv);

            if (vv) {
              setTipo(
                vv.tipo ||
                  'bicicleta'
              );

              setMarca(
                vv.marca || ''
              );

              setColor(
                vv.color || ''
              );

              setSerial(
                vv.tipo ===
                  'moto'
                  ? vv.placa ||
                      ''
                  : vv.serial ||
                      ''
              );

              setCilindraje(
                vv.cilindraje ||
                  ''
              );

              setModelo(
                vv.modelo || ''
              );
            }

            if (
              keyName ===
              'update'
            ) {
              resources
                .user(user.id)
                .then((r) =>
                  setPersonal(
                    r.data
                  )
                )
                .catch(
                  () => {}
                );
            }
          }
        )
        .catch(() => {});
    }
  }, []);

  const takePhoto = async (
    setter: any
  ) => {
    const p =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!p.granted) {
      return Alert.alert(
        'Permiso',
        'Permita el acceso a la cámara'
      );
    }

    const r =
      await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.85,
      });

    if (!r.canceled) {
      setter(
        uriFile(
          r.assets[0]
        )
      );
    }
  };

  const pickImage = async (
    setter: any
  ) => {
    const p =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!p.granted) {
      return Alert.alert(
        'Permiso',
        'Permita acceso a las fotos'
      );
    }

    const r =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.85,
      });

    if (!r.canceled) {
      setter(
        uriFile(
          r.assets[0]
        )
      );
    }
  };

  const pickFile = async (
    setter: any
  ) => {
    const r =
      await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

    if (!r.canceled) {
      setter(
        uriFile(
          r.assets[0]
        )
      );
    }
  };

  const chooseFileSource = (
    setter: any
  ) => {
    Alert.alert(
      'Seleccionar archivo',
      '¿De dónde desea seleccionar el archivo?',
      [
        {
          text: 'Cámara',
          onPress: () =>
            takePhoto(setter),
        },
        {
          text: 'Fotos',
          onPress: () =>
            pickImage(setter),
        },
        {
          text: 'Archivos',
          onPress: () =>
            pickFile(setter),
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const addCategory = (
    cat: string,
    label: string
  ) => {
    const saveDocument = (
      asset: any
    ) => {
      const f = uriFile(asset);

      if (!f) {
        return;
      }

      setDocs(
        (p: any[]) => [
          ...p.filter(
            (x) =>
              x.category !== cat
          ),
          {
            ...f,
            file: f,
            category: cat,
            label,
          },
        ]
      );
    };

    Alert.alert(
      'Seleccionar archivo',
      '¿De dónde desea seleccionar el archivo?',
      [
        {
          text: 'Cámara',
          onPress: async () => {
            const p =
              await ImagePicker.requestCameraPermissionsAsync();

            if (!p.granted) {
              return Alert.alert(
                'Permiso',
                'Permita el acceso a la cámara'
              );
            }

            const r =
              await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                quality: 0.85,
              });

            if (!r.canceled) {
              saveDocument(
                r.assets[0]
              );
            }
          },
        },
        {
          text: 'Fotos',
          onPress: async () => {
            const p =
              await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!p.granted) {
              return Alert.alert(
                'Permiso',
                'Permita acceso a las fotos'
              );
            }

            const r =
              await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 0.85,
              });

            if (!r.canceled) {
              saveDocument(
                r.assets[0]
              );
            }
          },
        },
        {
          text: 'Archivos',
          onPress: async () => {
            const r =
              await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
              });

            if (!r.canceled) {
              saveDocument(
                r.assets[0]
              );
            }
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const submit = async () => {
    setLoading(true);

    try {
      if (
        keyName ===
        'createCenter'
      ) {
        if (
          !asunto.trim() ||
          !descripcion.trim() ||
          !serial.trim()
        ) {
          throw new Error(
            'Nombre, ciudad y dirección son obligatorios'
          );
        }

        await resources.createCenter(
          {
            nombre:
              asunto.trim(),
            ciudad:
              descripcion.trim(),
            direccion:
              serial.trim(),
          }
        );

        Alert.alert(
          'Listo',
          'Centro creado correctamente'
        );
      } else if (
        keyName ===
        'createDoc'
      ) {
        if (
          !asunto.trim() ||
          !serial.trim()
        ) {
          throw new Error(
            'Nombre y sigla son obligatorios'
          );
        }

        await resources.createDoc(
          {
            sigla: serial
              .trim()
              .toUpperCase(),
            nombre_documento:
              asunto.trim(),
          }
        );

        Alert.alert(
          'Listo',
          'Tipo de documento creado correctamente'
        );
      } else if (
        keyName ===
        'support'
      ) {
        if (
          !asunto.trim() ||
          !descripcion.trim()
        ) {
          throw new Error(
            'El asunto y la descripción son obligatorios'
          );
        }

        await resources.createSupport(
          {
            asunto:
              asunto.trim(),
            descripcion:
              descripcion.trim(),
          }
        );

        Alert.alert(
          'SENA PARKING',
          'Soporte enviado correctamente'
        );
      } else if (
        keyName ===
        'request'
      ) {
        const required =
          tipo === 'moto'
            ? [
                'cedula',
                'tecno',
                'soat',
                'placa',
                'propiedad',
              ]
            : [
                'cedula',
                'serial',
                'propiedad',
              ];

        if (
          !marca.trim() ||
          !color.trim() ||
          !serial.trim() ||
          !photo ||
          !vehiclePhoto
        ) {
          throw new Error(
            'Completa los datos y las dos fotos obligatorias'
          );
        }

        if (
          tipo === 'moto' &&
          (!cilindraje.trim() ||
            !modelo.trim())
        ) {
          throw new Error(
            'Para moto el cilindraje y modelo son obligatorios'
          );
        }

        if (
          !required.every(
            (t) =>
              docs.some(
                (d: any) =>
                  d.category ===
                  t
              )
          )
        ) {
          throw new Error(
            `Debes adjuntar: ${required.join(
              ', '
            )}`
          );
        }

        const fd: any =
          new FormData();

        fd.append(
          'tipoVehiculo',
          tipo
        );

        fd.append(
          'marca',
          marca.trim()
        );

        fd.append(
          'color',
          color.trim()
        );

        fd.append(
          'serialPlaca',
          serial.trim()
        );

        fd.append(
          'cilindraje',
          tipo === 'moto'
            ? cilindraje.trim()
            : ''
        );

        fd.append(
          'modelo',
          tipo === 'moto'
            ? modelo.trim()
            : ''
        );

        fd.append(
          'fotoAprendiz',
          photo
        );

        fd.append(
          'fotoVehiculo',
          vehiclePhoto
        );

        docs.forEach(
          (d: any) => {
            fd.append(
              'documentosAnexos',
              d.file
            );

            fd.append(
              'documentosTipos',
              d.category
            );
          }
        );

        await resources.requestCarnet(
          fd
        );

        Alert.alert(
          'SENA PARKING',
          'Solicitud enviada correctamente'
        );
      } else if (
        keyName ===
        'update'
      ) {
        let actual: any =
          {};

        let nuevos: any =
          {};

        if (
          form.tipo ===
          'datos_personales'
        ) {
          actual = {
            nombres:
              personal.nombres,
            apellidos:
              personal.apellidos,
            documento:
              personal.documento,
            tipoDocumento:
              personal.tipoDocumento,
            celular:
              personal.celular,
            ficha:
              personal.ficha,
            centroFormacionId:
              personal.centroFormacionId,
            fechaVinculacion:
              personal.fechaVinculacion,
            fechaFinalizacion:
              personal.fechaFinalizacion,
          };

          nuevos = {
            ...actual,
          };
        } else {
          actual = {
            vehiculoId:
              vehicle?.id,
            tipoVehiculo:
              vehicle?.tipo,
            marca:
              vehicle?.marca,
            color:
              vehicle?.color,
            serialPlaca:
              vehicle?.tipo ===
              'moto'
                ? vehicle?.placa
                : vehicle?.serial,
            cilindraje:
              vehicle?.cilindraje,
            modelo:
              vehicle?.modelo,
          };

          nuevos = {
            vehiculoId:
              vehicle?.id,
            tipoVehiculo:
              tipo,
            marca,
            color,
            serialPlaca:
              serial,
            cilindraje:
              tipo === 'moto'
                ? cilindraje
                : '',
            modelo:
              tipo === 'moto'
                ? modelo
                : '',
          };
        }

        const fd: any =
          new FormData();

        fd.append(
          'tipo',
          form.tipo
        );

        fd.append(
          'datosActuales',
          JSON.stringify(
            actual
          )
        );

        fd.append(
          'datosNuevos',
          JSON.stringify(
            nuevos
          )
        );

        if (photo) {
          fd.append(
            'fotoNueva',
            photo
          );
        }

        docs.forEach(
          (d: any) => {
            fd.append(
              'documentos',
              d.file
            );

            fd.append(
              'documentosTipos',
              d.category
            );
          }
        );

        await api.post(
          '/api/solicitudes-actualizacion',
          fd
        );

        Alert.alert(
          'SENA PARKING',
          'Solicitud de actualización enviada correctamente'
        );
      }

      onDone();

      navigation.goBack();
    } catch (e) {
      Alert.alert(
        'Error',
        messageOf(e)
      );
    } finally {
      setLoading(false);
    }
  };

  const centerOptions =
    centers.map((c) => ({
      label: `${c.nombre}${
        c.ciudad
          ? ` — ${c.ciudad}`
          : ''
      }`,
      value: String(
        c.id
      ),
    }));

  const docOptions =
    docTypes.map((d) => ({
      label: `${d.sigla} — ${d.nombre_documento}`,
      value: d.sigla,
    }));

  const requestCategories =
    tipo === 'moto'
      ? [
          [
            'cedula',
            'Foto de la cédula',
          ],
          [
            'tecno',
            'Tecnomecánica',
          ],
          ['soat', 'SOAT'],
          [
            'placa',
            'Foto de la placa',
          ],
          [
            'propiedad',
            'Tarjeta de propiedad',
          ],
        ]
      : [
          [
            'cedula',
            'Foto de la cédula',
          ],
          [
            'serial',
            'Foto del serial',
          ],
          [
            'propiedad',
            'Tarjeta de propiedad',
          ],
        ];

  const updateVehicleCategories =
    tipo === 'moto'
      ? [
          [
            'tecno',
            'Tecnomecánica (opcional)',
          ],
          [
            'soat',
            'SOAT (opcional)',
          ],
          [
            'placa',
            'Foto de la placa (opcional)',
          ],
          [
            'propiedad',
            'Tarjeta de propiedad (opcional)',
          ],
        ]
      : [
          [
            'serial',
            'Foto del serial (opcional)',
          ],
          [
            'propiedad',
            'Tarjeta de propiedad (opcional)',
          ],
        ];

  let body: React.ReactNode;

  if (
    keyName ===
    'createCenter'
  ) {
    body = (
      <>
        <Text style={common.title}>
          Nuevo centro
        </Text>

        <Field
          label="NOMBRE"
          value={asunto}
          onChangeText={
            setAsunto
          }
        />

        <Field
          label="CIUDAD"
          value={descripcion}
          onChangeText={
            setDescripcion
          }
        />

        <Field
          label="DIRECCIÓN"
          value={serial}
          onChangeText={
            setSerial
          }
        />
      </>
    );
  } else if (
    keyName ===
    'createDoc'
  ) {
    body = (
      <>
        <Text style={common.title}>
          Nuevo tipo de documento
        </Text>

        <Field
          label="NOMBRE"
          value={asunto}
          onChangeText={
            setAsunto
          }
        />

        <Field
          label="SIGLA"
          value={serial}
          onChangeText={
            setSerial
          }
        />
      </>
    );
  } else if (
    keyName ===
    'support'
  ) {
    body = (
      <>
        <Text style={common.title}>
          Soporte técnico
        </Text>

        <Field
          label="ASUNTO"
          value={asunto}
          onChangeText={
            setAsunto
          }
        />

        <Field
          label="DESCRIPCIÓN"
          value={descripcion}
          onChangeText={
            setDescripcion
          }
          multiline
          numberOfLines={6}
        />
      </>
    );
  } else if (
    keyName ===
    'request'
  ) {
    body = (
      <>
        <Text style={common.title}>
          Petición de carnet
        </Text>

        <Text
          style={common.subtitle}
        >
          Para la primera solicitud
          se mantienen los
          documentos requeridos.
        </Text>

        <SelectField
          label="TIPO DE VEHÍCULO"
          value={tipo}
          options={[
            {
              label:
                '🚲 Bicicleta',
              value:
                'bicicleta',
            },
            {
              label: '🏍️ Moto',
              value: 'moto',
            },
          ]}
          onChange={(v) => {
            setTipo(v);
            setSerial('');
            setDocs([]);
          }}
        />

        <Field
          label="MARCA"
          value={marca}
          onChangeText={
            setMarca
          }
        />

        <Field
          label="COLOR"
          value={color}
          onChangeText={
            setColor
          }
        />

        <Field
          label={
            tipo === 'moto'
              ? 'PLACA'
              : 'SERIAL'
          }
          value={serial}
          onChangeText={
            setSerial
          }
        />

        {tipo === 'moto' && (
          <>
            <Field
              label="CILINDRAJE"
              value={
                cilindraje
              }
              onChangeText={
                setCilindraje
              }
              keyboardType="numeric"
            />

            <Field
              label="MODELO"
              value={modelo}
              onChangeText={
                setModelo
              }
              keyboardType="numeric"
            />
          </>
        )}

        <FileButton
          label="Foto del aprendiz"
          value={photo?.name}
          onPress={() =>
            chooseFileSource(
              setPhoto
            )
          }
        />

        <FileButton
          label="Foto del vehículo"
          value={
            vehiclePhoto?.name
          }
          onPress={() =>
            chooseFileSource(
              setVehiclePhoto
            )
          }
        />

        <Text
          style={styles.subhead}
        >
          Anexos requeridos
        </Text>

        {requestCategories.map(
          ([c, l]) => (
            <FileButton
              key={c}
              label={`📎 ${l}`}
              value={
                docs.find(
                  (d: any) =>
                    d.category ===
                    c
                )?.name
              }
              onPress={() =>
                addCategory(
                  c,
                  l
                )
              }
            />
          )
        )}
      </>
    );
  } else {
    body = (
      <>
        <Text style={common.title}>
          Actualizar datos
        </Text>

        <Text
          style={common.subtitle}
        >
          Solo se solicitarán los
          datos necesarios. La
          cédula no es un requisito
          documental y los anexos
          del vehículo son
          opcionales.
        </Text>

        <View
          style={{
            flexDirection:
              'row',
            gap: 8,
            marginBottom: 8,
          }}
        >
          <Tab
            active={
              form.tipo ===
              'datos_personales'
            }
            text="Personales"
            onPress={() => {
              setForm({
                tipo:
                  'datos_personales',
              });

              setDocs([]);
            }}
          />

          <Tab
            active={
              form.tipo ===
              'datos_vehiculo'
            }
            text="Vehículo"
            onPress={() => {
              setForm({
                tipo:
                  'datos_vehiculo',
              });

              setDocs([]);
            }}
          />
        </View>

        {form.tipo ===
        'datos_personales' ? (
          <>
            <Field
              label="NOMBRES"
              value={
                personal.nombres ||
                ''
              }
              onChangeText={(
                v
              ) =>
                setPersonal({
                  ...personal,
                  nombres: v,
                })
              }
            />

            <Field
              label="APELLIDOS"
              value={
                personal.apellidos ||
                ''
              }
              onChangeText={(
                v
              ) =>
                setPersonal({
                  ...personal,
                  apellidos: v,
                })
              }
            />

            <Field
              label="DOCUMENTO (OPCIONAL)"
              value={
                personal.documento ||
                ''
              }
              onChangeText={(
                v
              ) =>
                setPersonal({
                  ...personal,
                  documento: v,
                })
              }
            />

            <SelectField
              label="TIPO DE DOCUMENTO"
              value={
                personal.tipoDocumento ||
                ''
              }
              options={
                docOptions
              }
              onChange={(v) =>
                setPersonal({
                  ...personal,
                  tipoDocumento:
                    v,
                })
              }
            />

            <Field
              label="CELULAR"
              value={
                personal.celular ||
                ''
              }
              onChangeText={(
                v
              ) =>
                setPersonal({
                  ...personal,
                  celular: v,
                })
              }
            />

            <Field
              label="FICHA"
              value={
                personal.ficha ||
                ''
              }
              onChangeText={(
                v
              ) =>
                setPersonal({
                  ...personal,
                  ficha: v,
                })
              }
            />

            <Text
              style={common.label}
            >
              CENTRO ACTUAL
            </Text>

            <Text
              style={{
                padding: 12,
                borderWidth: 1,
                borderColor:
                  colors.border,
                borderRadius: 10,
                color:
                  colors.dark,
                backgroundColor:
                  colors.bg,
              }}
            >
              {personal
                .centroFormacion
                ?.nombre ||
                'No disponible'}
            </Text>

            <SelectField
              label="CENTRO DE FORMACIÓN (OPCIONAL)"
              value={String(
                personal.centroFormacionId ||
                  ''
              )}
              options={
                centerOptions
              }
              onChange={(v) =>
                setPersonal({
                  ...personal,
                  centroFormacionId:
                    v,
                })
              }
            />

            <DatePickerField
              label="Fecha de vinculación"
              value={
                personal.fechaVinculacion ||
                ''
              }
              onChange={(v) =>
                setPersonal({
                  ...personal,
                  fechaVinculacion:
                    v,
                })
              }
            />

            <DatePickerField
              label="Fecha de finalización"
              value={
                personal.fechaFinalizacion ||
                ''
              }
              onChange={(v) =>
                setPersonal({
                  ...personal,
                  fechaFinalizacion:
                    v,
                })
              }
            />

            <FileButton
              label="Foto nueva (opcional)"
              value={
                photo?.name
              }
              onPress={() =>
                chooseFileSource(
                  setPhoto
                )
              }
            />
          </>
        ) : (
          <>
            <CompareData
              title="DATOS ACTUALES DEL VEHÍCULO"
              data={
                vehicle
                  ? {
                      vehiculoId:
                        vehicle.id,
                      tipoVehiculo:
                        vehicle.tipo,
                      marca:
                        vehicle.marca,
                      color:
                        vehicle.color,
                      serialPlaca:
                        vehicle.tipo ===
                        'moto'
                          ? vehicle.placa
                          : vehicle.serial,
                      cilindraje:
                        vehicle.cilindraje,
                      modelo:
                        vehicle.modelo,
                    }
                  : null
              }
            />

            <SelectField
              label="NUEVO TIPO"
              value={tipo}
              options={[
                {
                  label:
                    'Bicicleta',
                  value:
                    'bicicleta',
                },
                {
                  label:
                    'Moto',
                  value: 'moto',
                },
              ]}
              onChange={(v) => {
                setTipo(v);
                setDocs([]);
              }}
            />

            <Field
              label="MARCA"
              value={marca}
              onChangeText={
                setMarca
              }
            />

            <Field
              label="COLOR"
              value={color}
              onChangeText={
                setColor
              }
            />

            <Field
              label={
                tipo === 'moto'
                  ? 'PLACA'
                  : 'SERIAL (OPCIONAL)'
              }
              value={serial}
              onChangeText={
                setSerial
              }
            />

            {tipo === 'moto' && (
              <>
                <Field
                  label="CILINDRAJE"
                  value={
                    cilindraje
                  }
                  onChangeText={
                    setCilindraje
                  }
                />

                <Field
                  label="MODELO"
                  value={modelo}
                  onChangeText={
                    setModelo
                  }
                />
              </>
            )}

            <Text
              style={
                styles.subhead
              }
            >
              Documentos del
              vehículo — todos
              opcionales
            </Text>

            {updateVehicleCategories.map(
              ([c, l]) => (
                <FileButton
                  key={c}
                  label={`📎 ${l}`}
                  value={
                    docs.find(
                      (d: any) =>
                        d.category ===
                        c
                    )?.name
                  }
                  onPress={() =>
                    addCategory(
                      c,
                      l
                    )
                  }
                />
              )
            )}
          </>
        )}
      </>
    );
  }

  return (
    <View
      style={common.screen}
    >
      <Header
        title={title}
        navigation={
          navigation
        }
        onMenu={() => {}}
      />

      <ScrollView
        contentContainerStyle={
          common.content
        }
      >
        <View
          style={common.card}
        >
          {body}

          <Button
            title="ENVIAR / GUARDAR"
            onPress={submit}
            loading={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
}

/* =========================================================
   FILE BUTTON
========================================================= */

function FileButton({
  label,
  value,
  onPress,
}: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={
        styles.filePicker
      }
    >
      <Text
        style={{
          fontWeight: '800',
          color: colors.dark,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          fontSize: 12,
          color: colors.muted,
          marginTop: 4,
        }}
      >
        {value ||
          'Seleccionar archivo'}
      </Text>
    </TouchableOpacity>
  );
}

/* =========================================================
   HOME
========================================================= */

function InfoHome({
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

function Manual({
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

const styles: any = {
  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor:
      colors.light,
    alignItems: 'center',
    justifyContent:
      'center',
    marginRight: 10,
  },

  brand: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.dark,
  },

  role: {
    fontSize: 12,
    color: colors.muted,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor:
      '#eef2ee',
  },

  menuIcon: {
    width: 34,
    fontSize: 21,
  },

  menuText: {
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.dark,
  },

  boldLine: {
    marginTop: 7,
    fontWeight: '800',
  },

  subhead: {
    fontWeight: '900',
    marginTop: 16,
    color: colors.dark,
  },

  date: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 6,
  },

  status: {
    marginTop: 8,
    fontWeight: '900',
    color: colors.dark,
  },

  answer: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor:
      colors.light,
    borderLeftWidth: 4,
    borderLeftColor:
      colors.primary,
  },

  answerTitle: {
    fontWeight: '900',
    color: colors.dark,
    marginBottom: 5,
  },

  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    marginTop: 9,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 12,
    backgroundColor: '#fff',
  },

  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor:
      colors.light,
    alignItems: 'center',
    justifyContent:
      'center',
  },

  fileTitle: {
    fontWeight: '800',
    color: colors.dark,
  },

  fileSub: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },

  filePicker: {
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
    backgroundColor: '#fff',
  },

  hero: {
    backgroundColor:
      colors.dark,
    borderRadius: 20,
    padding: 22,
    marginBottom: 14,
  },

  heroSmall: {
    color: '#DDF5E0',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },

  heroTitle: {
    color: '#fff',
    fontSize: 27,
    fontWeight: '900',
    marginTop: 7,
  },

  heroText: {
    color: '#EAF7EC',
    lineHeight: 22,
    marginTop: 9,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.dark,
  },

  infoRow: {
    marginTop: 9,
    lineHeight: 21,
    color: colors.text,
  },

  manualIntro: {
    marginBottom: 8,
  },

  manualCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12,
  },

  num: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor:
      colors.primary,
    alignItems: 'center',
    justifyContent:
      'center',
  },

  report: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor:
      colors.bg,
  },

  reportTitle: {
    fontWeight: '900',
    color: colors.dark,
    marginBottom: 8,
  },
};