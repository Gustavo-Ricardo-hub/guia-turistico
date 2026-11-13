import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CATEGORIAS } from '../constants';
import { formatarDistancia } from '../utils/geo';

export default function PontoCard({ ponto, distancia }) {
  if (!ponto) {
    return (
      <View style={styles.card}>
        <Text style={styles.dica}>
          Toque em um marcador ou agite o celular 📳 para descobrir um ponto surpresa.
        </Text>
      </View>
    );
  }
  const cfg = CATEGORIAS[ponto.categoria];
  return (
    <View style={styles.card}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: ponto.foto }} style={styles.foto} />
        <View style={styles.cabecalho}>
          <Text style={styles.nome}>{ponto.nome}</Text>
          <View style={[styles.tag, { backgroundColor: cfg.cor }]}>
            <Text style={styles.tagTexto}>{cfg.emoji} {cfg.rotulo}</Text>
          </View>
        </View>
        {distancia != null && (
          <Text style={styles.distancia}>📍 a {formatarDistancia(distancia)} de você</Text>
        )}
        <Text style={styles.descricao}>{ponto.descricao}</Text>
        <View style={styles.curiosidade}>
          <Text style={styles.curiosidadeTitulo}>💡 Curiosidade</Text>
          <Text style={styles.curiosidadeTexto}>{ponto.curiosidade}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 16,
    maxHeight: '48%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    elevation: 8,
  },
  dica: { textAlign: 'center', color: '#475569', fontSize: 14 },
  foto: { width: '100%', height: 130, borderRadius: 14, backgroundColor: '#E2E8F0' },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 8,
  },
  nome: { flex: 1, fontSize: 19, fontWeight: '700', color: '#0F172A' },
  tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  tagTexto: { color: '#fff', fontSize: 12, fontWeight: '600' },
  distancia: { marginTop: 4, color: '#2563EB', fontWeight: '600' },
  descricao: { marginTop: 8, color: '#334155', lineHeight: 20 },
  curiosidade: { marginTop: 10, backgroundColor: '#FEF3C7', borderRadius: 12, padding: 10 },
  curiosidadeTitulo: { fontWeight: '700', color: '#92400E', marginBottom: 2 },
  curiosidadeTexto: { color: '#78350F', lineHeight: 19 },
});
