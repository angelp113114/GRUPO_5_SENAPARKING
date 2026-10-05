import { colors } from '../../theme';

const styles: any = {
  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor:
      colors.light,
    alignItems: 'center',
    justifyContent:
      'center',
    marginRight: 10,
  },

  brand: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.dark,
  },

  role: {
    fontSize: 12,
    color: colors.muted,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor:
      '#eef2ee',
  },

  menuIcon: {
    width: 34,
    fontSize: 21,
  },

  menuText: {
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.dark,
  },

  boldLine: {
    marginTop: 7,
    fontWeight: '800',
  },

  subhead: {
    fontWeight: '900',
    marginTop: 16,
    color: colors.dark,
  },

  date: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 6,
  },

  status: {
    marginTop: 8,
    fontWeight: '900',
    color: colors.dark,
  },

  answer: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor:
      colors.light,
    borderLeftWidth: 4,
    borderLeftColor:
      colors.primary,
  },

  answerTitle: {
    fontWeight: '900',
    color: colors.dark,
    marginBottom: 5,
  },

  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    marginTop: 9,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 12,
    backgroundColor: '#fff',
  },

  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor:
      colors.light,
    alignItems: 'center',
    justifyContent:
      'center',
  },

  fileTitle: {
    fontWeight: '800',
    color: colors.dark,
  },

  fileSub: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },

  filePicker: {
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
    backgroundColor: '#fff',
  },

  hero: {
    backgroundColor:
      colors.dark,
    borderRadius: 20,
    padding: 22,
    marginBottom: 14,
  },

  heroSmall: {
    color: '#DDF5E0',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },

  heroTitle: {
    color: '#fff',
    fontSize: 27,
    fontWeight: '900',
    marginTop: 7,
  },

  heroText: {
    color: '#EAF7EC',
    lineHeight: 22,
    marginTop: 9,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.dark,
  },

  infoRow: {
    marginTop: 9,
    lineHeight: 21,
    color: colors.text,
  },

  manualIntro: {
    marginBottom: 8,
  },

  manualCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12,
  },

  num: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor:
      colors.primary,
    alignItems: 'center',
    justifyContent:
      'center',
  },

  report: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor:
      colors.bg,
  },

  reportTitle: {
    fontWeight: '900',
    color: colors.dark,
    marginBottom: 8,
  },
};

export default styles;
