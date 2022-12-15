# Use the Active LTS version of Node.
# See https://nodejs.org/en/about/releases/
FROM node:16-alpine
# Keep container packages up-to-date.
# -U runs both apk update and apk upgrade.
RUN apk -U upgrade
# Copy just the package data to the working directory.
COPY yarn.lock /srv
COPY package.json /srv
WORKDIR /srv
# Install application dependencies.
RUN yarn install --frozen-lockfile
# Copy all the remaining application files (ignoring files in .dockerignore) to the working directory.
COPY . /srv
# The default setting for NEXT_PUBLIC_DEMO_MODE is true. This will deploy the application in demo mode.
# Override this with a build arg set to "false" to connect to the mock API.
ARG NEXT_PUBLIC_DEMO_MODE=true
# Build the application.
RUN yarn build
# Run the application.
CMD yarn start
