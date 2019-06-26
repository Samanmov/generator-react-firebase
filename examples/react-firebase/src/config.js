/**
 * NOTE: This file is ignored from git tracking. In a CI environment it is
 * generated by firebase-ci based on config in .firebaserc (see .gitlab-ci.yaml).
 * This is done so that environment specific settings can be applied.
 */

export const env = 'dev'

// Config for firebase
export const firebase = {
  apiKey: 'AIzaSyCTUERDM-Pchn_UDTsfhVPiwM4TtNIxots',
  authDomain: 'redux-firebasev3.firebaseapp.com',
  databaseURL: 'https://redux-firebasev3.firebaseio.com',
  projectId: 'redux-firebasev3',
  storageBucket: 'redux-firebasev3.appspot.com'
}

// Config to override default reduxFirebase config in store/createStore
// which is not environment specific.
// For more details, visit http://react-redux-firebase.com/docs/api/enhancer.html
export const reduxFirebase = {
  enableLogging: false, // enable/disable Firebase Database Logging
}

export default {
  env,
  firebase,
  reduxFirebase
}
