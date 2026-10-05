import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import Button from '../Button';
import Field from '../Field';
import SelectField from '../SelectField';
import { resources, messageOf } from '../../data/api';

export default function AdminVehicleActions({
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

