import React from 'react';
import { Text, View } from 'react-native';
import Button from '../Button';
import { common } from '../../theme';
import styles from './featureStyles';

export default function Pagination({
  page,
  total,
  pageSize,
  setPage,
}: any) {
  const pages = Math.max(
    1,
    Math.ceil(
      total / pageSize
    )
  );

  return (
    <View
      style={[
        common.card,
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent:
            'space-between',
        },
      ]}
    >
      <Button
        title="‹"
        outline
        onPress={() =>
          setPage(
            Math.max(
              1,
              page - 1
            )
          )
        }
      />

      <Text
        style={{
          fontWeight: '900',
        }}
      >
        Página {page} de {pages}
      </Text>

      <Button
        title="›"
        outline
        onPress={() =>
          setPage(
            Math.min(
              pages,
              page + 1
            )
          )
        }
      />
    </View>
  );
}

/* =========================================================
   FOTO
========================================================= */

