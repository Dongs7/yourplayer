import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Hidden from '@material-ui/core/Hidden'

import { convert_duration,convert_title, convert_playlist} from 'helper'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PlaylistAddIcon  from '@material-ui/icons/PlaylistAdd'
import AddIcon  from '@material-ui/icons/Add'
import BackIcon  from '@material-ui/icons/ArrowBack'
import ItemRemoveIcon  from '@material-ui/icons/RemoveCircleOutline'
import PlayingIcon  from '@material-ui/icons/VolumeUp'
import DeleteIcon from '@material-ui/icons/DeleteForever'

import MenuList from 'components/MenuList'
import SnackBar from 'components/SnackBar'

const styles = theme => ({
  root: {
    '& div#no_result':{
       width:`100%`,
       height:'calc(100vh - 280px)',
       display:'flex',
       justifyContent:'center',
       alignItems:'center',
       flexDirection:'column',
       flexGrow:1,
       overflow:'hidden'
    }
  },
  toolbar: theme.mixins.toolbar,
  flex1: {
    flexGrow:1,
    flex:'0 1 auto',
  },
  flex2: {
    flex:'1 0 0',
    flexGrow:5,
    // color:'#fff',
    marginLeft:theme.spacing.unit*2,
    [theme.breakpoints.down('xs')]:{
      marginLeft:0
    },
    // border:'1px solid red',
  },
  title_divider: {
    borderBottom:'4px solid #aaa'
  },
  item_divider: {
    borderBottom:'1px solid #aaa'
  },
  fixedTitle: {
    position:'fixed',
    backgroundColor:'#333',
    width:`calc(100% - ${theme.spacing.unit*6 + 320}px)`,
    // marginTop:-30,
    zIndex : 1,
    [theme.breakpoints.down('sm')]:{
      width:`calc(100% - ${theme.spacing.unit*6}px)`,
    }
  },
   add_title: {
      left:'auto',
      right:0,
      border:'1px solid red',
      width:50,
      [theme.breakpoints.up('xs')]:{
        left:50,
        right:'auto'
      }
   },
   status_title : {
     left:0,
     right:0,
     border:'1px solid blue',
     width:50
   },
   hidden_icon: {
     visibility:'hidden'
   },
   header_root: {
     height:300,
     fontSize:40,
     display:'flex',
     flexDirection:'column',
     justifyContent:'center'
   },
   secondary_right:{
     right:25,
     flexGrow:'1', display:'flex'
   },
   icon_inherit:{
     color:'#ddd'
   },

   selected : {
    backgroundColor : '#666'
  },

})

