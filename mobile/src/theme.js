import Constants from 'expo-constants';

/** Cores do app, usadas pelos estilos e pelos ícones. */
export const colors = {
  primary: '#E02041',
  title: '#13131A',
  label: '#41414D',
  text: '#737380',
  card: '#FFF',
};

/** Estilos repetidos nas duas telas (espalhe com `...commonStyles` no StyleSheet da página). */
export const commonStyles = {
  container: {
    flex: 1,
    paddingHorizontal: 24,
    // O app desenha por baixo da barra de status (no Android o edge-to-edge é obrigatório
    // desde o SDK 54), então o conteúdo precisa começar abaixo dela.
    paddingTop: Constants.statusBarHeight + 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  card: {
    padding: 24,
    borderRadius: 8,
    backgroundColor: colors.card,
    marginBottom: 16,
  },
};
