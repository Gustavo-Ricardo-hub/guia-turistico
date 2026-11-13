import { useEffect, useRef } from 'react';
import { haversine } from '../utils/geo';
import { notificarCuriosidade } from '../services/notificacoes';

// Dispara 1 notificação ao entrar no raio de um ponto.
// Só dispara de novo depois que o usuário sair (raio * 1.5).
export function useProximidade(posicao, pontos, habilitado, aoEntrar) {
  const jaNotificados = useRef(new Set());
  const callback = useRef(aoEntrar);
  callback.current = aoEntrar;

  useEffect(() => {
    if (!posicao) return;
    pontos.forEach((p) => {
      const d = haversine(posicao, p);
      if (d <= p.raio && !jaNotificados.current.has(p.id)) {
        jaNotificados.current.add(p.id);
        if (habilitado) notificarCuriosidade(p).catch(() => {});
        callback.current && callback.current(p);
      } else if (d > p.raio * 1.5) {
        jaNotificados.current.delete(p.id);
      }
    });
  }, [posicao, pontos, habilitado]);
}
