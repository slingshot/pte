#!/usr/bin/env npx -y ts-node --esm

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { exportCSS } from './exportCSS';

const run = yargs(hideBin(process.argv))
    .alias('h', 'help')
    .help('help', 'Show this help message')
    .alias('v', 'version')
    .version()
    .command(
        'export <theme> [namedExport]',
        'Export a theme to a CSS file',
        (args) => args
            .positional('theme', {
                describe: 'The path to the theme file',
                type: 'string',
                demandOption: true,
            })
            .positional('namedExport', {
                describe: 'The named export to use (default: `default`)',
                type: 'string',
            })
            .option('selector', {
                alias: 's',
                describe: 'The selector to use for the CSS variables (default: `:root`)',
                type: 'string',
                default: ':root',
            })
            .option('output', {
                alias: 'o',
                describe: 'The path to the output file (e.g. `public/pte.css`)',
                type: 'string',
                default: './public/pte.css',
            }),
        async (args) => {
            const start = Date.now();
            const {
                selector, output, theme: themeArg, namedExport,
            } = args;

            // Try to import the theme file
            let themeFile: any;
            try {
                themeFile = await import(`${process.cwd()}/${themeArg.replace('./', '')}`);
            } catch (e) {
                console.error(`❌  Failed to import theme from "${themeArg}". Make sure you're using a relative path from your current working directory.`);
                process.exit(1);
            }

            // Make sure the theme file exists and has the named export
            if (!themeFile || !themeFile[namedExport || 'default']) {
                console.error(`❌  Failed to find named export "${namedExport || 'default'}" in "${themeArg}". Make sure you're either exporting the theme object as default, or passing the correct named export after the filename.`);
                process.exit(1);
            }

            // Export the theme
            const theme = themeFile[namedExport || 'default'];
            await exportCSS(theme, output, selector);

            // Print success message and exit
            console.log(`✅  Exported theme to "${output}" in ${Date.now() - start}ms`);
            process.exit(0);
        },
    )
    .wrap(100)
    .demandCommand()
    .scriptName('pte')
    .argv;
