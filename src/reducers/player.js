
export const playerStatus = ( state = 'done', action) => {
  switch(action.type) {
    case 'PLAYER_PLAY' :
      return action.value
    default :
      return state
  }
}

const initStateForSelectedSong = {
  info : null,
  songFrom : 1,
  idx : -1
}
export const selectedSong = (state = initStateForSelectedSong, action) => {
  switch(action.type) {
    case 'PLAYER_GET_SONGINFO' :
      return {
        info : action.data,
        songFrom : action.target,
        idx : action.idx
      }
    default :
      return state
  }
}

const initRepeatState = {
  norepeat: true,
  single : false,
  all : false
}
export function getPlayerRepeat(state = initRepeatState, action ) {

  switch (action.type) {
    case 'SONG_REPEAT' :
      if(action.selector === 1){
        return {
          norepeat:true,
          all:false,
          single : false
        }
      }
      else if(action.selector === 2){
        return {
          norepeat:false,
          all:false,
          single : true
        }
      }
      else{
        return{
          norepeat:false,
          all:true,
          single : false
        }
      }

      default :
        return state
  }
}
