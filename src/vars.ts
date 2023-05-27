import type { Theme } from './themes';

/**
 * Helper type to get the nested paths of a type.
 */
export type NestedPaths<T extends Record<string, any>> =
    { [K in keyof T & (string | number)]: T[K] extends (string | number)
        ? `${K}`
        : `${K}.${NestedPaths<T[K]>}`
    }[keyof T & (string | number)];

/**
 * Get the CSS property name for a {@link Theme} attribute.
 * @param path - The path to the attribute, e.g. `colors.backgroundPrimary`.
 * @param options - Options for the function.
 * @returns The CSS property name.
 * @example ```javascript
 * pvar('colors.backgroundPrimary') // 'var(--pte-colors-backgroundPrimary)'
 * pvar('colors.backgroundPrimary', { prefix: 'foo', raw: true }) // '--foo-colors-backgroundPrimary'
 * ```
 */
export const pvar = <T extends Record<string, any> = Theme>(path: NestedPaths<T>, options?: {
    /**
     * The prefix to use for the CSS variables.
     * @default 'pte'
     */
    prefix?: string,
    /**
     * Whether to return the raw CSS variable name; if true, the returned string won't include `var(xxx)`.
     * @default false
     */
    raw?: boolean,
}): string => {
    const varName = `--${options?.prefix || 'pte'}-${path.split('.').join('-')}`;
    return (options?.raw === true) ? varName : `var(${varName})`;
};

/**
 * Get the value of a CSS variable.
 *
 * @param path - The path to the attribute, e.g. `colors.backgroundPrimary`.
 * @param options - Options for the function.
 * @returns The value of the CSS variable.
 * @example ```javascript
 * pget('colors.backgroundPrimary') // '#ffffff'
 * ```
 */
export const pget = <T extends Record<string, any> = Theme>(path: NestedPaths<T>, options?: {
    /**
     * The prefix to use for the CSS variables.
     * @default 'pte'
     */
    prefix?: string,
    /**
     * The selector to use for the CSS variables.
     * @default 'body'
     */
    selector?: string,
}): string => {
    // Ensure `window` and `document` are defined.
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        throw new Error("In order to run `pget`, `window` and `document` must be defined. Make sure you're running this function in the browser.");
    }

    // Ensure the `document.body` is defined.
    if (typeof document.body === 'undefined') {
        throw new Error("In order to run `pget`, `document.body` must be defined. Make sure you're running this function in the browser.");
    }

    // If a selector is provided, ensure it exists.
    if (options?.selector && !document.querySelector(options?.selector)) {
        throw new Error(`In order to run \`pget\`, the selector \`${options?.selector}\` must exist in the DOM.`);
    }

    // Alias the `document.body` to the selector if it's not provided.
    const selectorEl = (options?.selector) ? document.querySelector(options?.selector) as Element : document.body;

    // Get the value of the CSS custom property.
    return window.getComputedStyle(selectorEl).getPropertyValue(
        pvar(path, {
            prefix: options?.prefix,
            raw: true,
        }),
    );
};
