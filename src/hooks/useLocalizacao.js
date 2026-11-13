import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';

const paraCoord = (loc) => ({
  latitude: loc.coords.latitude,
  longitude: loc.coords.longitude,
});

export function useLocalizacao() {
  const [posicao, setPosicao] = useState(null);
  const [permissao, setPermissao] = useState('pendente');
  const [simulada, setSimulada] = useState(false);
  const simuladaRef = useRef(false);

  useEffect(() => {
    let ativo = true;
    let assinatura = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!ativo) return;
      if (status !== 'granted') {
        setPermissao('negada');
        return;
      }
      setPermissao('concedida');

      try {
        const atual = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (ativo && !simuladaRef.current) setPosicao(paraCoord(atual));
      } catch (e) {}

      assinatura = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 10, timeInterval: 5000 },
        (loc) => {
          if (!simuladaRef.current) setPosicao(paraCoord(loc));
        }
      );
      if (!ativo) assinatura.remove();
    })();

    return () => {
      ativo = false;
      if (assinatura) assinatura.remove();
    };
  }, []);

  // Modo de teste: finge que o usuário está em outro lugar
  const simular = useCallback((coord) => {
    simuladaRef.current = true;
    setSimulada(true);
    setPosicao(coord);
  }, []);

  const usarGps = useCallback(async () => {
    simuladaRef.current = false;
    setSimulada(false);
    try {
      const atual = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setPosicao(paraCoord(atual));
    } catch (e) {}
  }, []);

  return { posicao, permissao, simulada, simular, usarGps };
}
