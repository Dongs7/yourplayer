// USER REDUCER

const initialUserState = {
  authenticate  : false,
  userData : null
}

const userInfo = (state = initialUserState, action) => {
  switch(action.type) {
    case 'SET_USER_INFO' :
      if(action.auth_state){
        return {
          authenticate : true,
          userData : action.userdata
        }
      }
      else{
        return {
          authenticate : false,
          userData : null
        }
      }

    default :
      return state
  }
}

export default userInfo
