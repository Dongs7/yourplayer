import * as actionTypes from './actionTypes'


/**
 * Get user status
 *
 * @param {object} userdata
 * @param {boolean} auth_state
 */
export const set_userinfo = (userdata, auth_state) => {
  return {
    type : actionTypes.SET_USER_INFO,
    userdata,
    auth_state
  }
}
