# MaterialCatalog

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Story JSON API

Start the REST API for the Angular and React Storybook stories:

```bash
npm run stories:api
```

The API listens on `http://127.0.0.1:6011` by default and prints JSON directly in the browser:

- `GET /api` — list every available Shadcn component URL
- `GET /api/health` — service status
- `GET /api/accordion` — Accordion metadata and story states as JSON
- `GET /api/button` — Button metadata and story states as JSON
- `GET /api/:component` — any Shadcn component by its URL name
- `GET /api/shadcn` — all Shadcn components as JSON
- `GET /api/stories` — metadata for every Angular and React story file

Set `PORT` or `HOST` to change the listener. The API enables CORS so the catalog can read it from a browser.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
