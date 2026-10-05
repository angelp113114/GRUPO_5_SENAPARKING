import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#4CAF50',
  dark: '#2E7D32',
  light: '#E8F5E9',
  bg: '#F6F8F6',
  text: '#263238',
  muted: '#6B7280',
  danger: '#C62828',
  white: '#FFFFFF',
  border: '#DDE5DE',
};

export const common = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    color: colors.dark,
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.dark,
    marginBottom: 10,
    marginTop: 8,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 7,
    marginTop: 10,
  },

  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    color: colors.text,
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 11,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  buttonText: {
    color: colors.white,
    fontWeight: '800',
  },

  outline: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 11,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  outlineText: {
    color: colors.dark,
    fontWeight: '800',
  },

  error: {
    backgroundColor: '#FFEBEE',
    color: colors.danger,
    padding: 10,
    borderRadius: 9,
    marginVertical: 10,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});