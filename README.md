# pte

The Paris Theming Engine (`pte`) is a set of utilities that allow you to build a theming system for any JavaScript
applications using only CSS custom properties.

We built `pte` to power theming in [Paris](https://github.com/slingshot/paris), our new React design system, because we
couldn't find an existing way to build theming that was (1) dynamic, (2) type-safe, and (3) compatible with Server
Components.

## Highlights

✅ Works with any JavaScript framework (React, Vue, Svelte, etc.)  
✅ Works with any styling system or library (CSS Modules, Emotion, Tailwind, etc.)  
✅ Highly-performant (theme changes don't cause re-renders because it's all CSS)  
✅ Supports Server Components and SSR  
✅ Supports dynamic theming, even for server components  
✅ Allows type-safe theme updates

## Installation

```bash
pnpm install pte
# or
yarn add pte
# or
npm install pte
```

## Usage

### 1. Create a theme

The first step is to create a theme. A theme is a set of variables that define the look and feel of your application.

Using `pte`, you can create a theme using the `createTheme` function, which returns typed helpers for accessing the theme:

```ts
// pte.ts
import { createTheme } from 'pte';

export const {
    theme,
    pvar,
    pget,
    updateTheme,
} = createTheme({
    themeName: 'my-theme',
    colors: {
        primary: '#000',
        secondary: '#fff',
    },
});
```

### 2. Inject the theme into your app

This step varies depending on your framework, but in general you'll want to create a `<script>` component that injects
the theme into the DOM _before_ your app is rendered. The `generateThemeInjection` function outputs a plain-text
JavaScript function that can be injected into a script component, which in turn handles setting up the theme variables
in your application.

Here's an example for Next.js with the `app` directory:

```tsx
// app/layout.tsx
import { generateThemeInjection } from 'pte';
import { theme } from '../pte';
// ...
export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            <script
                id="set-pte-vars"
                type="text/javascript"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                    __html: generateThemeInjection(theme),
                }}
            />
        </head>
        <body>{children}</body>
        </html>
    );
};
```

Alternatively, you can invoke the `injectTheme` function directly on the client. This is useful if you're using a
framework that doesn't utilize server-side rendering.

For example, in a Storybook preview container:

```js
// client.js
import { injectTheme } from 'pte';
import { theme } from '../pte';

const preview: Preview = {
    docs: {
        container: (props) => {
            injectTheme(theme);
            return createElement(DocsContainer, props);
        }
    }
}
```

### 3. Use the theme in your app

There are two ways to use the theme in your app: with CSS custom properties, or with the `pvar` helper within JS/TS.

#### CSS custom properties

Each theme variable is exposed as a CSS custom property, which you can use in your stylesheets (including CSS Modules).
The custom property name is the same as the theme variable name, but prefixed with `--pte-` and with dots (`.`) replaced
with dashes (`-`).

For example, the `colors.primary` theme variable is exposed as `--pte-colors-primary`, which you can use in your
stylesheets like so:

```css
/* styles.module.css */
.h1 {
    color: var(--pte-colors-primary);
    letter-spacing: var(--pte-typography-h1-letterSpacing);
}
```

#### `pvar` helper

The `pvar` helper is a function that allows you to access theme variables in your JavaScript/TypeScript code. It's
useful for dynamic/inline styling, or for usage in CSS-in-JS libraries.

For example, with inline styles:

```tsx
// components/MyComponent.tsx
import { pvar } from '../pte';

export function MyComponent() {
    return (
        <div
            style={{
                // These path strings are type-safe, with IntelliSense autocompletion!
                
                color: pvar('colors.primary'),
                // returns 'var(--pte-colors-primary)'
                
                letterSpacing: pvar('typography.h1.letterSpacing'),
                // returns 'var(--pte-typography-h1-letterSpacing)'
            }}
        >
            Hello world!
        </div>
    );
}
```

Or with Emotion:

```tsx
// components/MyComponent.tsx
import { css } from '@emotion/react';
import { pvar } from '../pte';

export function MyComponent() {
    return (
        <div
            css={css`
                color: ${pvar('colors.primary')};
                letter-spacing: ${pvar('typography.h1.letterSpacing')};
            `}
        >
            Hello world!
        </div>
    );
}
```

### 4. Update the theme

The `updateTheme` function allows you to update the theme at runtime on the client side. It accepts a partial theme object, which overrides the existing theme.

Because the theme is stored in CSS custom properties, updating the theme doesn't cause any re-renders—the browser simply updates the variable values. This makes it far more performant than most other theming solutions, and also allows you to take advantage of CSS transitions when changing themes.

You can combine this with the `pget` helper, which allows you to access theme variables in your JavaScript/TypeScript code.

For example, in a React client component:

```tsx
// components/ThemeSwitcher.tsx
"use client";

import { updateTheme, lightTheme, darkTheme } from '../pte';

export function ThemeSwitcher() {
    return (
        <button
            onClick={() => {
                console.log(`The background color is currently ${pget('colors.backgroundPrimary')}`);                
                updateTheme(
                    pget('themeName') === 'light'
                        ? darkTheme
                        : lightTheme,
                );
            }}
        >
            Switch to dark mode
        </button>
    );
}
```
