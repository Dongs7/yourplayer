const initialStateForData = {
  searchResults : {
    items : null,
    nextPageToken : null
  },
  // playlistResults : {
  //   items : null,
  //   nextPageToken : null,
  //   totalItems : 0
  // },
  playlistResults : {
    items:null
  }
}
export const dataResult = (state = initialStateForData, action) => {
  switch(action.type) {
    case 'FETCH_SUCCESS' :
      if(action.target === 'search_list'){
        return {
          ...state,
          searchResults :{
            nextToken : action.data.nextPageToken,
            items : action.data.items,
          }
        }

      }else if (action.target === 'play_list') {

          return {
            ...state,
            playlistResults : {
              items : action.data
            }
          }

      }else {
        return {
          ...state,
          item : action.data.result
        }
      }

    case 'FETCH_MORE' :
      if(action.target === 'search_list'){
        return{
          ...state,
          searchResults :{
            nextToken : action.data.nextPageToken,
            items : [...state.searchResults.items,...action.data.items]
          }
        }
      }
    case 'DATA_RESET' :
      if(action.target === 'search_list'){
        return{
          ...state,
          searchResults :{
            nextToken : null,
            items : null
          }
        }
      }else{
        return{
          ...state,
          playlistResults :{
            items : null
          }
        }
      }

    default :
      return state
  }
}

export const currentTerm = (state = null, action) => {
  switch(action.type) {
    case 'FETCH_TERM' :
      return action.term
    default:
      return state
  }
}

export const playlistRemover = (state = null, action) => {
  switch(action.type) {
    case 'DB_SET_PLAYLIST_REMOVER' :
      return action.remover
    default:
      return state
  }
}

export const playlistsRemover = (state = null, action) => {
  switch(action.type) {
    case 'DB_SET_PLAYLISTS_REMOVER' :
      return action.remover
    default:
      return state
  }
}
