import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StatusBar, StyleSheet, Text, Vibration, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';

import pontos from './src/data/pontos.json';
import { CATEGORIAS, REGIAO_INICIAL } from './src/constants';
import { formatarDistancia, haversine } from './src/utils/geo';
import { useLocalizacao } from './src/hooks/useLocalizacao';
import { useProximidade } from './src/hooks/useProximidade';
import { useShake } from './src/hooks/useShake';
import { configurarNotificacoes } from './src/services/notificacoes';
import { atualizarWidget } from './src/widget/atualizarWidget';
import Filtros from './src/components/Filtros';
import MarcadorPonto from './src/components/MarcadorPonto';
import PontoCard from './src/components/PontoCard';

export default function App() {
  const mapRef = useRef(null);
  const { posicao, permissao, simulada, simular, usarGps } = useLocalizacao();
  const [notifOk, setNotifOk] = useState(false);
  const [filtro, setFiltro] = useState(null);
  const [selecionadoId, setSelecionadoId] = useState(null);
  const [aviso, setAviso] = useState(null);

  useEffect(() => {
    configurarNotificacoes().then(setNotifOk).catch(() => setNotifOk(false));
  }, []);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 3500);
    return () => clearTimeout(t);
  }, [aviso]);

  const pontosVisiveis = useMemo(
    () => (filtro ? pontos.filter((p) => p.categoria === filtro) : pontos),
    [filtro]
  );

  const distancias = useMemo(() => {
    const m = {};
    if (posicao) pontos.forEach((p) => (m[p.id] = haversine(posicao, p)));
    return m;
  }, [posicao]);

  const maisProximo = useMemo(() => {
    if (!posicao) return null;
    return pontos.reduce((a, p) => (distancias[p.id] < distancias[a.id] ? p : a));
  }, [posicao, distancias]);

  const selecionado = pontos.find((p) => p.id === selecionadoId) || null;

  const focar = useCallback((p) => {
    mapRef.current?.animateToRegion(
      {
        latitude: p.latitude - 0.0015, // desloca um pouco p/ o marcador ficar acima do card
        longitude: p.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      800
    );
  }, []);

  // Notificação local ao entrar no raio de um ponto
  useProximidade(posicao, pontos, notifOk, (p) => {
    setSelecionadoId(p.id);
    focar(p);
    setAviso(`📍 Você chegou em: ${p.nome}`);
  });

  // Atualiza o widget com o monumento mais próximo (no máximo a cada 20 s)
  const ultimoWidget = useRef({ id: null, t: 0 });
  useEffect(() => {
    if (!maisProximo) return;
    const agora = Date.now();
    const u = ultimoWidget.current;
    if (u.id === maisProximo.id && agora - u.t < 20000) return;
    ultimoWidget.current = { id: maisProximo.id, t: agora };
    atualizarWidget(maisProximo, formatarDistancia(distancias[maisProximo.id]));
  }, [maisProximo, distancias]);

  // Agite para um ponto aleatório
  const sortear = useCallback(() => {
    const candidatos = pontosVisiveis.filter((p) => p.id !== selecionadoId);
    if (!candidatos.length) return;
    const p = candidatos[Math.floor(Math.random() * candidatos.length)];
    Vibration.vibrate(200);
    setSelecionadoId(p.id);
    focar(p);
    setAviso(`🎲 Ponto surpresa: ${p.nome}`);
  }, [pontosVisiveis, selecionadoId, focar]);
  useShake(sortear);

  // Modo teste: coloca você ~60 m de um ponto aleatório
  const alternarSimulacao = () => {
    if (simulada) {
      usarGps();
      setAviso('Voltando ao GPS real');
      return;
    }
    const alvo = pontos[Math.floor(Math.random() * pontos.length)];
    simular({ latitude: alvo.latitude + 0.0004, longitude: alvo.longitude + 0.0004 });
    focar(alvo);
  };

  return (
    <View style={styles.tela}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={REGIAO_INICIAL}
        showsUserLocation={!simulada}
        showsMyLocationButton={false}
        toolbarEnabled={false}
        onPress={() => setSelecionadoId(null)}
      >
        {pontosVisiveis.map((p) => {
          const cor = CATEGORIAS[p.categoria].cor;
          const ativo = p.id === selecionadoId;
          return (
            <React.Fragment key={p.id}>
              <Circle
                center={{ latitude: p.latitude, longitude: p.longitude }}
                radius={p.raio}
                strokeColor={cor + (ativo ? 'FF' : '88')}
                fillColor={cor + (ativo ? '44' : '1A')}
                strokeWidth={ativo ? 2 : 1}
              />
              <Marker
                coordinate={{ latitude: p.latitude, longitude: p.longitude }}
                onPress={() => {
                  setSelecionadoId(p.id);
                  focar(p);
                }}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <MarcadorPonto categoria={p.categoria} ativo={ativo} />
              </Marker>
            </React.Fragment>
          );
        })}

        {simulada && posicao && (
          <Marker coordinate={posicao} title="Você (simulado)" pinColor="#2563EB" />
        )}
      </MapView>

      <View style={styles.topo} pointerEvents="box-none">
        <Filtros
          filtro={filtro}
          onChange={setFiltro}
          simulada={simulada}
          onSimular={alternarSimulacao}
        />
        {permissao === 'negada' && (
          <Text style={styles.alerta}>
            Permissão de localização negada. Ative nas configurações do Android.
          </Text>
        )}
        {aviso && <Text style={styles.aviso}>{aviso}</Text>}
      </View>

      <PontoCard
        ponto={selecionado}
        distancia={selecionado ? distancias[selecionado.id] : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#E2E8F0' },
  topo: { position: 'absolute', top: (StatusBar.currentHeight || 40) + 8, left: 0, right: 0, gap: 8 },
  aviso: {
    alignSelf: 'center',
    backgroundColor: '#0F172A',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
    fontWeight: '600',
  },
  alerta: {
    alignSelf: 'center',
    backgroundColor: '#DC2626',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
});
