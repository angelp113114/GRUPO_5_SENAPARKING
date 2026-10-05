import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../theme';
import { pretty } from './featureUtils';

export default function CompareData({
  title,
  data,
}: any) {
  const d = data || {};

  return (
    <View
      style={{
        marginTop: 10,
        padding: 12,
        borderRadius: 12,
        backgroundColor:
          colors.bg,
      }}
    >
      <Text
        style={{
          fontWeight: '900',
          color: colors.dark,
          marginBottom: 5,
        }}
      >
        {title}
      </Text>

      {Object.entries(d)
        .length ? (
        Object.entries(d).map(
          ([k, v]) => (
            <Text
              key={k}
              style={{
                marginVertical: 2,
              }}
            >
              {pretty(k)}:{' '}
              {String(
                v ?? '—'
              )}
            </Text>
          )
        )
      ) : (
        <Text>
          Sin datos registrados
        </Text>
      )}
    </View>
  );
}

