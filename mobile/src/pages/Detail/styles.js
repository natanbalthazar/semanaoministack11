import { StyleSheet } from 'react-native';

import { colors, commonStyles } from '../../theme';

export default StyleSheet.create({
  container: commonStyles.container,

  header: commonStyles.header,

  incident: {
    ...commonStyles.card,
    marginTop: 48,
  },

  incidentProperty: {
    fontSize: 14,
    color: colors.label,
    fontWeight: 'bold',
    marginTop: 24,
  },

  firstProperty: {
    marginTop: 0,
  },

  incidentValue: {
    marginTop: 8,
    fontSize: 15,
    color: colors.text,
  },

  contactBox: commonStyles.card,

  heroTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    color: colors.title,
    lineHeight: 30,
  },

  heroDescription: {
    fontSize: 15,
    color: colors.text,
    marginTop: 16,
  },

  actions: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  action: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    height: 50,
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
