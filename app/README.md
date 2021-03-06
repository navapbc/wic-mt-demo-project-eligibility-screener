This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). This README has been modified from the auto-generated one.

## Getting Started

First, install dependencies:

```bash
yarn
```

Second, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

A starter [API route](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Local Linter and Typechecker Setup

### Setting up up linting and typechecking for local development

For linting, this application is leveraging `eslint`, `prettier` and Nava's [eslint-config-nava](https://github.com/navapbc/eslint-config-nava). Although, these will be run on CI and prior to commit, it is still recommended that we tell our code editor to auto-fix eslint and prettier errors on save.

In VSCode, do so by creating a `.vscode/settings.json` file with:

```
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

For typechecking, this application is leveraging Next.js' [incremental typechecking](https://nextjs.org/docs/basic-features/typescript#incremental-type-checking). NextJS will run type checking as a part of `next build`-- Although it is still recommended that we set up type checking using our code editor for development. In VSCode, do so by adding the following to your `.vscode/settings.json` file

```
"typescript.validate.enable": true
```

Note: make sure TypeScript and Javascript Language Features are enabled in VS Code Extensions.

### Eslint rules explained

- "@typescript-eslint/no-unused-vars": "error"
  - Disallows unused variables-- prevents dead code accumulation.
- "@typescript-eslint/no-explicit-any": "error"
  - Disallows usage of `any` type. The usage of `any` defeats the purpose of typescript. Consider using `unknown` type instead instead.
- "react/resct-in-jsx-scope": "off"
  - suppress errors for missing 'import React' in files because NextJS does this for us.

### Tsconfig additions to auto-generated file

- `target: es6` -- nextJS set this valule to `es5` by default.
- `allowJS: true` -- allows ts checks on javascript files.
- `checkJS: true` -- works in tandem with `allowJS`. Alternative to adding `// @ts-check` at top of Js files-- instructs ts to check all js files.
- `jsx: react-jsx` -- [Documentation on this option](https://www.typescriptlang.org/docs/handbook/jsx.html). This value updates the JSX mode that TS whips with. Updating this from "preserve" helped get jest tests into a passing state. TODO: figure out why.
- `incremental: true` -- enables incremental typechecking. Incremental typechecking creates a series of `.tsbuildinfo` files to dave information from last compilation. This expedites type checking during build.
- `baseUrl: "."` & `paths: { @pages/*: [pages/*] }` -- These two, in tandem, setup module path aliases for cleaner imports. To utilize this, import files like: `import Home from "@pages/index";`

### Package.json

#### Scripts

- `format`: instructs prettier to rewrite files with fixes for formatting violations.
- `format-check`: instructs prettier to only check files for violations without fixing them.
- `test`: runs `jest --ci --coverage`. [--ci option](https://jestjs.io/docs/cli#--ci) is provided to prevent automatic creation of snapshots. This requires Jest to be run with `--updateSnapshot`. [--coverage option](https://jestjs.io/docs/cli#--coverageboolean) is provided to instruct jest to collect and report test coverage in output.
- `ts-check`: runs `tsc --noEmit`. [--noEmit option](https://www.typescriptlang.org/tsconfig#noEmit) is provided to prevent type checker compiler from outputting files.

#### Dependencies

- `@typescript-eslint/parser`: implemented in .eslint.json via `"parser": "@typescript-eslint/parser"`. This [plugin](https://www.npmjs.com/package/@typescript-eslint/parser) works in tandem with other plugins to help facilitate the usage of ESlint with TypeScript.
- `@types/jest-axe`: This package contains type definitions for [jest-axe](https://www.npmjs.com/package/jest-axe).

#### Dev Dependencies

- `@babel/preset-typescript`: This [module](https://babeljs.io/docs/en/babel-preset-typescript) allows us to use babel to transpile TypeScript into Javascript, specifically for [jest testing](https://jestjs.io/docs/getting-started#using-typescript) in our case. Implemented in .babelrc > presets.
- `@testing-library/dom`: This [module](https://github.com/testing-library/dom-testing-library) provides querying fo.
- `@testing-library/jest-dom`: This [module](https://testing-library.com/docs/ecosystem-jest-dom/) is a companion for testing-library/dom-- it provides DOM element matchers for jest.
- `@testing-library/react`: This [module](https://testing-library.com/docs/react-testing-library/intro/) works in tandem with testing-library/dom to add APIs for testing React components.
- `babel-jest`: This [module](https://www.npmjs.com/package/babel-jest) works to compile JavaScript/Typescript code using babel for testing. Automatically implemented if `jest-cli` is used.
- `eslint`: This [module](https://www.npmjs.com/package/eslint) provides linting. Configuration implemented in .eslintrc.
- `eslint-config-nava`: This [module](https://github.com/navapbc/eslint-config-nava) contains nava's preferred configurations for eslint. It is implemented in .eslintrc > extensions > nava.
- `eslint-config-next`: This [module](https://nextjs.org/docs/basic-features/eslint) is automatically installed by nextJS, it includes out of the eslint configuration. Implemented in .eslintrc.json > extends > next.
- `eslint-config-prettier`: This [module](https://github.com/prettier/eslint-config-prettier) turns off eslint rules that may conflict with prettier. Implemented in .eslintrc > extends > prettier. This module requires that we list `prettier` as the last element of the `extends` object in `eslintrc.json`.
- `jest-environment-jsdom`: This [module](https://www.npmjs.com/package/jest-environment-jsdom) simulates the DOM for testing. Implemented in jest.config.js > testEnvironment.
- `prettier`: This [module](https://prettier.io/) is used for code formatting. Implemented in .prettierrc.json.
- `ts-jest`: This [module](https://www.npmjs.com/package/ts-jest) lets ys yse hest to test our project written in TypeScript. Implemented in jest.config.js > preset > ts-jest

## Design System

We are using the [USWDS 3.0](https://designsystem.digital.gov) design system.

We did not follow their [install directions](https://designsystem.digital.gov/documentation/getting-started/developers), which require using gulp as a task runner. Instead, we configured `next.config.js` such that we could leverage Next.js's built-in sass compiling and we configured `.storybook/main.js` such that we could leverage Storybook's built-in sass compiling and re-use the same Next.js configuration.

Compiling the USWDS sass is slow, so the initial build step and subsequent sass re-compiles are slow, but after the design system is set up, we shouldn't need to be regularly re-compiling sass.

Copying the USWDS static assets into the project is handled by a [yarn postinstall](https://classic.yarnpkg.com/lang/en/docs/package-json/#toc-scripts) script in `package.json`.

## Internationalization (i18n)

### Next.js i18n

We are using [next-i18next](https://github.com/i18next/next-i18next) for Next.js internationalization. It provides a Next.js wrapper around [i18next](https://www.i18next.com/) and [react-i18next](https://github.com/i18next/react-i18next). Configuration is located in `next-i18next.config.js`. To add a language:

1. Edit `next-i18next.config.js` and add the language to `locales`
2. Add a language folder: `mkdir -p public/locales/<lang>`
3. Add a language file: `touch public/locales/<lang>/common.json` and add the translated content

Note that the json structure should be the same for each translation file. However, non-default languages can omit keys, in which case the translation content for the default language will be used.

### Jest i18n

Internationalization is setup for tests in `jest-i18next.ts`. To add a language:

1. Edit `jest-i18next.ts`, import the language file, and edit the `resources` object.

### Storybook i18n

For storybook, we are using [storybook-react-i18next](https://storybook.js.org/addons/storybook-react-i18next), which adds a globe icon to the add-ons bar for selecting the desired language. To add a language:

1. Edit `.storybook/i18next.js` and add the language to `supportedLngs`. This tells storybook-react-i18next what language files to look for.
2. Edit `.storybook/preview.js` and add the language to `locales`. This tells storybook-react-i18next the options that the globe icon dropdown should include.

Note that for storybook to support i18next, we need to to set a few webpack settings to false. See `.storybook/main.js`.

## Chromatic: Saas Storybook

### CI using Github Actions

For this project, we are using [Chromatic](https://chromatic.com) to host our storybook. We've configured a Github Actions CI job to automatically push a storybook build to chromatic whenever a PR has been merged to main. As part of the one time setup, we created a Github Secret with the chromatic project token.

### Local Development

For local development, we can also manually push a storybook build to Chromatic.

One time setup:

1. Log into Chromatic
2. Click on the project and then click on "Manage" in the left sidebar. Click on the "Configure" tab and copy the project token.
3. Create a `app/.env` file and create a `CHROMATIC_PROJECT_TOKEN=<paste project token here>`

To push a build:

1. Run `yarn chromatic`

To access Chromatic storybook builds (such as for UAT):

1. Log into Chromatic
2. Click on the project and then click on "Builds" in the left sidebar
3. Select the build you are interested in. Look at the branch name. For UAT, make sure to select a build for the `main` branch.
4. Click the "View storybook" button on the right
