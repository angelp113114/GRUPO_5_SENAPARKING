import React from 'react';
import { Alert } from 'react-native';
import Button from '../Button';
import { resources, messageOf } from '../../data/api';

export default function BlockActions({
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

