import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const CANAL = 'pontos-turisticos';

export async function configurarNotificacoes() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CANAL, {
      name: 'Pontos turísticos',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;
  const pedido = await Notifications.requestPermissionsAsync();
  return pedido.status === 'granted';
}

export async function notificarCuriosidade(ponto) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `📍 Você está perto: ${ponto.nome}`,
      body: ponto.curiosidade,
      data: { pontoId: ponto.id },
    },
    trigger: Platform.OS === 'android' ? { channelId: CANAL } : null,
  });
}
