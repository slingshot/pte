import { objectToCSSVars } from './objectToCSSVars';
import type { Theme } from './themes';

/**
 * Injects the theme values as CSS variables in the document head.
 * @param theme - The theme to set.
 */
export const injectTheme = <T = Theme>(theme: T) => {
    // Ensure `window` and `document` are defined.
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        throw new Error("In order to run `injectTheme`, `window` and `document` must be defined. Make sure you're running this function in the browser.");
    }

    // Ensure the `document.head` is defined.
    if (typeof document.head === 'undefined') {
        throw new Error("In order to run `injectTheme`, `document.head` must be defined. Make sure you're running this function in the browser.");
    }

    // Find the existing style element, or create a new one if none exists.
    const style = document.getElementById('pte-vars') || document.head.appendChild(document.createElement('style'));

    if (!(style instanceof HTMLStyleElement)) {
        throw new Error('`injectTheme` failed because the element with ID `#pte-vars` is not an instance of `HTMLStyleElement`.');
    }

    // Get the theme values as CSS variables.
    const cssVars = objectToCSSVars(theme as Record<string, any>)
        .map(([key, value]) => `${key}: ${value};`)
        .join('');

    // Set the style element's ID for future reference.
    style.id = 'pte-vars';

    // Set the style element's inner HTML to the CSS variables.
    style.innerHTML = `:root { ${cssVars} }`;
};

/**
 * Returns a script that can be used to set the theme. This is useful when server-side rendering.
 *
 * @param theme - The theme to set.
 * @returns A script that can be used to set the theme.
 * @example ```jsx
 * <script
 *     id="setParisThemeVars"
 *     type="text/javascript"
 *     // eslint-disable-next-line react/no-danger
 *     dangerouslySetInnerHTML={{
 *         __html: generateThemeInjection(),
 *     }}
 * />
 * ```
 */
export const generateThemeInjection = <T = Theme>(theme: T) => {
    // Get the theme values as CSS variables.
    const cssVars = objectToCSSVars(theme as Record<string, any>)
        .map(([key, value]) => `${key}:${value};`)
        .join('');

    // Return the script to set the theme.
    return `var pteEl=document.getElementById('pte-vars')||document.head.appendChild(document.createElement('style'));pteEl.id='pte-vars';pteEl.innerHTML=':root { ${cssVars} }';`;
};
