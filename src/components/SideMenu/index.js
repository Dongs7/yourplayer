import React from 'react'

import { withStyles } from '@material-ui/core/styles'

import { NavLink } from 'react-router-dom'

import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'

import PlaylistIcon from '@material-ui/icons/PlaylistPlay'

import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import ErrorIcon from '@material-ui/icons/ErrorOutline'
import ItemRemoveIcon  from '@material-ui/icons/RemoveCircleOutline'


const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  small_icon:{
    width:30,
    height:30,
    marginRight:18
  },
  margin: {
    margin: theme.spacing.unit * 2,
  },
  divider:{
    borderBottom: `1px solid #666`,
  },
  listitem_bg :{
    backgroundColor:'#222',
    color:'#ddd'
  }
});

const SideMenu =(props) => {
  const { classes,
          expandListMenu, // sidemenu expansion list state
          toggleList,     // toggle expansion list (open, close)
          user,           // current user state
          openModal,      // open modal when the user clicks the create button (name needs to be changed)
          playlists,      // current user's playlist info
          getItems,
        } = props
  return(
    <div className={classes.root}>
        <List
          classes={{ root: classes.listitem_bg}}
          component="nav"
          subheader={
                      <ListSubheader component="div">
                        {
                          user.authenticate ?
                          `Hi! ${user.userData.displayName}`
                          :
                          `Please Log in to use playlist`
                        }
                      </ListSubheader>
                    }
        >

          {/*  First listitem will be updated*/}
          {/* <ListItem
            button
            divider = {user.authenticate ? true : false}
          >
            <ListItemIcon>
              <DraftsIcon />
            </ListItemIcon>
            <ListItemText inset primary="charts..maybe" />
          </ListItem> */}

          {
            user.authenticate &&
            <ListItem
              button
              divider = {expandListMenu ? true : false}
              classes = {{ divider : classes.divider}}
              onClick={ toggleList }
            >
              <ListItemIcon>
                <PlaylistIcon />
              </ListItemIcon>

              <ListItemText inset primary="PLAYLISTS" />
              {expandListMenu ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
          }

          <Collapse in={expandListMenu} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>

              {/* Display user's playlists, none if there is no playlist */}
              {
                playlists ?
                  playlists.playlists.items.map((item,idx)=>{
                    return(
                      <ListItem
                        component={NavLink}
                        to={`/playlist/${item.id}`}
                        button
                        dense
                        className={classes.nested}
                        key={idx}
                        onClick={ ()=> getItems(item.id) }
                      >
                        <ListItemText  primary={item.title} />

                        <ListItemSecondaryAction onClick={()=>openModal('delete', item)}>
                          <IconButton color="inherit">
                            <ItemRemoveIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )
                  })
                :
                <ListItem className={classes.nested}>
                  <ListItemIcon>
                    <ErrorIcon />
                  </ListItemIcon>
                  <ListItemText inset primary="No Playlist" />
                </ListItem>
              }


              {/* Button to open modal */}
              <ListItem >
                <Button
                  fullWidth
                  variant="raised"
                  color="primary"
                  onClick={ ()=>openModal('create') }
                >
                  new playlist
                </Button>
              </ListItem>
            </List>
          </Collapse>
        </List>
      </div>
  )
}

export default withStyles(styles)(SideMenu);
