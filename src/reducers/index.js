import { combineReducers } from 'redux'

import userInfo from './user'
import { dataResult, currentTerm, playlistRemover, playlistsRemover } from './data'
import { userPlaylists, displayingPlaylist } from './playlist'
import loading from './task'
import { playerStatus, selectedSong, getPlayerRepeat } from './player'

const rootReducers = combineReducers({
  userState : userInfo,
  result : dataResult,
  currentTerm : currentTerm,
  playlists : userPlaylists,
  loading : loading,

  playerStatus : playerStatus,
  selectedSong : selectedSong,
  repeatStatus : getPlayerRepeat,

  currentPlaylistID : displayingPlaylist,
  playlistRemover : playlistRemover,
  playlistsRemover : playlistsRemover,
})

export default rootReducers
