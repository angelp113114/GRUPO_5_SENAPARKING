import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import Button from '../Button';
import Field from '../Field';
import { resources, messageOf } from '../../data/api';

export default function CenterActions({
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

