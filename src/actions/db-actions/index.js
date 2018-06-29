import * as actionTypes from './actionTypes'
import { db } from 'config'
import some from 'lodash/some'
import { task_loading, task_done } from '../task-actions'
import { fetch_success, data_reset } from '../data-actions'
import { convert_title } from 'helper'

/**
 * Set the user's playlists information
 *
 * @param {Array} data - user's playlist data stored in the DB
 */
const set_user_playlists = (data) => {
  return {
    type : actionTypes.DB_FETCH_PLAYLISTS,
    data
  }
}

/**
 * Get the user's playlists information when initializing the app and
 * set the listener for this document.
 *
 * Also, send a listener remover to the store, so the listener can be detached
 * when the user signs out
 *
 * @param {string} userID - userID to be stored
 */
export const get_user_playlists = (userID) => dispatch => {
  let docRef = db.collection('user').doc(userID).collection('plists')

  let unsubscribe = docRef.onSnapshot((querySnapshot)=>{
      if(querySnapshot.size > 0){
        let lists = []
        // console.log("get_user_playlists :: We found some playlists for this user")
        let data = querySnapshot.docs.map(item=>{
          lists.push(item.data())
          return item.data()
        })
        Promise.resolve(data)
        .then((res)=>{
          dispatch(set_user_playlists(res))
        })
      }
      else {
        // console.log("get_user_playlists :: No playlists for this user")
        dispatch(set_user_playlists(null))
      }
    }, ((err)=>{
       console.log("this will throw err if there are errors when removing db listener ", err)
     })
   )

   // Get DB infomation and set listener first, then send the remover to the store
   Promise.resolve(unsubscribe)
    .then((res)=>{
      dispatch(set_playlists_listener_remover(res))
    })
}

/**
 * Helper function to detach DB listener from the app when needed
 *
 * @param {string} playlistID - Target Playlist ID to be deleted
 */
const set_playlists_listener_remover = (remover) => {
  return {
    type : actionTypes.DB_SET_PLAYLISTS_REMOVER,
    remover
  }
}

/**
 * After log in, check if the user Id exists in the DB, and create a new one if not.
 *
 * @param {string} userID - userID to be stored
 */
export const create_user = (userID) => dispatch => new Promise((resolve, reject)=>{
  let docRef = db.collection('user').doc(userID)

  docRef.get()
    .then((doc)=>{
      if(!doc.exists){
        // console.log("USER NOT IN DB, CREATING...")
        docRef.set({
          id: userID
        })
        .then(()=>{
          resolve(true)
          // console.log("user created")
        })
        .catch((err)=>{
          reject(false)
          // console.log("failed to create this user ", err)
        })
      }else{
        resolve(true)
        // console.log("this user ", userID,  " already exists in the DB")
      }
    })
})

/**
 * Create Playlist for the user
 *
 * @param {string} userID - current user ID
 * @param {string} playlistName - Playlist name to be created
 * @param {bool} first - default : false , check if this is the first playlist for this user
 *                       if true, no need to check dup test.
 */
export const create_playlist = (userID, playlistName, first = false) => dispatch => {
  // console.log("hi from create_playlist in db-actions ", userID , ' and ', playlistName)
  dispatch(task_loading("play_list"))
  let last_six = userID.slice(-6) // get last 6 characters from the user ID
  const plistID = `${last_six}_yourplayer_${playlistName}` // generated id for this playlist
  let docRef = db.collection('user').doc(userID).collection('plists').get()
  let docRef_No_check = db.collection('user').doc(userID).collection('plists').doc(plistID)

  // if this is the user's first playlist,
  if(first){
    let create = docRef_No_check.set({
      id: plistID,
      title: playlistName,
    })
    Promise.resolve(create)
    .then(()=>{
      dispatch(task_done(0,'play_list',null))
    })
    .catch((err)=>{
      console.log("playlist creating err ", err)
    })

  }
  else{
    docRef
      .then((subDoc)=>{

        // Check if the user has the same playlist ID
        if(some(subDoc.docs,{id:plistID})){
          console.log("DUPLICATE : SAME PLAYLIST NAME")
          dispatch(task_done(1,'play_list','This playlist name already exists'))
        }

        // Check the number of playlists of the user
        else if(subDoc.size >= 5){
          console.log("MAX : LIMIT REACHED")
          dispatch(task_done(1,'play_list','Max. number of playlists reached'))
        }

        // Create a new playlist
        else{
          docRef_No_check.set({
            id: plistID,
            title: playlistName,
          })
          dispatch(task_done(0,'play_list',null))
        }
      })
  }
}

