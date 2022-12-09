## Storybook

We are using [Storybook](https://storybook.js.org) for isolated component development. Storybook configuration is located in `.storybook`. Stories are located in `stories`. There is one story for each React component and one story for each Next.js page.

For each editable form pages, we show 2 stories in storybook:

- The blank form you would see when you first navigate to that page
- The filled out form you would see when:
  - you filled out the form and refresh the browser window
  - OR you have gone all the way through the form wizard and want to go back and edit this particular page

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

## Development

### Git Hooks

We use [husky](https://typicode.github.io/husky/#/) to run linting and formatting checks before a `git push`. Because our husky directory is in `app`, we configured husky with a [custom directory](https://typicode.github.io/husky/#/?id=custom-directory).

One time setup:

1. `cd app`
2. `yarn install`
3. `yarn husky-prepare`


### Linting

For linting, this application is leveraging `eslint`, `prettier` and Nava's [eslint-config-nava](https://github.com/navapbc/eslint-config-nava). Although, these will be run on CI, it is still recommended that we tell our code editor to auto-fix eslint and prettier errors on save.

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

#### Eslint rules explained

- "@typescript-eslint/no-unused-vars": "error"
  - Disallows unused variables-- prevents dead code accumulation.
- "@typescript-eslint/no-explicit-any": "error"
  - Disallows usage of `any` type. The usage of `any` defeats the purpose of typescript. Consider using `unknown` type instead instead.
- "react/resct-in-jsx-scope": "off"
  - suppress errors for missing 'import React' in files because NextJS does this for us.

### Typechecking

For typechecking, this application is leveraging Next.js' [incremental typechecking](https://nextjs.org/docs/basic-features/typescript#incremental-type-checking). Next.js will run type checking as a part of `next build`, but it is still recommended that we set up type checking using our code editor for development.

In VSCode, do so by adding the following to your `.vscode/settings.json` file

```
"typescript.validate.enable": true
```

Note: make sure TypeScript and Javascript Language Features are enabled in VS Code Extensions.

#### Tsconfig additions

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
- `test`: runs `jest --ci --coverage`. [--ci option](https://jestjs.io/docs/cli#--ci) is provided to prevent automatic creation of snapshots. To update snapshots for [jest snapshot testing](https://jestjs.io/docs/snapshot-testing), run `yarn test --updateSnapshot`. The [`--coverage` option](https://jestjs.io/docs/cli#--coverageboolean) is provided to instruct jest to collect and report test coverage in output.
- `test-e2e`: runs end-to-end testing using [playwright](https://playwright.dev)
- `ts-check`: runs `tsc --noEmit`. The [`--noEmit` option](https://www.typescriptlang.org/tsconfig#noEmit) is provided to prevent type checker compiler from outputting files.

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
