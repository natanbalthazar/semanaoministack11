import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent registra o App como componente raiz (equivale ao
// AppRegistry.registerComponent('main', () => App)) e garante que o ambiente
// esteja configurado tanto no Expo Go quanto em um build nativo.
registerRootComponent(App);
