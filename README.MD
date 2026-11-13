# Guia Turístico e Histórico – PAM II

App em React Native (Expo) que destaca pontos turísticos de São Paulo conforme a
localização do usuário e mostra curiosidades históricas.

**Equipe:** Arthur Gonçalves, Arthur Oliveira, Gustavo Henrique, Maria Eduarda Coelho

## Recursos
- **Mapas e localização:** react-native-maps + expo-location, com marcadores por categoria
  (museu, parque, monumento) e círculo de raio de cada ponto.
- **Notificações:** expo-notifications dispara uma curiosidade histórica ao entrar no raio
  de um ponto (distância pela fórmula de Haversine).
- **Sensor:** acelerômetro (expo-sensors) – "Agite para um Ponto Aleatório".
- **Widget:** react-native-android-widget mostra o monumento mais próximo
  (requer development build; não roda no Expo Go).
- **Dados:** pontos em `src/data/pontos.json`, sem banco externo.

## Como rodar
1. `npm install`
2. `npx expo start` e escanear o QR code com o app Expo Go.

## Modo de teste
O botão "Simular visita" coloca o usuário perto de um ponto para testar a notificação.
