import React from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { fileUrl } from '../../data/api';
import styles from './featureStyles';

export default function Photo({
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

