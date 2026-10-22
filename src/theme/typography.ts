// src/theme/typography.ts
import { fonts } from './fonts';

export const typography = {
  headline1: { fontFamily: fonts.bold, fontSize: 32, lineHeight: 40 },
  headline2: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 34 },
  headline3: { fontFamily: fonts.semiBold, fontSize: 22, lineHeight: 30 },
  subtitle: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 24 },
  body1: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  body2: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 20 },
  label: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16 },
  button: { fontFamily: fonts.semiBold, fontSize: 16, lineHeight: 22 },
};
