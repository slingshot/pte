export const Colors = {
    black: '#060606',
    white: '#ffffff',

    grey1050: '#121212',
    grey1000: '#171717',
    grey950: '#1f1f1f',
    grey900: '#252525',
    grey800: '#2e2e2e',
    grey750: '#3c3c3c',
    grey700: '#4a4a4a',
    grey600: '#545454',
    grey500: '#757575',
    grey400: '#afafaf',
    grey300: '#c9c9c9',
    grey200: '#e2e2e2',
    grey100: '#eeeeee',
    grey50: '#f6f6f6',
};

export type ColorsT = typeof Colors;

export type Tokens = {
    colors: ColorsT,
};

export const DefaultTokens: Tokens = {
    colors: Colors,
};
