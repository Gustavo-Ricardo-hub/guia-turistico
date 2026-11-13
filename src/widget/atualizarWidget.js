import React from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CATEGORIAS } from '../constants';

// Mesma chave usada em widgetTaskHandler.js
// (duplicada aqui para não importar o módulo do widget no Expo Go)
const CHAVE_WIDGET = '@guia:monumentoProximo';

// Salva o ponto mais próximo e pede para o Android redesenhar o widget.
export async function atualizarWidget(ponto, distanciaTexto) {
  if (Platform.OS !== 'android') return;

  const dados = {
    nome: ponto.nome,
    categoria: CATEGORIAS[ponto.categoria].rotulo,
    distancia: distanciaTexto,
    foto: ponto.foto,
  };

  try {
    await AsyncStorage.setItem(CHAVE_WIDGET, JSON.stringify(dados));
    const { requestWidgetUpdate } = require('react-native-android-widget');
    const { MonumentoWidget } = require('./MonumentoWidget');
    await requestWidgetUpdate({
      widgetName: 'MonumentoProximo',
      renderWidget: () => <MonumentoWidget {...dados} />,
      widgetNotFound: () => {},
    });
  } catch (e) {
    // Expo Go ou widget ainda não adicionado: ignora
  }
}
