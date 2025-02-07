# Image Search

This is a simple app that searches the Imgur gallery API and renders images/videos using React + Typescript.

## Recommended Setup

- If using VSCode, consider installing the [recommended extensions](.vscode/extensions.json).
  - For ease of setup, there is a [default VSCode settings file](.vscode/settings.default.json). Developers should be able to set up their text-editors how they want, but this will get you started with recommended settings.

From the root directory of the project:

Create a `.env.local` file

```sh
cp .env.example .env.local
```

Open `.env.local` and [add your client ID](https://apidocs.imgur.com/#authorization-and-oauth).

The project uses [nvm](https://github.com/nvm-sh/nvm/blob/master/README.md); ensure that you are using an appropriate Node version by checking [.nvmrc](.nvmrc). If you use nvm, you can just exec the following command:

```sh
nvm use
```

The project uses [pnpm over npm](https://pnpm.io/pnpm-vs-npm). To install dependencies:

```sh
pnpm i
```

For local development, you can run:

```sh
pnpm dev
```

## Architecture / Dependencies

This is a React project. If you have any React-specific questions, check the [official docs](https://react.dev/reference/react).

### Build Tooling

The app gets run locally (as well as build for production) with [Vite](https://vite.dev/guide/) (pronounced /vit/, like "veet"). It's fast, has a great DevX, works well with other libraries, and is _much_ less opinionated than other build tools.

### External state / data-fetching

The project uses [@tanstack/react-router](https://tanstack.com/router/latest) for client-side routing and for [data loading](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#data-loading), while making use of [@tanstack/react-query](https://tanstack.com/query/latest) for the query client. They play nicely together, lend themselves to a spectacular developer experience, and the documentation is great.

[Axios](https://axios-http.com/docs/intro) is used for HTTP requests.

### Styling / UI

[TailwindCSS](https://tailwindcss.com/) was used for rapidly building. [shadcn/ui](https://ui.shadcn.com/) was used for for components--its reusable components allow for developing quickly while minimizing bundle size. The docs are also pretty stellar.

### Data Validation

[zod](https://zod.dev/) was chosen for data validation: its [parse, don't validate](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/) approach makes sense. It also provides type-safety for external data (we love type safety).

### Code Quality (linting, etc.)

[Biome](https://biomejs.dev/guides/getting-started/) is being used for linting and formatting. [Lefthook](https://github.com/evilmartians/lefthook#install) is being used for pre-commit hooks.
