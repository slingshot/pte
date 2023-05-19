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

If your theme is initially static (i.e. you'll start with the same default values each time and adjust them after the page loads), the best way to load the theme's variables statically through a `<style>` tag. We export a `generateCSS` function that outputs a string of CSS variables that you can inject into your app. **You must ensure the style tag has the id `pte-vars` for dynamic theming to work.**

Here's an example for Next.js with the `app` directory, where you can inject the theme into the `<head>` of your app from the server:

```tsx
// app/layout.tsx
import { generateCSS } from 'pte';
import { theme } from '../pte-init';
// ...
export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            <style
                // This is required for dynamic theming to work properly
                id="pte-vars"
                dangerouslySetInnerHTML={{
                    __html: generateCSS(theme),
                }}
            />
        </head>
        <body>{children}</body>
        </html>
    );
};
```

<details>
<summary>Alternative 1: Static injection script</summary>

You can also create a `<script>` component that injects
the theme into the DOM _before_ your app is rendered. The `generateThemeInjection` function outputs a plain-text
JavaScript function that can be injected into a script component, which in turn handles setting up the theme variables
in your application.

Here's an example for Next.js with the `app` directory:

```tsx
// app/layout.tsx
import { generateThemeInjection } from 'pte';
import { theme } from '../pte-init';
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
</details>

<details>
<summary>Alternative 2: Client-side injection</summary>

Alternatively, you can invoke the `injectTheme` function directly on the client. This is useful if you're using a framework that doesn't utilize server-side rendering, or if you need to dynamically change the initial theme based on something on the client.

In any situation with any kind of server-side build step, we recommend using one of the above methods instead as they're more performant and don't require the client to wait for the theme to load before rendering. You can perform theme updates right after the client loads.

For example, in a Storybook preview container:

```js
// client.js
import { injectTheme } from 'pte';
import { theme } from '../pte-init';

const preview: Preview = {
    docs: {
        container: (props) => {
            injectTheme(theme);
            return createElement(DocsContainer, props);
        }
    }
}
```
</details>

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
import { pvar } from '../pte-init';

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
import { pvar } from '../pte-init';

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

import { updateTheme, lightTheme, darkTheme } from '../pte-init';

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

#### Conditional styling in Server Components

With `pte`, you can also dispatch theme updates from the server side, and have the changes reflected in the client. This works by sending a simple `<script>` that looks for the `#pte-vars` style object and updates it with the new theme values.

For example, in a Next.js `app` directory server component:

```tsx
// app/page.tsx
import { generateThemeInjection } from '../pte-init';

export default async function Home() {
    // Fetch the user's theme preferences from the database on the server
    const { themeName } = await fetchUserPreferences();
    
    // Select a theme based on the user's preferences
    const theme = MyThemesList.find((t) => t.name === themeName);
    
    return (
        <main>
            <h1>Hello world!</h1>
            <script
                type="text/javascript"
                dangerouslySetInnerHTML={{
                    __html: generateThemeInjection(theme),
                }}
            />
        </main>
    );
}
```

#### Scoped updates and overrides

`pte` is entirely based on CSS custom properties, which can be overridden at any scope. We can use that to our advantage by sending updated custom properties through inline styles that can be scoped to specific parts of the application.

This can be especially useful if you have an application where you want to offer advanced customization for specific users or tenants on components related to their account (e.g. a profile page), while maintaining your application's core styling across the rest of the application.

For example, in a Next.js `app` directory server component:

```tsx
// app/page.tsx
import { overrideTheme, MyThemesList } from '../pte-init';

export default async function Home() {
    // Fetch the user's theme preferences from the database on the server
    const { theme } = await fetchUserPreferences();
    
    // Select a theme based on the user's preferences
    const selectedTheme = MyThemesList.find((t) => t.name === theme);
    
    return (
        <Container>
            <h1>This element inherits the application's default theme.</h1>
            <ProfileCard
                id="home-page-container"
                style={overrideTheme(selectedTheme)}
            >
                This card (and every element within it) is now styled with the user's theme!
            </ProfileCard>
        </Container>
    )
}
```

Then, on the client, you can use the `updateTheme` function anywhere to allow the user to update their theme within the client without needing to revalidate from the server.

You can also add the `selector` option for `pget` to access the theme variables in your client code specific to that scope (or any child element):

```tsx
// components/ThemeSwitcher.tsx
"use client";

import { updateTheme, pget } from '../pte-init';

export function ThemeSwitcher() {
    return (
        <button
            onClick={() => {
                console.log(`The background color is currently ${
                    // `pget` accepts options for the element selector
                    pget('colors.backgroundPrimary', {
                        selector: '#home-page-container',
                    })
                }`);
                
                updateTheme(
                    // `pget` uses `getComputedStyle` under the hood, so you can also read theme variables from any child element
                    pget('themeName', {
                        selector: '#any-child-of-container',
                    }) === 'light'
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

# Maintenance

`pte` uses [pnpm](https://pnpm.io/) for package management. To install dependencies, run:

```bash
pnpm install
```

Tests are coming soon; currently planned for the 1.0.0 release.

We use [changesets](https://github.com/changesets/changesets) to manage releases. When contributing new changes, please run:

```bash
pnpm changeset
```

The CLI will ask you to enter brief descriptions of your changes and specify whether your changes are a patch, minor, or major (for semver). Once you've finished, commit the changeset files. The Changesets GitHub Actions automatically open a pull request with all current changeset files. When the PR is merged, the changesets will automatically be added to [CHANGELOG.md](./CHANGELOG.md), a new release tag will be created, and a new version will be published to npm.
