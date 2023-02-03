## General Technical Documentation

### Development

For this project, we have dockerized each component and use `docker-compose`.

### Continuous Integration

For CI, we are using [Github Actions](https://github.com/features/actions). In each repo, the primary branch is `main` and we have configured it as a [protected branch](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/managing-a-branch-protection-rule). To merge to `main`, a Pull Request must be made, status checks must pass, and the branch must be up to date.

For our project work, each PR is required to have at least one code review and approval. This is enforced in Github in this project repo.

We have enabled the following status checks in each app repo:

- typechecking
- linting
- testing
- security scanning

The eligibility screener repo also includes accessibility scanning with [jest-axe](https://github.com/nickcolley/jest-axe).  

### Infrastructure

We are using [Terraform](https://www.terraform.io) to manage our infrastructure as code.

We are hosting our environments and networking resources in AWS.

**Environments**
There is a `test` environment enabled for both the eligibility screener and the mock api. Each
application has a `main.tf` which serves as a template for creating the relevant resources required
for hosting the application in different environments. (e.g. ECS tasks, security groups)

**Secrets**
Secrets are managed in AWS Parameter Store. Variables should be referenced using Terraform's
`aws_ssm_parameter` data resources.

**Application environment variables**
- Many of the resources in each application (e.g. cluster names, load balancers) are prefixed with the name of the environment.

## Local Development

To run the eligibility screener and the Mock API in development mode locally:

1. Navigate to the root directory of this repo
2. Clone the eligibility screener repo: `git clone git@github.com:navapbc/wic-mt-demo-project-eligibility-screener.git eligibility-screener`
3. Clone the mock API repo: `git clone git@github.com:navapbc/wic-mt-demo-project-mock-api.git mock-api`
4. Build the docker images and start the containers (it will start 3 containers: mock api, eligibility screener, postgresql): `docker-compose up -d --build`
5. If this is the first time you are running the mock API, then it will crash because the database migrations haven't been run yet. Run them and then restart the container: `docker-compose run --rm mock-api poetry run db-migrate-up && docker-compose up -d`
6. Run storybook: `docker-compose exec eligibility-screener yarn storybook`

Now you can navigate to:

- `localhost:3000` to access the eligibility screener
- `localhost:8080/v1/docs` to access the swagger docs
- `localhost:6006` to access storybook