# Lykke Exchange Web

This project is web client implementation for Lykke Exchange written in Typescript and React.

- [Getting started](#getting-started)
  - [yarn](#yarn)
  - [yarn start](#yarn-start)
  - [yarn test](#yarn-test)
  - [yarn build](#yarn-build)
- [Deployment](#deployment)
  - [Docker](#docker)

## Getting started

This project uses `yarn` as a package manager.

#### `yarn`

Install dependencies with `yarn` command.

### `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

#### `yarn test`

Launches the test runner in the interactive watch mode.

### `yarn build`

Builds the app for production to the `build` folder.

The build is minified and the filenames include the hashes.<br>
Now app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

## Deployment

### Docker

Production build of the app done with `yarn build` bundled in a docker image which you can run on any Docker host.
