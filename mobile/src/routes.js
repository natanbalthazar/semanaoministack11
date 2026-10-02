import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Incidents from './pages/Incidents';
import Detail from './pages/Detail';

// Navegação em pilha: navigate('Detail') empilha a tela de detalhes por cima da
// lista e goBack() a remove. A lista continua montada por baixo, então ao voltar
// os casos já carregados (e a posição da rolagem) estão lá, sem nova requisição.
// O "native" stack usa a navegação nativa de cada plataforma (react-native-screens).
const AppStack = createNativeStackNavigator();

export default function Routes() {
  return (
    // NavigationContainer guarda o estado da navegação: deve existir um só, na raiz do app.
    <NavigationContainer>
      {/* headerShown: false → cada tela desenha o próprio cabeçalho (logo + botões). */}
      <AppStack.Navigator screenOptions={{ headerShown: false }}>
        <AppStack.Screen name="Incidents" component={Incidents} />
        <AppStack.Screen name="Detail" component={Detail} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
