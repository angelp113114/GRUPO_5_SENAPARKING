import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { auth, fileUrl, messageOf } from '../data/api';

export default function PerfilAprendiz() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState('');

  // ============================================================
  // OBTENER PERFIL
  // ============================================================

  const cargarPerfil = useCallback(
    async (mostrarCarga = true) => {
      try {
        if (mostrarCarga) {
          setCargando(true);
        }

        setError('');

        const response = await auth.me();

        const datos =
          response?.data?.user ||
          response?.data;

        if (!datos) {
          throw new Error(
            'El servidor no devolvió los datos del usuario.'
          );
        }

        setUsuario(datos);
      } catch (err) {
        console.error(
          'ERROR CARGANDO PERFIL:',
          err
        );

        setError(
          messageOf(err) ||
            'No se pudo cargar el perfil.'
        );
      } finally {
        setCargando(false);
        setRefrescando(false);
      }
    },
    []
  );

  // ============================================================
  // AL ABRIR LA PANTALLA
  // ============================================================

  useEffect(() => {
    cargarPerfil();
  }, [cargarPerfil]);

  // ============================================================
  // REFRESCAR
  // ============================================================

  const refrescar = () => {
    setRefrescando(true);
    cargarPerfil(false);
  };

  // ============================================================
  // NOMBRE COMPLETO
  // ============================================================

  const nombreCompleto = [
    usuario?.nombres,
    usuario?.apellidos,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();

  // ============================================================
  // CENTRO DE FORMACIÓN
  // ============================================================

  const nombreCentro =
    usuario?.centroFormacion?.nombre ||
    'No registrado';

  // ============================================================
  // PROGRAMA
  // ============================================================

  const programa =
    usuario?.programa ||
    usuario?.programaFormacion ||
    'No registrado';

  // ============================================================
  // FOTO
  // ============================================================

  const foto =
    usuario?.foto
      ? fileUrl(usuario.foto)
      : '';

  // ============================================================
  // CARGANDO
  // ============================================================

  if (cargando && !usuario) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.cargandoContainer}>
          <View style={styles.cargandoLogo}>
            <Text style={styles.cargandoInicial}>
              S
            </Text>
          </View>

          <ActivityIndicator
            size="large"
            style={styles.spinner}
          />

          <Text style={styles.cargandoTexto}>
            Cargando tu perfil...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error && !usuario) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={
            styles.errorContainer
          }
          refreshControl={
            <RefreshControl
              refreshing={refrescando}
              onRefresh={refrescar}
            />
          }
        >
          <View style={styles.errorIcono}>
            <Text style={styles.errorIconoTexto}>
              !
            </Text>
          </View>

          <Text style={styles.errorTitulo}>
            No pudimos cargar tu perfil
          </Text>

          <Text style={styles.errorTexto}>
            {error}
          </Text>

          <Text style={styles.errorAyuda}>
            Desliza hacia abajo para volver a
            intentarlo.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ============================================================
  // PERFIL
  // ============================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={refrescar}
          />
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* =====================================================
            ENCABEZADO
        ====================================================== */}

        <View style={styles.header}>
          <Text style={styles.titulo}>
            Mi Perfil
          </Text>

          <Text style={styles.subtitulo}>
            Información de tu cuenta
          </Text>
        </View>

        {/* =====================================================
            FOTO + NOMBRE
        ====================================================== */}

        <View style={styles.presentacionCard}>
          <View style={styles.fotoContainer}>
            {foto ? (
              <Image
                source={{ uri: foto }}
                style={styles.foto}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.fotoPlaceholder}>
                <Text
                  style={
                    styles.fotoPlaceholderTexto
                  }
                >
                  {(
                    usuario?.nombres?.charAt(0) ||
                    'A'
                  ).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.nombre}>
            {nombreCompleto ||
              'Aprendiz'}
          </Text>

          <View style={styles.rolBadge}>
            <Text style={styles.rolTexto}>
              APRENDIZ
            </Text>
          </View>
        </View>

        {/* =====================================================
            INFORMACIÓN PERSONAL
        ====================================================== */}

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>
            Información personal
          </Text>

          <View style={styles.card}>
            <InfoItem
              icon="🪪"
              label="Documento"
              value={
                usuario?.documento ||
                'No registrado'
              }
            />

            <InfoItem
              icon="✉️"
              label="Correo electrónico"
              value={
                usuario?.email ||
                'No registrado'
              }
            />

            <InfoItem
              icon="📱"
              label="Celular"
              value={
                usuario?.celular ||
                'No registrado'
              }
              last
            />
          </View>
        </View>

        {/* =====================================================
            INFORMACIÓN ACADÉMICA
        ====================================================== */}

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>
            Información académica
          </Text>

          <View style={styles.card}>
            <InfoItem
              icon="🏫"
              label="Centro de formación"
              value={nombreCentro}
            />

            <InfoItem
              icon="📚"
              label="Programa"
              value={programa}
            />

            <InfoItem
              icon="🎓"
              label="Ficha"
              value={
                usuario?.ficha ||
                'No registrada'
              }
              last
            />
          </View>
        </View>

        {/* =====================================================
            VINCULACIÓN
        ====================================================== */}

        <View style={styles.seccion}>
          <Text style={styles.seccionTitulo}>
            Vinculación
          </Text>

          <View style={styles.card}>
            <InfoItem
              icon="📅"
              label="Fecha de vinculación"
              value={formatearFecha(
                usuario?.fechaVinculacion
              )}
            />

            <InfoItem
              icon="🏁"
              label="Fecha de finalización"
              value={formatearFecha(
                usuario?.fechaFinalizacion
              )}
              last
            />
          </View>
        </View>

        {/* =====================================================
            PIE
        ====================================================== */}

        <View style={styles.footer}>
          <Text style={styles.footerTexto}>
            SENA Parking
          </Text>

          <Text style={styles.footerSubtexto}>
            Información actualizada desde tu
            cuenta
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================
// COMPONENTE INFO ITEM
// ============================================================

function InfoItem({
  icon,
  label,
  value,
  last = false,
}) {
  return (
    <View
      style={[
        styles.infoItem,
        !last && styles.infoItemBorder,
      ]}
    >
      <View style={styles.infoIcon}>
        <Text style={styles.infoIconTexto}>
          {icon}
        </Text>
      </View>

      <View style={styles.infoContenido}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text
          style={styles.infoValue}
          numberOfLines={3}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

// ============================================================
// FORMATEAR FECHA
// ============================================================

function formatearFecha(fecha) {
  if (!fecha) {
    return 'No registrada';
  }

  try {
    const fechaObjeto = new Date(fecha);

    if (isNaN(fechaObjeto.getTime())) {
      return 'No registrada';
    }

    return fechaObjeto.toLocaleDateString(
      'es-CO',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }
    );
  } catch {
    return 'No registrada';
  }
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f7f5',
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 35,
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    marginBottom: 18,
  },

  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: '#123b25',
  },

  subtitulo: {
    marginTop: 4,
    fontSize: 15,
    color: '#718078',
  },

  // ==========================================================
  // PRESENTACIÓN
  // ==========================================================

  presentacionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 26,
    paddingHorizontal: 18,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  fotoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#16bb00',
    backgroundColor: '#e8f5eb',
  },

  foto: {
    width: '100%',
    height: '100%',
  },

  fotoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dff3e4',
  },

  fotoPlaceholderTexto: {
    fontSize: 55,
    fontWeight: '800',
    color: '#128a32',
  },

  nombre: {
    fontSize: 23,
    fontWeight: '800',
    color: '#173c27',
    textAlign: 'center',
  },

  rolBadge: {
    marginTop: 9,
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e3f7e8',
  },

  rolTexto: {
    color: '#128a32',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.7,
  },

  // ==========================================================
  // SECCIONES
  // ==========================================================

  seccion: {
    marginTop: 24,
  },

  seccionTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#173c27',
    marginBottom: 10,
    marginLeft: 3,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 9,
    elevation: 3,
  },

  // ==========================================================
  // INFO ITEM
  // ==========================================================

  infoItem: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

  infoItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#edf1ee',
  },

  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#eaf7ed',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  infoIconTexto: {
    fontSize: 20,
  },

  infoContenido: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7b8780',
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#20352a',
    lineHeight: 21,
  },

  // ==========================================================
  // FOOTER
  // ==========================================================

  footer: {
    alignItems: 'center',
    marginTop: 30,
    paddingVertical: 10,
  },

  footerTexto: {
    fontSize: 15,
    fontWeight: '800',
    color: '#16a33a',
  },

  footerSubtexto: {
    marginTop: 4,
    fontSize: 12,
    color: '#89948d',
  },

  // ==========================================================
  // CARGANDO
  // ==========================================================

  cargandoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  cargandoLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#16bb00',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  cargandoInicial: {
    color: '#ffffff',
    fontSize: 38,
    fontWeight: '900',
  },

  spinner: {
    marginBottom: 12,
  },

  cargandoTexto: {
    fontSize: 15,
    color: '#66736b',
    fontWeight: '600',
  },

  // ==========================================================
  // ERROR
  // ==========================================================

  errorContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },

  errorIcono: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffe9e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },

  errorIconoTexto: {
    fontSize: 36,
    fontWeight: '900',
    color: '#d93636',
  },

  errorTitulo: {
    fontSize: 21,
    fontWeight: '800',
    color: '#26362c',
    textAlign: 'center',
  },

  errorTexto: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: '#69756e',
    textAlign: 'center',
  },

  errorAyuda: {
    marginTop: 18,
    fontSize: 13,
    color: '#87928b',
    textAlign: 'center',
  },
});