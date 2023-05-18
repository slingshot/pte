import type { Theme } from './themes';
import { pget, pvar } from './vars';
import { updateTheme } from './updateTheme';

/**
 * Create a theme object. Returns the theme itself, as well as typed helper functions for getting and setting CSS variables.
 * @param theme - The theme object.
 */
export const createTheme = <T extends Theme>(theme: T) => ({
    theme,
    pvar: pvar<T>,
    pget: pget<T>,
    updateTheme: updateTheme<T>,
});
