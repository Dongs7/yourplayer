import { set_userinfo } from './user-actions'
import { fetch_data_from_api } from './data-actions'
import { create_playlist,
         create_user,
         get_user_playlists,
         delete_playlist,
         add_song_to_playlist,
         fetch_playlistItems,
         delete_song_from_playlist,
         modify_playlist
       } from './db-actions'
import { task_done, task_error, task_idle, task_loading } from './task-actions'
import { set_player_status, get_selected_song_info, set_repeat_selector } from './player-actions'

export {
  //user actions
  set_userinfo,

  //data actions
  fetch_data_from_api,

  //database Actions
  create_playlist,
  create_user,
  get_user_playlists,
  delete_playlist,
  add_song_to_playlist,
  fetch_playlistItems,
  delete_song_from_playlist,
  modify_playlist,

  //task actions
  task_done,
  task_error,
  task_idle,
  task_loading,

  //player actions
  set_player_status,
  get_selected_song_info,
  set_repeat_selector,
}
