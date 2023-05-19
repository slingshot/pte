import { pget, pvar } from './vars';
import { updateTheme } from './updateTheme';
import { generateThemeInjection, injectTheme } from './injectTheme';

/**
 * Create a theme object. Returns the theme itself, as well as typed helper functions for getting and setting CSS variables.
 * @param theme - The theme object.
 */
export const createTheme = <T>(theme: T) => ({
    theme,
    pvar: pvar<T>,
    pget: pget<T>,
    updateTheme: updateTheme<T>,
    injectTheme: injectTheme<T>,
    generateThemeInjection: generateThemeInjection<T>,
});
