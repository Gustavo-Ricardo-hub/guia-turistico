import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MonumentoWidget } from './MonumentoWidget';

export const CHAVE_WIDGET = '@guia:monumentoProximo';

export async function widgetTaskHandler(props) {
  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      let dados = {};
      try {
        const json = await AsyncStorage.getItem(CHAVE_WIDGET);
        if (json) dados = JSON.parse(json);
      } catch (e) {}
      props.renderWidget(<MonumentoWidget {...dados} />);
      break;
    }
    default:
      break;
  }
}
