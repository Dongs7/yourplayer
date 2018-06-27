export const userPlaylists = (state = null, action) => {
  switch (action.type) {
    case 'DB_FETCH_PLAYLISTS' :
      if(action.data === null){
        return null
      }
      //if the user has one more playlists..
      else{
        return {
          ...state,
          playlists : {
            total : action.data.length,
            items : action.data
          }
        }
      }
    default:
      return state
  }
}

export const displayingPlaylist = (state=null, action)=>{
  switch (action.type) {
    case 'DB_SET_CURRENT_PLAYLIST_ID' :
      return action.playlistID
    default:
      return state
  }
}
