import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CATEGORIAS } from '../constants';

export default function MarcadorPonto({ categoria, ativo }) {
  const cfg = CATEGORIAS[categoria];
  return (
    <View style={styles.area}>
      <View
        style={[
          styles.pino,
          { backgroundColor: cfg.cor },
          ativo && styles.pinoAtivo,
        ]}
      >
        <Text style={styles.emoji}>{cfg.emoji}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  area: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  pino: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinoAtivo: { width: 50, height: 50, borderRadius: 25, borderWidth: 4 },
  emoji: { fontSize: 18 },
});
