import { useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';

// Detecta "chacoalhada": força total (em g) acima do limite.
// Parado, a força é ~1g (gravidade).
export function useShake(aoChacoalhar, { limite = 1.7, intervaloMs = 1200 } = {}) {
  const callback = useRef(aoChacoalhar);
  callback.current = aoChacoalhar;

  useEffect(() => {
    let ultimo = 0;
    Accelerometer.setUpdateInterval(100);
    const assinatura = Accelerometer.addListener(({ x, y, z }) => {
      const forca = Math.sqrt(x * x + y * y + z * z);
      const agora = Date.now();
      if (forca > limite && agora - ultimo > intervaloMs) {
        ultimo = agora;
        callback.current();
      }
    });
    return () => assinatura.remove();
  }, [limite, intervaloMs]);
}
