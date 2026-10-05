import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './featureStyles';
import { colors } from '../../theme';

export default function Tab({
  active,
  text,
  onPress,
}: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor:
          active
            ? colors.primary
            : colors.border,
        backgroundColor:
          active
            ? colors.light
            : '#fff',
      }}
    >
      <Text
        style={{
          textAlign: 'center',
          fontWeight: '900',
          color: active
            ? colors.dark
            : colors.text,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

/* =========================================================
   REPORTE ENTRADAS / SALIDAS
========================================================= */

