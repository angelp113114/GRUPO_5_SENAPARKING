import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './featureStyles';
import { colors } from '../../theme';

export default function FileButton({
  label,
  value,
  onPress,
}: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={
        styles.filePicker
      }
    >
      <Text
        style={{
          fontWeight: '800',
          color: colors.dark,
        }}
      >
        {label}
      </Text>

      <Text
        style={{
          fontSize: 12,
          color: colors.muted,
          marginTop: 4,
        }}
      >
        {value ||
          'Seleccionar archivo'}
      </Text>
    </TouchableOpacity>
  );
}

/* =========================================================
   HOME
========================================================= */