/**
 * Delete selected playlist from the user DB
 *
 * @param {string} userID - current user ID
 * @param {string} playlistID - Target Playlist ID to be deleted
 */
 export const delete_playlist = (userID, playlistID) => dispatch => {
   dispatch(task_loading('play_list'))
   // console.log("delete playlist id ", playlistID)
   let docRef = db.collection('user').doc(userID).collection('plists').doc(playlistID)

   docRef.delete()
    .then(()=>{
      dispatch(task_done(0,'play_list',null))
    })
 }




 /**
  * Add selected song to the target playlist
  *
  * @param {string} userID - current user ID
  * @param {string} playlistID - Target Playlist ID to be deleted
  */
  export const add_song_to_playlist = (userID, playlistID, songInfo) => dispatch => {
    // console.log("Selected Song ", songInfo.videoId, " is going to be added to ", playlistID, ' playlist')
    dispatch(task_loading("add_song"))
    let docRef = db.collection('user').doc(userID)
                   .collection('plists').doc(playlistID)
                   .collection('songs').doc(songInfo.videoId)

    docRef.get()
      .then((doc)=>{
        if(!doc.exists){
          docRef.set({
            videoId : songInfo.videoId,
            duration : songInfo.duration,
            title : songInfo.title
          })
          .then(()=>{
            // console.log("song added")
            dispatch(task_done(1,"add_song",
                              `${convert_title(songInfo.title)} is successully added to your playlist!`))
          })
        }
        else{
          dispatch(task_done(2,"add_song",
                               `${convert_title(songInfo.title)} is already in your playlist!`))
        }
      })
  }



/**
 * Fetch items in the target playlist and Enable listener for the playlist.
 * Also, send a listener remover to the store, so the listener can be detached
 * when the user moves to the different playlist
 *
 * @param {string} userID - current user ID
 * @param {string} playlistID - Target Playlist ID to be deleted
 */
export const fetch_playlistItems = (userID, playlistID) => dispatch => {

  let docRef = db.collection('user').doc(userID)
                 .collection('plists').doc(playlistID)
                 .collection('songs')

   dispatch(set_current_playlist_id(playlistID))
   let unsubscribe = docRef.onSnapshot((querySnapshot)=>{
     if(querySnapshot.size > 0){
       // console.log("fetch_playlistItems :: Playlist have some items")
       let data = querySnapshot.docs.map(item=>{
         return item.data()
       })
       Promise.resolve(data)
        .then((res)=>{
          dispatch(fetch_success(res,'play_list'))
        })
     }
     else {
       // console.log("fetch_playlistItems :: No items")
       dispatch(data_reset('play_list'))
     }
   }, ((err)=>{
      console.log("This will throw err if there are errors when removing listener ", err)
    }) // err
  ) // onSnapshot

  // Set listener first, then send the remover to the store
  Promise.resolve(unsubscribe)
    .then((res)=>{
      // console.log("db listener remover set")
      dispatch(set_playlist_listener_remover(res))
    })

}

/**
 * Helper function to detach DB listener from the app when needed
 *
 * @param {string} playlistID - Target Playlist ID to be deleted
 */
const set_playlist_listener_remover = (remover) => {
  return {
    type : actionTypes.DB_SET_PLAYLIST_REMOVER,
    remover
  }
}

/**
 * Fetch items in the target playlist and Enable listener for the playlist.
 * Also, send a listener remover to the store, so the listener can be detached
 * when the user moves to the different playlist
 *
 * @param {string} playlistID - Target Playlist ID to be deleted
 */
const set_current_playlist_id = (playlistID) => {
  return{
    type : actionTypes.DB_SET_CURRENT_PLAYLIST_ID,
    playlistID
  }
}

/**
 * Delete selected song from the target playlist
 *
 * @param {string} userID - current user ID
 * @param {string} playlistID - Target Playlist ID
 * @param {string} songInfo - Target SongInfo to be removed
 */
export const delete_song_from_playlist = (userID, playlistID, songInfo) => dispatch => {
  // console.log("seleted playlist id is  ", playlistID, " and remove ", songInfo)
  let docRef = db.collection('user').doc(userID)
                 .collection('plists').doc(playlistID)
                 .collection('songs').doc(songInfo.videoId)

  docRef.delete()
    .then(()=>{
      // console.log("item removed")
    })
    .catch((err)=>{
      // console.log('error while removing, ', err)
    })
}
