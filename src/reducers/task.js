const initLoading = {
  play_list : false,
  search_list : false,
  add_song : false,
  msg : null,
  code: 0
}

const loading = (state=initLoading, action) => {
  switch(action.type) {
    case 'TASK_LOADING' :
      return {
        ...state,
        [action.target] : true
      }
    case 'TASK_DONE' :
      return {
        ...state,
        [action.target] : false,
        msg : action.msg,
        code : action.code
      }

    default :
      return state
  }
}

export default loading