const DisplayResult = (props) => {
  const { classes,
          result,
          fixedTitle,
          handleFetchMore,
          playlists,
          getSongInfo,
          selectSong,
          closeMenu,
          menuTarget,
          match,
          history,
          loading,
          playingSong,
          menuActionType,
          currentPlaylistID,
          currentDisplay,

          snackbar,
          closeSnackbar,
          snackbarContent,
          // third,
          // anchorHeight,

        } = props
  let items = match.path === '/' ? result.searchResults.items : result.playlistResults.items
  return(
    <div className={classes.root}>
      {
        match.path !== '/' &&
          <div id="playlist_header" className={classes.header_root}>
            <IconButton color="secondary" onClick={()=>history.replace('/')}>
              <BackIcon />
            </IconButton>

            <Typography variant="display2" align="center">
              PLAYLIST :: {convert_playlist(match.params.playlistId)}
            </Typography>

            <Typography variant="title" align="center">
              TOTAL SONGS : {items ? items.length : 0 }
            </Typography>
          </div>
      }
      {
        items ?
        <div >
            {/* <div className={classes.toolbar} ref={third}> */}
            <div className={classes.toolbar}>
              <List
                component="div"
                className={classNames(classes.title,{[classes.fixedTitle] : fixedTitle })}
                >
                <ListItem
                  divider
                  classes={{ divider : classes.title_divider}}
                  >

                  <ListItemIcon>
                    <AddIcon className={classes.hidden_icon}/>
                  </ListItemIcon>


                  <ListItemText primary="TITLE" className={classes.flex2} />

                  <Hidden xsDown implementation="css" className={classes.flex1}>
                      <ListItemIcon >
                        <FontAwesomeIcon icon={['fal','clock']} size="lg"/>
                      </ListItemIcon>
                  </Hidden>


                  <ListItemSecondaryAction
                    classes={{ root: classes.secondary_right}}
                    >
                    <IconButton aria-label="playlist" color="inherit" classes={{ colorInherit: classes.icon_inherit}} >
                      {match.path === '/' ? <PlaylistAddIcon />: <DeleteIcon />}
                    </IconButton>
                  </ListItemSecondaryAction>

                </ListItem>
              </List>
            </div>

            <div>
              <List>
                {
                  items.map((item,idx)=>{
                      let songInfo = {
                          title : item.title,
                          duration : item.duration,
                          videoId : item.videoId
                        }
                    return(
                      <div key={idx}>
                        <ListItem
                          key={item.videoId}
                          divider
                          button
                          className={classNames({[classes.selected] : (playingSong && playingSong.videoId === songInfo.videoId)})}
                          classes={{ divider: classes.item_divider}}
                        >
                          <ListItemIcon>
                            {playingSong && playingSong.videoId === songInfo.videoId ? <PlayingIcon /> : <AddIcon className={classes.hidden_icon}/>}
                          </ListItemIcon>

                          {/* <Hidden xsDown implementation="css">
                            {
                              match.path === '/' ?
                                  <ListItemIcon onClick={ (e) => getSongInfo(e,songInfo,'add') }>
                                    <AddIcon  />
                                  </ListItemIcon>
                                  :
                                  <ListItemIcon onClick={ (e) => getSongInfo(e,songInfo,'delete') }>
                                    <ItemRemoveIcon  />
                                  </ListItemIcon>
                            }
                          </Hidden> */}

                          <ListItemText
                              disableTypography
                              className={classes.flex2}
                              onClick={ () => selectSong(item, currentDisplay, idx)}
                              // secondary={convert_duration(item.duration)}
                          >
                            <Typography noWrap >
                              {convert_title(item.title)}
                            </Typography>
                          </ListItemText>



                          <Hidden xsDown implementation="css">
                              <ListItemText disableTypography className={classes.flex1}>
                                <Typography noWrap >
                                  {convert_duration(item.duration)}
                                </Typography>
                              </ListItemText>
                          </Hidden>

                          <div className={classes.flex1}>
                            <ListItemSecondaryAction
                              onClick={match.path === '/' ?  (e) => getSongInfo(e,songInfo,'add') : (e) => getSongInfo(e,songInfo,'delete')}
                              classes={{ root: classes.secondary_right}}
                              >
                              <IconButton aria-label="Comments" color="secondary" >
                                {match.path === '/' ? <AddIcon /> : <ItemRemoveIcon />}
                              </IconButton>
                            </ListItemSecondaryAction>
                          </div>
                        </ListItem>

                      </div>
                    )
                  })
                }
              </List>
            </div>
          {
            match.path === '/' &&
            result.searchResults.nextToken &&
            <Button
              fullWidth
              variant="raised"
              color="primary"
              onClick={()=>handleFetchMore(result.searchResults.nextToken) }>
              <Typography color="inherit">
                {!loading.search_list ? `More result` : <FontAwesomeIcon icon={['fal','spinner']} spin/>}
              </Typography>
            </Button>
          }
        </div>
        :
        <div id="no_result" className={classes.no_result_wrapper}>
            {
              match.path === '/' &&
                <Typography variant="display2" color="default" component="div">
                  No search results!
                </Typography>
            }
          </div>
      }
      <MenuList
        anchorEl = { menuTarget }
        closeMenu = { closeMenu }
        playlists = { playlists }
        actionType = { menuActionType }
        currentPlaylistID = { currentPlaylistID }
        />
      {
        snackbar &&
        <SnackBar
          snackbar = { snackbar}
          closeSnackbar = { closeSnackbar }
          snackbarContent={ snackbarContent }
        />
      }
    </div>
  )
}

export default withStyles(styles)(DisplayResult)
