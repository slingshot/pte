import { objectToCSSVars } from './objectToCSSVars';
import type { Theme } from './themes';

export const updateTheme = <T = Theme>(updatedValues: Partial<T>) => {
    // Ensure `window` and `document` are defined.
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        throw new Error("In order to run `updateTheme`, `window` and `document` must be defined. Make sure you're running this function in the browser.");
    }

    // Ensure the `document.body` is defined.
    if (typeof document.body === 'undefined') {
        throw new Error("In order to run `updateTheme`, `document.head` must be defined. Make sure you're running this function in the browser.");
    }

    // Set the provided values as CSS custom properties on the `:root` element.
    objectToCSSVars(updatedValues).forEach(([key, value]) => {
        document.body.style.setProperty(key, value);
    });
};
