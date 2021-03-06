import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import GoogleButton from 'react-google-button'
import Paper from '@material-ui/core/Paper'
import firebase from 'firebase/app' // imported for auth provider
import { useAuth } from 'reactfire'
import { makeStyles } from '@material-ui/core/styles'
import { LOGIN_PATH, LIST_PATH } from 'constants/paths'
import SignupForm from '../SignupForm'
import styles from './SignupPage.styles'

const useStyles = makeStyles(styles)

function SignupPage() {
  const classes = useStyles()
  const auth = useAuth()
  const history = useHistory()

  auth.onAuthStateChanged((auth) => {
    if (auth) {
      history.replace(LIST_PATH)
    }
  })

  function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return auth.signInWithPopup(provider)
  }

  function emailSignup(creds) {
    return auth.createUserWithEmailAndPassword(creds.email, creds.password)
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.panel}>
        <SignupForm onSubmit={emailSignup} />
      </Paper>
      <div className={classes.orLabel}>or</div>
      <div className={classes.providers}>
        <GoogleButton onClick={googleLogin} data-test="google-auth-button" />
      </div>
      <div className={classes.login}>
        <span className={classes.loginLabel}>Already have an account?</span>
        <Link className={classes.loginLink} to={LOGIN_PATH}>
          Login
        </Link>
      </div>
    </div>
  )
}

export default SignupPage
