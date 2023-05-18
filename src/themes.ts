import { DefaultTokens } from './tokens';

// TODO: Generate default themes with recommended properties/structure/tokens.

export type Theme = Record<string, any>;

export const LightTheme: Theme = {
    tokens: DefaultTokens,
    colors: {
        primary: '#000000',
        backgroundPrimary: '#ffffff',
    },
};
export const DefaultTheme: Theme = LightTheme;
