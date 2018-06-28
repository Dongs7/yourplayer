import * as actionTypes from './actionTypes'


export const set_player_status = (value) => {
  return{
    type : actionTypes.PLAYER_PLAY,
    value
  }
}

export const get_player_skip = (value) => {
  return{
    type : actionTypes.PLAYER_SKIP,
    value
  }
}

export const set_player_shuffle = (bool) => {
  return{
    type : actionTypes.PLAYER_SHUFFLE,
    bool
  }
}

export const set_player_repeat = (value) => {
  return{
    type : actionTypes.PLAYER_REPEAT,
    value
  }
}

export const get_selected_song_info = (data, target, idx) => {
  return{
    type: actionTypes.PLAYER_GET_SONGINFO,
    data,
    target,
    idx
  }
}

/**
 * Get current repeator state
 * @param {int} [selector : def = 1 [1 - norepeat, 2 - repeatOne, 3 - repeatAll]]
 */
export const set_repeat_selector = (selector) => {
  return {
    type : 'PLAYER_REPEAT',
    selector
  }
}
