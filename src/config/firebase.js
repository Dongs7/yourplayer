// import firebase from 'firebase'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const fire_config = {
  apiKey: process.env.REACT_APP_FIRE_APIKEY,
  authDomain: process.env.REACT_APP_FIRE_AUTH,
  databaseURL: process.env.REACT_APP_FIRE_DB_URL,
  projectId: process.env.REACT_APP_FIRE_PROID,
  storageBucket: process.env.REACT_APP_FIRE_SBUCKET,
  messagingSenderId: process.env.REACT_APP_FIRE_MSID
}
firebase.initializeApp(fire_config)

export const db = firebase.firestore()
const db_setting = { timestampsInSnapshots : true }
db.settings(db_setting)

export const provider = new firebase.auth.GoogleAuthProvider()
provider.addScope('https://www.googleapis.com/auth/youtube');
export const auth = firebase.auth
