# WIC Eligibility Screener

This eligibility screener for the Special Supplemental Nutrition Program for Women, Infants, and Children (WIC) was developed for the State of Montana. It was designed so that, with a little bit of work, it could be adapted to the needs of other agencies. A demo of the project can be found at https://wic-eligibility.demo.navapbc.com. The [storybook](https://storybook.js.org) for the project can be found at https://navapbc.github.io/wic-mt-demo-project-eligibility-screener.

## Contents

This template includes setup for:

- `.github`: common GitHub configuration, such as a PR template and GitHub workflows
- `app`: the Next.js application
- `docs`: project documentation

## How to Run

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
