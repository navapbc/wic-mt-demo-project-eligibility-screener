# WIC Eligibility Screener

This eligibility screener for the Special Supplemental Nutrition Program for Women, Infants, and Children (WIC) was developed for the State of Montana. It was designed so that, with a little bit of work, it could be adapted to the needs of other agencies. A demo of the project can be found at https://wic-eligibility.demo.navapbc.com. The [storybook](https://storybook.js.org) for the project can be found at https://navapbc.github.io/wic-mt-demo-project-eligibility-screener.

## Contents

This template includes setup for:

- `.github`: common GitHub configuration, such as a PR template and GitHub workflows
- `app`: the Next.js application
- `docs`: project documentation

## How to Run

### Connecting to API

The eligibility screener application is designed to send data it collects to an API (see [example](https://github.com/navapbc/wic-mt-demo-project-mock-api)). However, by default, this application assumes that the application is NOT running in tandem with an API and will run in "demo mode".

To turn off demo mode, configure the following environment variables:

- `API_HOST`: The url of the API including http/s protocool
- `API_AUTH_TOKEN`: The authentication token required to connect to the API

If you are running in development (i.e. using `yarn dev`), then set the environment variable `NEXT_PUBLIC_DEMO_MODE` to `"false"`.
If you are running in production (i.e. using `yarn start`), then set the docker build argument `NEXT_PUBLIC_DEMO_MODE` to `"false"`. Do not set the environment variable when in production. Nextjs will report console errors if you do.

See `/docker-compose.yml` and `/app/Dockerfile` for more details.

### Without Docker

You can run the Next.js app without docker as follows:

1. `yarn install`
2. `yarn dev`
3. Navigate to `localhost:3000` in your browser to view the application

You can run storybook without docker by running:

1. `yarn storybook`
2. Navigate to `localhost:6006` in your browser to view storybook

### With Docker

The Next.js application is dockerized. Take a look at `./app/Dockerfile` to see how it works.

A `docker-compose.yml` has been included to support local development. Take a look at `./docker-compose.yml` for more information.

2. Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop) installed & running.
3. Run `docker-compose up -d --build` to build the image and start the container.
4. Navigate to `localhost:3000` in your browser to view the application. Note that it takes a few minutes for the initial sass compiling to complete and load.
5. Run `docker-compose exec nextjs yarn storybook` to build and run storybook. Note that the initial compiling for storybook also takes a few minutes to complete and load.
5. Navigate to `localhost:6006` in your browser to view storybook.
6. Run `docker-compose down` when you are done to delete the container.

To support local development, the `docker-compose.yml` runs the `nextjs` container in development mode (i.e. `yarn dev`) instead of production mode (i.e. `yarn start`). This allows Next.js to do things like hot reload.

The docker-compose file bind mounts `app` on the host machine to `/srv` in the guest machine. However, to ensure that the container uses the correct packages in `node_modules`, we use a named docker volume for the `node_modules` dir. The named volume will take precedence over the bind mount, so that the `node_modules` dir in the guest machine will not be overwritten with the host machine's `node_modules` dir. This also means that if you run `yarn add <package>` on the host machine in development (which will update `yarn.lock`), you'll also need to run `docker-compose exec nextjs yarn install --frozen-lockfile` to update `node_modules` in the guest machine.

## Disclaimer
This public repository exists purely for the purposes of hosting a snapshot of code to serve as a reference for similar efforts and is therefore not actively maintained. Entities wishing to use this code should do standard security due diligence and make sure to use up-to-date dependencies.
