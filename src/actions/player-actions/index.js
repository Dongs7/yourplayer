import * as actionTypes from './actionTypes'


/**
 * Set Current player status
 *
 * @param {string} - player status
 */
export const set_player_status = (value) => {
  return{
    type : actionTypes.PLAYER_PLAY,
    value
  }
}

/**
 * Get skip value
 *
 * @param {string} value - skip value [ prev, next ]
 */
export const get_player_skip = (value) => {
  return{
    type : actionTypes.PLAYER_SKIP,
    value
  }
}

/**
 * Get Shuffle status
 *
 * @param {bool} bool - current shuffle state - [ true, false ]
 */
export const set_player_shuffle = (bool) => {
  return{
    type : actionTypes.PLAYER_SHUFFLE,
    bool
  }
}

/**
 * Set repeat type
 *
 * @param {int} value - repeat type  - [ 1: no repeat, 2: repeat:single, 3: repeat:all ]
 */
export const set_player_repeat = (value) => {
  return{
    type : actionTypes.PLAYER_REPEAT,
    value
  }
}

/**
 * Get the selected song info
 *
 * target and idx params will be used to determine the next / prev tracks
 * when shuffling/ repeating the playlist or search result
 *
 * @param {obj} data - the selected song info
 * @param {int} target - determine where the user selects the song  [playlist / search result]
 * @param {int} idx - the selected song's index
 */
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
