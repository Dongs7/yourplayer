import React from 'react'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'

const ITEM_HEIGHT = 48;

const MenuList = (props) => {
  const { anchorEl, closeMenu, playlists, actionType, currentPlaylistID } = props
  return(
    <Menu
      id="long-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={()=>closeMenu(null)}
      // onClose={closeMenu}
      PaperProps={{
        style: {
          maxHeight: ITEM_HEIGHT * 4.5,
          minWidth: 200,
        },
      }}
      transformOrigin={ {vertical: 'top', horizontal: 'right'}}
    >
      <Button disabled>
        { actionType === 'add' && `select playlist`}
        { actionType === 'delete' && `select confirm to remove item`}
      </Button>

      {
        actionType === 'add' &&
           playlists &&
            playlists.playlists.items.map(playlist => (
            <MenuItem key={playlist.id}  onClick={()=>closeMenu(playlist.id)}>
              {playlist.title}
            </MenuItem>
            ))
      }
      {
        actionType === 'delete' &&
        <MenuItem onClick={()=>closeMenu(currentPlaylistID)}>
          confirm
        </MenuItem>
      }
    </Menu>
  )
}

export default MenuList
