import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../theme';
import styles from './featureStyles';
import { menus } from './featureConfig';

export default function RoleDrawer({
  visible,
  onClose,
  user,
  navigation,
}: {
  visible: boolean;
  onClose: () => void;
  user: any;
  navigation: any;
}) {
  const list =
    menus[user?.rol || 'aprendiz'] || menus.aprendiz;

  const go = (k: string, t: string) => {
    onClose();

    if (k === 'home') {
      navigation.navigate('Dashboard');
    } else if (k === 'carnet') {
      navigation.navigate('Carnet');
    } else if (k === 'scanner') {
      navigation.navigate('Scanner');
    } else {
      navigation.navigate('Feature', {
        key: k,
        title: t,
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,.35)',
        }}
      >
        <View
          style={{
            width: '86%',
            height: '100%',
            backgroundColor: '#fff',
            paddingTop: 48,
            paddingHorizontal: 18,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 18,
            }}
          >
            <View style={styles.logo}>
              <Text style={{ fontSize: 22 }}>🅿️</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.brand}>
                SENA PARKING
              </Text>

              <Text style={styles.role}>
                {user?.rol || ''}
              </Text>
            </View>

            <TouchableOpacity onPress={onClose}>
              <Text style={{ fontSize: 28 }}>
                ×
              </Text>
            </TouchableOpacity>
          </View>

          {list.map((m: any) => (
            <TouchableOpacity
              key={m[0]}
              onPress={() => go(m[0], m[1])}
              style={styles.menuItem}
            >
              <Text style={styles.menuIcon}>
                {m[2]}
              </Text>

              <Text style={styles.menuText}>
                {m[1]}
              </Text>

              <Text
                style={{
                  color: colors.muted,
                  fontSize: 20,
                }}
              >
                ›
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

/* =========================================================
   FEATURE SCREEN
========================================================= */

