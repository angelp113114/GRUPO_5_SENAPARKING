import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './featureStyles';
import { colors } from '../../theme';

export default function FileButtonView({
  name,
  label,
  onOpen,
}: {
  name?: string;
  label: string;
  onOpen: (
    n: string,
    l: string
  ) => void;
}) {
  if (!name) {
    return null;
  }

  const image =
    /\.(jpg|jpeg|png|gif|webp)$/i.test(
      String(name)
    );

  return (
    <TouchableOpacity
      onPress={() =>
        onOpen(
          name,
          label
        )
      }
      style={styles.fileCard}
    >
      <View style={styles.fileIcon}>
        <Text
          style={{
            fontSize: 20,
          }}
        >
          {image
            ? '🖼️'
            : '📄'}
        </Text>
      </View>

      <View
        style={{ flex: 1 }}
      >
        <Text
          style={styles.fileTitle}
          numberOfLines={2}
        >
          {label}
        </Text>

        <Text
          style={styles.fileSub}
          numberOfLines={1}
        >
          {String(name)
            .split('/')
            .pop()}
        </Text>
      </View>

      <Text
        style={{
          color: colors.primary,
          fontWeight: '900',
        }}
      >
        ABRIR
      </Text>
    </TouchableOpacity>
  );
}

/* =========================================================
   DOCUMENTOS ARRAY
========================================================= */

