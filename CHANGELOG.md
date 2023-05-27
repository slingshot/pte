# pte

## 0.4.8

### Patch Changes

- b8fd07b: Improved `NestedPaths` type reliability
- 3ebaea8: Add typed `generateCSS` export from `createTheme`

## 0.4.7

### Patch Changes

- e32086b: CLI: improve error messages

## 0.4.6

### Patch Changes

- 0fb8c44: Remove package type and revert `tsconfig` to specify different `compilerOptions` for ts-node
- 01b9997: Remove dependency for recommended tsconfig, inline instead

## 0.4.4

### Patch Changes

- 229ac5e: Include `tsconfig` in NPM package so CLI works

## 0.4.3

### Patch Changes

- fb58e8e: Add `--esm` flag to use ESM loader for ts-node in CLI

## 0.4.2

### Patch Changes

- 688e60e: Set package type to `module` and update `tsconfig` for ts-node to integrate that update

## 0.4.1

### Patch Changes

- 5109ef4: CLI: Use `ts-node` directly instead of via `npx`

## 0.4.0

### Minor Changes

- dbf6dbb: Add CLI for generating static CSS files from a theme file

## 0.3.0

### Minor Changes

- 53554de: Make options optional for `pget`/`pvar`
- 46da627: Fix `pget` usage of `pvar` (requires `raw` mode)

### Patch Changes

- a42270b: Custom commit message in publish action
- 4776189: Add maintenance documentation to `README`

## 0.2.1

### Patch Changes

- 59e6648: Add description/keywords/repo to package file
- 8d26943: Remove `react` optional dep

## 0.2.0

### Minor Changes

- Adjust API implementations slightly, most notably recommending a `<style>` tag for initial injection with `generateCSS()` instead of `<script>` based initial injection.
