import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { CATEGORIAS } from '../constants';

function Chip({ rotulo, ativo, onPress, destaque }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, ativo && styles.chipAtivo, destaque && styles.chipDestaque]}
    >
      <Text style={[styles.texto, (ativo || destaque) && styles.textoAtivo]}>{rotulo}</Text>
    </TouchableOpacity>
  );
}

export default function Filtros({ filtro, onChange, simulada, onSimular }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.linha}>
      <Chip rotulo="Todos" ativo={filtro === null} onPress={() => onChange(null)} />
      {Object.entries(CATEGORIAS).map(([chave, c]) => (
        <Chip
          key={chave}
          rotulo={`${c.emoji} ${c.rotulo}`}
          ativo={filtro === chave}
          onPress={() => onChange(filtro === chave ? null : chave)}
        />
      ))}
      <Chip
        rotulo={simulada ? '📡 Usar GPS real' : '🧪 Simular visita'}
        destaque={simulada}
        onPress={onSimular}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  linha: { paddingHorizontal: 12, gap: 8 },
  chip: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 3,
  },
  chipAtivo: { backgroundColor: '#1E293B' },
  chipDestaque: { backgroundColor: '#2563EB' },
  texto: { color: '#1E293B', fontWeight: '600' },
  textoAtivo: { color: '#fff' },
});
