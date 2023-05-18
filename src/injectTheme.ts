import { objectToCSSVars } from './objectToCSSVars';

/**
 * Injects the theme values as CSS variables in the document head.
 * @param theme - The theme to set. Any missing values will be filled in with values from the {@link DefaultTheme}.
 */
export const injectTheme = async (theme: Record<string, any> = {}) => {
    // Ensure `window` and `document` are defined.
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        throw new Error("In order to run `setTheme`, `window` and `document` must be defined. Make sure you're running this function in the browser.");
    }

    // Ensure the `document.head` is defined.
    if (typeof document.head === 'undefined') {
        throw new Error("In order to run `setTheme`, `document.head` must be defined. Make sure you're running this function in the browser.");
    }

    // Create a new style element.
    const style = document.head.appendChild(document.createElement('style'));

    // Get the theme values as CSS variables.
    const cssVars = objectToCSSVars(theme)
        .map(([key, value]) => `${key}: ${value};`)
        .join('');

    // Set the style element's ID for future reference.
    style.id = 'paris-theme-vars';

    // Set the style element's inner HTML to the CSS variables.
    style.innerHTML = `:root { ${cssVars} }`;
};

/**
 * Returns a script that can be used to set the theme. This is useful when server-side rendering.
 *
 * @param theme - The theme to set. Any missing values will be filled in with values from the {@link DefaultTheme}.
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
export const generateThemeInjection = (theme: Record<string, any> = {}) => {
    // Get the theme values as CSS variables.
    const cssVars = objectToCSSVars(theme)
        .map(([key, value]) => `${key}: ${value};`)
        .join('');

    // Return the script to set the theme.
    return `var prdh=document.head.appendChild(document.createElement('style'));prdh.id='paris-theme-vars';prdh.innerHTML=':root { ${cssVars} }';`;
};
