import React from 'react';
import { Alert, Text, View } from 'react-native';
import Button from '../Button';
import { resources, messageOf } from '../../data/api';
import { colors, common } from '../../theme';
import styles from './featureStyles';

export default function CarnetReportPanel({
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

