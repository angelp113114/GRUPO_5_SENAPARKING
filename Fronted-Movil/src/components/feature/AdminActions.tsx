import React from 'react';
import { Alert, Text, View } from 'react-native';
import Button from '../Button';
import { resources, messageOf } from '../../data/api';

export default function AdminActions({
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

