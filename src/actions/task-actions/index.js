import * as actionTypes from './actionTypes'


/**
 * Task Reset to Idle
 *
 * @param {string} target - type of task
 */
export const task_idle = (target) => {
  return {
    type : actionTypes.TASK_IDLE,
    target
  }
}

/**
 * Task loading
 *
 * @param {string} target - type of task
 */
export const task_loading = (target) => {
  return {
    type : actionTypes.TASK_LOADING,
    target
  }
}

/**
 * Task done
 *
 * @param {string} target - type of task
 */
export const task_done = (code,target,msg) => {
  return {
    type : actionTypes.TASK_DONE,
    code,
    target,
    msg
  }
}

/**
 * Task error
 *
 * @param {string} target - type of task
 */
export const task_error = (target) => {
  return {
    type : actionTypes.TASK_ERROR,
    target
  }
}
