import { writeFile } from 'fs/promises';
import { generateCSS } from './generateCSS';
import type { Theme } from './themes';

/**
 * Export a {@link Theme} to a static CSS file.
 * @param theme - The theme to export.
 * @param output - The path to the output file (e.g. `public/theme.css`).
 * @param selector - The selector to use for the CSS variables (default: `:root`).
 */
export const exportCSS = async (
    theme: Theme,
    output: string = './public/pte.css',
    selector: string = ':root',
): Promise<void> => {
    const css = generateCSS(theme, selector);
    await writeFile(output, css);
};
