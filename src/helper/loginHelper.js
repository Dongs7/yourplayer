import { auth } from 'config'

export const initScript = () => new Promise((resolve, reject) => {
  // console.log("inint script")
  const e = document.createElement('script')
  e.type = 'text/javascript'
  e.async = true
  e.src = 'https://apis.google.com/js/api.js'

  e.onload = () => {
    window.gapi.load('client', () => {
      window.gapi.client.init({
        apiKey: process.env.REACT_APP_GOOGLE_apiKey,
        clientId: process.env.REACT_APP_GOOGLE_clientId,
        discoveryDocs: [process.env.REACT_APP_GOOGLE_discoveryDocs],
        scope: process.env.REACT_APP_GOOGLE_scope,
      })
      .then((res)=>{
        // console.log("init done...client.init... ")
        // console.log('is user logged in ? ')
        const GoogleAuth = window.gapi.auth2.getAuthInstance()
        GoogleAuth.isSignedIn.listen(_updateSignInStatus)
        resolve(true)
      })
      .catch(err=> {
        console.log("init script err", err)
        reject(false)
      })
    })
  }

  document.getElementsByTagName('head')[0].appendChild(e)
})


const _updateSignInStatus = status => {
  // console.log('login status changed ? ' , status)
  if(status){
    _onSignIn()
  }
}

const _onSignIn = () => {
  // get currently signed in google user
  let gUser = window.gapi.auth2.getAuthInstance().currentUser.get()

  // check if the user has a valid permission to access scope
  const isAuthorized = gUser.hasGrantedScopes('https://www.googleapis.com/auth/youtube')

  if(isAuthorized){
    // get the user's id token and access token
    const authResponse = gUser.getAuthResponse(true)
    // set credential info for firebase auth
    const credentials = auth.GoogleAuthProvider.credential(authResponse.id_token, authResponse.access_token)

    // check if the user has already signed in to firebase
    let firebaseUser = auth().currentUser

    if(!firebaseUser){
      _firebaseSignIn(credentials)
      .then((res)=>{
        // console.log("successfully logged in")
      })
    }
    else{
      // console.log("already logged in to firebase")
    }
  }
}

// Firebase Login
const _firebaseSignIn = (credentials) => new Promise((resolve, reject) =>{
  auth().signInAndRetrieveDataWithCredential(credentials)
  .then((user) => {
    // console.log("successfully logged in to firebase ")
    resolve(user)
  })
  .catch((err)=>{
    // console.log("firebase login error ", err)
    reject(err)
  })
})




// Google Auth SignIn
export const googleSignIn = () => new Promise((resolve, reject)=>{
  if(!window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
      window.gapi.auth2.getAuthInstance().signIn()
      .then((res)=>{
        // console.log("user signed in step1", res)
        resolve(res)
      })
      .catch((err)=>{
        // console.log('sign in error ', err))
      })
  }
  else{
    reject("user already signed in from somewhere or error loggin in")
  }
})

//Google Auth SignOut
export const googleSignOut = () => new Promise((resolve, reject) => {
  window.gapi.auth2.getAuthInstance().signOut()
  .then(() => {
    auth().signOut()
    resolve(true)
  })
  .catch((err)=>{
    reject(err)
  })
})

export const userStatus_listener = () => new Promise ((resolve, reject)=>{
  auth().onAuthStateChanged((user)=>{
    if(user){
      resolve(user)
    }else{
      // reject("no user detected, from onAuthStateChanged")
    }
  })
})
