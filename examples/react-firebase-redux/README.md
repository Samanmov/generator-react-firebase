# react-firebase-redux

[![Build Status][build-status-image]][build-status-url]
[![License][license-image]][license-url]
[![Code Style][code-style-image]][code-style-url]

## Table of Contents

1. [Features](#features)
1. [Requirements](#requirements)
1. [Getting Started](#getting-started)
1. [Application Structure](#application-structure)
1. [Development](#development)
    1. [Routing](#routing)
1. [Testing](#testing)
1. [Configuration](#configuration)
1. [Production](#production)
1. [Deployment](#deployment)

## Requirements

* node `^10.15.0`
* npm `^6.0.0`

## Getting Started

1. Install app and functions dependencies: `npm i && npm i --prefix functions`
1. Create `src/config.js` file that looks like so if it does not already exist:
    ```js
    const firebase = {
      // Config from Firebase console
    }

    // Overrides for for react-redux-firebase/redux-firestore config
    export const reduxFirebase = {}

    export const segmentId = '<- Segment ID ->'

    export default {
      env,
      firebase,
      reduxFirebase,
      segmentId
    }
    ```
1. Start Development server: `npm start`

While developing, you will probably rely mostly on `npm start`; however, there are additional scripts at your disposal:

|`npm run <script>`    |Description|
|-------------------|-----------|
|`start`            |Serves your app at `localhost:3000` with automatic refreshing and hot module replacement|
|`start:dist`       |Builds the application to `./dist` then serves at `localhost:3000` using firebase hosting emulator|
|`start:emulate`    |Same as `start`, but pointed to database emulators (make sure to call `emulators` first to boot up emulators)|
|`build`            |Builds the application to `./dist`|
|`test:ui`          |Runs ui tests with Cypress. See [testing](#testing)|
|`test:ui:open`     |Opens ui tests runner (Cypress Dashboard). See [testing](#testing)|
|`test:ui:emulate`     |Same as `test:ui:open` but with tests pointed at emulators|
|`lint`             |[Lints](http://stackoverflow.com/questions/8503559/what-is-linting) the project for potential errors|
|`lint:fix`         |Lints the project and [fixes all correctable errors](http://eslint.org/docs/user-guide/command-line-interface.html#fix)|

[Husky](https://github.com/typicode/husky) is used to enable `prepush` hook capability. The `prepush` script currently runs `eslint`, which will keep you from pushing if there is any lint within your code. If you would like to disable this, remove the `prepush` script from the `package.json`.

## Config Files

There are multiple configuration files:

* Firebase Project Configuration (including settings for how `src/config.js` is built on CI) - `.firebaserc`
* Project Configuration used within source (can change based on environment variables on CI) - `src/config.js`
* Cloud Functions Local Configuration - `functions/.runtimeconfig.json`

More details in the [Application Structure Section](#application-structure)

## Application Structure

The application structure presented in this boilerplate is **fractal**, where functionality is grouped primarily by feature rather than file type. Please note, however, that this structure is only meant to serve as a guide, it is by no means prescriptive. That said, it aims to represent generally accepted guidelines and patterns for building scalable applications.

```
├── public                   # All build-related configuration
│   ├── index.html           # Main HTML page container for app
│   ├── scripts              # Scripts used within the building process
│   │  └── compile.js        # Custom Compiler that calls Webpack compiler
│   │  └── start.js          # Starts the custom compiler
├── src                      # Application source code
│   ├── config.js            # Environment specific config file with settings from Firebase (created by CI)
│   ├── components           # Global Reusable Presentational Components
│   ├── constants            # Project constants such as firebase paths and form names
│   │  ├── formNames.js      # Names of redux forms
│   │  └── paths.js          # Paths for application routes
│   ├── containers           # Global Reusable Container Components (connected to redux state)
│   ├── layouts              # Components that dictate major page structure
│   │   └── CoreLayout       # Global application layout in which to render routes
│   ├── routes               # Main route definitions and async split points
│   │   ├── index.js         # Bootstrap main application routes
│   │   └── Home             # Fractal route
│   │       ├── index.js     # Route definitions and async split points
│   │       ├── assets       # Assets required to render components
│   │       ├── components   # Presentational React Components (state connect and handler logic in enhancers)
│   │       ├── modules      # Collections of reducers/constants/actions
│   │       └── routes/**    # Fractal sub-routes (** optional)
│   ├── static               # Static assets
│   ├── store                # Redux-specific pieces
│   │   ├── createStore.js   # Create and instrument redux store
│   │   └── reducers.js      # Reducer registry and injection
│   ├── styles               # Application-wide styles (generally settings)
│   └── utils                # General Utilities (used throughout application)
│   │   ├── components.js    # Utilities for building/implementing react components (often used in enhancers)
│   │   ├── form.js          # For forms (often used in enhancers that use redux-form)
│   │   └── router.js        # Utilities for routing such as those that redirect back to home if not logged in
├── tests                    # Unit tests
├── .env.local               # Environment settings for when running locally
├── .eslintignore            # ESLint ignore file
├── .eslintrc.js             # ESLint configuration
├── .firebaserc              # Firebase Project configuration settings (including ci settings)
├── database.rules.json      # Rules for Firebase Real Time Database
├── firebase.json            # Firebase Service settings (Hosting, Functions, etc)
├── firestore.indexes.json   # Indexs for Cloud Firestore
├── firestore.rules          # Rules for Cloud Firestore
└── storage.rules            # Rules for Cloud Storage For Firebase
```

## Routing

We use `react-router-dom` [route matching](https://reacttraining.com/react-router/web/guides/basic-components/route-matching) (`<route>/index.js`) to define units of logic within our application. The application routes are defined within `src/routes/index.js`, which loads route settings which live in each route's `index.js`. The component with the suffix `Page` is the top level component of each route (i.e. `HomePage` is the top level component for `Home` route).

There are two types of routes definitions:

### Sync Routes

The most simple way to define a route is a simple object with `path` and `component`:

*src/routes/Home/index.js*

```js
import HomePage from './components/HomePage'

// Sync route definition
export default {
  path: '/',
  component: HomePage
}
```

### Async Routes

Routes can also be seperated into their own bundles which are only loaded when visiting that route, which helps decrease the size of your main application bundle. Routes that are loaded asynchronously are defined using `loadable` function which uses `React.lazy` and `React.Suspense`:

*src/routes/NotFound/index.js*

```js
import loadable from 'utils/components'

// Async route definition
export default {
  component: loadable(() =>
    import(/* webpackChunkName: 'NotFound' */ './components/NotFoundPage')
  )
}
```

With this setting, the name of the file (called a "chunk") is defined as part of the code as well as a loading spinner showing while the bundle file is loading.

More about how routing works is available in [the react-router-dom docs](https://reacttraining.com/react-router/web/guides/quick-start).

## Testing


### UI Tests

Cypress is used to write and run UI tests which live in the `cypress` folder. The following npm scripts can be used to run tests:

  * Run using Cypress run: `npm run test:ui`
  * Open Test Runner UI (`cypress open`): `npm run test:ui:open`

To run tests against emulators:
  
  1. Start database emulators: `npm run emulate`
  1. Start React app pointed at emulators: `npm run start:emulate`
  1. Open Cypress test runner with test utils pointed at emulators: `npm run test:ui:emulate`

## Deployment

Build code before deployment by running `npm run build`. There are multiple options below for types of deployment, if you are unsure, checkout the Firebase section.

Before starting make sure to install Firebase Command Line Tool: `npm i -g firebase-tools`

#### CI Deploy (recommended)

**Note**: Config for this is located within
`firebase-ci` has been added to simplify the CI deployment process. All that is required is providing authentication with Firebase:

1. Login: `firebase login:ci` to generate an authentication token (will be used to give CI rights to deploy on your behalf)
1. Set `FIREBASE_TOKEN` environment variable within CI environment
1. Run a build on CI

If you would like to deploy to different Firebase instances for different branches (i.e. `prod`), change `ci` settings within `.firebaserc`.

For more options on CI settings checkout the [firebase-ci docs](https://github.com/prescottprue/firebase-ci)

#### Manual deploy

1. Run `firebase:login`
1. Initialize project with `firebase init` then answer:
    * What file should be used for Database Rules?  -> `database.rules.json`
    * What do you want to use as your public directory? -> `build`
    * Configure as a single-page app (rewrite all urls to /index.html)? -> `Yes`
    * What Firebase project do you want to associate as default?  -> **your Firebase project name**
1. Build Project: `npm run build`
1. Confirm Firebase config by running locally: `firebase serve`
1. Deploy to Firebase (everything including Hosting and Functions): `firebase deploy`

**NOTE:** You can use `firebase serve` to test how your application will work when deployed to Firebase, but make sure you run `npm run build` first.

## FAQ

1. Why node `10` instead of a newer version?

  [Cloud Functions runtime runs on `10`](https://cloud.google.com/functions/docs/writing/#the_cloud_functions_runtime), which is why that is what is used for the CI build version.

[build-status-image]: https://img.shields.io/github/workflow/status/prescottprue/react-firebase-redux/Verify?style=flat-square
[build-status-url]: https://github.com/prescottprue/react-firebase-redux/actions
[climate-image]: https://img.shields.io/codeclimate/github/prescottprue/react-firebase-redux.svg?style=flat-square
[climate-url]: https://codeclimate.com/github/prescottprue/react-firebase-redux
[coverage-image]: https://img.shields.io/codeclimate/coverage/github/prescottprue/react-firebase-redux.svg?style=flat-square
[coverage-url]: https://codeclimate.com/github/prescottprue/react-firebase-redux
[license-image]: https://img.shields.io/npm/l/react-firebase-redux.svg?style=flat-square
[license-url]: https://github.com/prescottprue/react-firebase-redux/blob/master/LICENSE
[code-style-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[code-style-url]: http://standardjs.com/
