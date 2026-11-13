import { registerRootComponent } from 'expo';
import App from './App';

// O widget só existe em Development Build (não funciona no Expo Go).
// O try/catch deixa o resto do app rodar mesmo sem o módulo nativo.
try {
  const { registerWidgetTaskHandler } = require('react-native-android-widget');
  const { widgetTaskHandler } = require('./src/widget/widgetTaskHandler');
  registerWidgetTaskHandler(widgetTaskHandler);
} catch (e) {
  console.log('Widgets indisponíveis neste ambiente.');
}

registerRootComponent(App);
