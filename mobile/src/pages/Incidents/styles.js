import { StyleSheet } from 'react-native';

import { colors, commonStyles } from '../../theme';

export default StyleSheet.create({
  container: commonStyles.container,

  header: commonStyles.header,

  headerText: {
    fontSize: 15,
    color: colors.text,
  },

  headerTextBold: {
    fontWeight: 'bold',
  },

  title: {
    fontSize: 30,
    marginBottom: 16,
    marginTop: 48,
    color: colors.title,
    fontWeight: 'bold',
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },

  incidentList: {
    marginTop: 32,
  },

  incident: commonStyles.card,

  incidentProperty: {
    fontSize: 14,
    color: colors.label,
    fontWeight: 'bold',
  },

  incidentValue: {
    marginTop: 8,
    fontSize: 15,
    marginBottom: 24,
    color: colors.text,
  },

  detailsButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  detailsButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },

  errorText: {
    marginTop: 16,
    fontSize: 15,
    color: colors.primary,
    textAlign: 'center',
  },
});
