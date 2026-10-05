import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import Button from '../Button';
import Field from '../Field';
import { resources, messageOf } from '../../data/api';

export default function SupportReply({
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

