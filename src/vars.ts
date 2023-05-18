import type { Theme } from './themes';

/**
 * Helper type to get the nested paths of a type.
 */
export type NestedPaths<T, D extends string = '.'> = T extends Record<string, any>
    ? {
        [K in keyof T]-?: T[K] extends Record<string, any>
            ? `${K & string}${D}${NestedPaths<T[K], D>}`
            : `${K & string}`;
    }[keyof T]
    : '';

/**
 * Get the CSS property name for a {@link Theme} attribute.
 * @param path - The path to the attribute, e.g. `colors.backgroundPrimary`.
 * @param prefix - The prefix to use for the CSS variables (default: `pte`).
 * @returns The CSS property name.
 * @example ```javascript
 * pvar('colors.backgroundPrimary') // '--pte-colors-backgroundPrimary'
 * pvar('colors.backgroundPrimary', 'foo') // '--foo-colors-backgroundPrimary'
 * ```
 */
export const pvar = <T extends Theme>(path: NestedPaths<T>, prefix: string = 'pte'): string => `var(--${prefix}-${path.split('.').join('-')})`;

/**
 * Get the value of a CSS variable.
 *
 * @param path - The path to the attribute, e.g. `colors.backgroundPrimary`.
 * @param prefix - The prefix to use for the CSS variables (default: `pte`).
 * @returns The value of the CSS variable.
 * @example ```javascript
 * pget('colors.backgroundPrimary') // '#ffffff'
 * ```
 */
export const pget = <T extends Theme>(path: NestedPaths<T>, prefix: string = 'pte'): string => {
    // Ensure `window` and `document` are defined.
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        throw new Error("In order to run `pget`, `window` and `document` must be defined. Make sure you're running this function in the browser.");
    }

    // Ensure the `document.body` is defined.
    if (typeof document.body === 'undefined') {
        throw new Error("In order to run `pget`, `document.head` must be defined. Make sure you're running this function in the browser.");
    }

    // Get the value of the CSS custom property.
    return window.getComputedStyle(document.body).getPropertyValue(pvar(path, prefix));
};
