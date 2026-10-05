import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import Button from '../Button';
import { resources, messageOf } from '../../data/api';
import { colors, common } from '../../theme';
import styles from './featureStyles';

export default function ReportPanel() {
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

