/**
 * Flattens an object to properly-prefixed CSS variables, recursively, returned as an array of key-value pairs (e.g. `[['--pte-colors-primary', '#2ecc71']]`).
 *
 * You can use `Object.fromEntries()` to convert the result into an object.
 *
 * @param obj - The object to flatten.
 * @param prefix - The prefix to use for the CSS variables.
 */
export const objectToCSSVars = (obj: Record<string, any>, prefix: string = 'pte'): [string, string][] => Object.entries(obj).reduce((acc, [key, value]) => {
    // If the value is an object, flatten it recursively.
    if (typeof value === 'object' && value !== null) {
        return [...acc, ...objectToCSSVars(value, `${prefix}-${key}`)];
    }
    // Otherwise, return the key-value pair.
    return [...acc, [`--${prefix}-${key}`, `${value}`]];
}, [] as [string, string][]);
