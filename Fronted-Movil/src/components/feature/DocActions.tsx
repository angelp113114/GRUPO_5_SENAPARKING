import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import Button from '../Button';
import Field from '../Field';
import { resources, messageOf } from '../../data/api';

export default function DocActions({
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

