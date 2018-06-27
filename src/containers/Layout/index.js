import React, { Component } from 'react'
import classNames from 'classnames'

// Redux
import { connect } from 'react-redux'

//react-router
import { withRouter } from 'react-router'

// Actions
import { set_userinfo,
         create_playlist,
         create_user,
         get_user_playlists,
         delete_playlist,
         fetch_playlistItems,

       } from 'actions'

//Helper
import { auth } from 'config'
import { initScript, googleSignIn, googleSignOut } from 'helper'
import some from 'lodash/some'
// Material-UI Components
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'

// Icon
import PlaylistIcon from '@material-ui/icons/QueueMusic'
import BackIcon  from '@material-ui/icons/ArrowBack'


// Components
import AuthButton from './AuthButton'
import LogoutPopper from './LogoutPopper'
import SideMenu from 'components/SideMenu'
import CreateModal from 'components/CreateModal'

// Containers
import PlayerContainer from 'containers/PlayerContainer'
import SearchContainer from 'containers/SearchContainer'

const drawerWidth = 320;
const playerHeight = 120;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflowScrolling: 'touch',
    position: 'relative',
    display: 'flex',
    width: '100%',
    background: '#222',
  },
  justifyStart: {
    justifyContent:'flex-start'
  },
  justifyCenter: {
    justifyContent:'center'
  },
  justifyEnd: {
    justifyContent:'flex-end'
  },

  sideGrow: {
    flexGrow : 1,
    display:'flex',
    alignItems:'center'
  },
  centerGrow: {
    flexGrow : 2,
    display:'flex',
    justifyContent:'center',
  },
  appBar: {
    position:'fixed',
    background:'#333',
    zIndex: theme.zIndex.drawer + 1,
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      visibility:'hidden',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    height:'100vh',
    background:'#222',
    [theme.breakpoints.up('md')]: {
      position:'fixed',
      height:`calc(100vh - ${playerHeight}px)`,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  content_main : {
    marginBottom:`${playerHeight}px`,
    backgroundColor: '#222',
    minWidth : 0,
    [theme.breakpoints.up('md')]: {
      marginLeft : `${drawerWidth}px`,
    },
  },
  content_drawer : {
    backgroundColor: '#222',
    [theme.breakpoints.up('md')]: {
      height:`calc(100vh - ${playerHeight}px)`,
    },
  },
  bottom_player :{
    position:'fixed',
    bottom:0,
    width:'100%',
    background:'#333',
    height: playerHeight,
  },
  sideCloseIcon: {
    display:'flex',
    justifyContent:'flex-end',

  }
})


class Layout extends Component {
  constructor(props){
    super(props)

    this.state = {
      // player : null,
      sidebarHidden : false,
      mobileOpen : false,
      popperOpen : false,
      expandListMenu : false,
      modalOpen : false,
      modalAction : '',
      selectedPlaylistTobeRemoved : {},
      futurePLname : '',
      createError : {}
    }

    this._handleDrawerToggle = this._handleDrawerToggle.bind(this)
    this._handleSignIn = this._handleSignIn.bind(this)
    this._openPopper = this._openPopper.bind(this)
    this._closePopper = this._closePopper.bind(this)
    this._toggleListMenu = this._toggleListMenu.bind(this)
    this._requestOpenModal = this._requestOpenModal.bind(this)
    this._createPlaylist = this._createPlaylist.bind(this)
    this._deletePlaylist = this._deletePlaylist.bind(this)

    this._confirmAction = this._confirmAction.bind(this)

    this._closeModal = this._closeModal.bind(this)
    this._checkPLname = this._checkPLname.bind(this)
    this._resetAll = this._resetAll.bind(this)

    this._getPlaylistItems = this._getPlaylistItems.bind(this)

  }

  // reset everything when sign out
  _resetAll = () => {
    this.setState({ modalOpen : false })
    this.setState({ expandListMenu : false })
    this.setState({ futurePLname : '' })
    this.setState({ modalAction : '' })
    this.props.history.replace('/')
  }

  // Auth Popper
  _openPopper = () => {
    this.setState({ popperOpen : true })
  }

  _closePopper = (signout) => {
    // console.log("LOGOUT Popper clicked.")
    this.setState({ popperOpen : false })
    if(signout === 123){
      this._handleSignOut(this.props.userState.userData.uid)
    }
  }

  // Open Modal for each types
  // Type = delete, create
  _requestOpenModal = (type, listInfo) => {
    // console.log("Request Modal open")
    this.setState({ modalOpen : true })
    this.setState({ modalAction : type})
    if(type === 'delete' || type === 'modify'){
      this.setState({ selectedPlaylistTobeRemoved : listInfo})
    }
  }

  // Determine which menu content will open
  _confirmAction = (action) => {
    if(action === 'create'){
      this._createPlaylist()
    }else{
      this._deletePlaylist()
    }
  }

  _createPlaylist = () =>{
    const { userState, playlists } = this.props
    const { futurePLname } = this.state
    let isFirst = false

    // check if this is the first playlist for this user
    if(playlists === null){
      isFirst = true
    }

    // Check if the input is not empty
    // throw warning msg if empty
    if(futurePLname !== ''){
      this.props.create_playlist(userState.userData.uid, futurePLname, isFirst)
    }else{
      this.setState({ createError : {error : true, msg: "Playlist Name cannot be empty"} })
    }
  }

  _deletePlaylist = () => {
    const { userState } = this.props
    const { selectedPlaylistTobeRemoved } = this.state
    this.props.delete_playlist(userState.userData.uid, selectedPlaylistTobeRemoved.id)

    // if the playlist is removed when the user is in the playlist,
    // redirect the user to the main search page
    if(this.props.match.params.playlistId === selectedPlaylistTobeRemoved){
      this.props.history.replace('/')
    }

  }


  // Reset action/error states if the modal is closed by user,
  _closeModal = () => {
    this.setState({ modalOpen : false })
    // this.setState({ selectedPlaylistTobeRemoved : {} })
    this.setState({ modalAction : '' })
    this.setState({ createError : {} })
  }

  // Drawer Handler
  _handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  }

  // Handler for playlist expansion menu on sidebar
  _toggleListMenu = () => {
    this.setState({ expandListMenu : !this.state.expandListMenu })
  }


  // Check if the playlist name user entered is duplicate
  _checkPLname = (e) => {
    let name = e.target.value
    this.setState({ futurePLname : name})
    if(name !== ''){
      if(this.props.playlists){
        if(some(this.props.playlists.playlists.items, {title:name})){
          this.setState({ createError : {error : true, msg: "Playlist Name already exists"} })
        }else{
          this.setState({ createError : {} })
        }
      }
    }
  }

  // Get items of this playlist ID
  _getPlaylistItems = (playlistID) => {
    const { userState } = this.props
    // check if there's a listener for the playlist previously visited
    if(this.props.playlistRemover !== null){
      // console.log("We have a unclosed listener")
      Promise.resolve(this.props.playlistRemover())
        .then((res)=>{
          // console.log("We removed the listener, move to the next requested playlist")
          this.props.fetch_playlistItems(userState.userData.uid, playlistID)
        })
        .catch((err)=>{
          // console.log("resolve err ", err)
        })
    }
    // There is a no unclosed listener, move to the requested playlist
    else{
      this.props.fetch_playlistItems(userState.userData.uid, playlistID)
    }
    this.setState({ mobileOpen: false });
  }

  // Sign-in Handler
  _handleSignIn = () => {
    googleSignIn()
      .then((res)=>{
        // console.log("signin success")
      })
      .catch((err)=>{
        // console.log("signin err ", err)
      })
  }

  _handleSignOut = (userID) => {
    const { playlistRemover, playlistsRemover } = this.props
    // Check removers if exist,
    let listRemover = playlistRemover ? playlistRemover : null
    let listsRemover = playlistsRemover ? playlistsRemover : null

    // if there is an un-detached listener for the playlist,
    //  detach all listeners first before sign out
    if(listRemover !== null){
      Promise.all([listRemover(),listsRemover()])
      .then(()=>{
        // console.log("no open listeners , sign out")
        googleSignOut()
        .then((res)=>{
            if(res){
              this.props.set_userinfo(null, false)
              this._resetAll()
            }
          })
      })
    }
    else{
      Promise.resolve(listsRemover())
      .then(()=>{
        // console.log("no open listeners , sign out")
        googleSignOut()
        .then((res)=>{
            if(res){
              this.props.set_userinfo(null, false)
              this._resetAll()
            }
          })
      })
    }
  }

  // Check error while creating / loading playlist
  componentDidUpdate = (prevProps) => {
    if(prevProps.loading.play_list){
      if(prevProps.loading.play_list !== this.props.loading.play_list) {
        if(this.props.loading.code === 0){
          this.setState({ createError : {} })
          this.setState({ modalOpen : false })
        }else{
          this.setState({ createError : {error : true, msg : this.props.loading.msg} })
        }
      }
    }
  }

  componentDidMount = () => {
    initScript()
      .then((res)=>{
        // console.log("script init ", res)
        if(res){
          this.authenticate = auth().onAuthStateChanged((user)=>{
                                if(user){
                                  // console.log("firebase user exists, ")
                                  this.props.set_userinfo(user,true)
                                  // check if this user info exists in the debug
                                  // If not, create a new user
                                  this.props.create_user(user.uid)
                                    .then((res)=>{
                                      if(res){
                                        this.props.get_user_playlists(user.uid)
                                      }
                                    })
                                    .catch((err)=>{
                                      // console.log("error creating user")
                                    })
                                }else{
                                  // console.log("No user found or no user signed in")
                                }
                              })
        }
      })
      .catch((err)=>{
        // console.log("script load err ", err)
      })
  }


  componentWillUnmount = () => {
    this.authenticate()
  }

  render(){
    const { classes, userState, playlists } = this.props
    const { popperOpen, expandListMenu, modalOpen, modalAction, selectedPlaylistTobeRemoved, createError } = this.state

    const drawer = (
      <div className={classNames(classes.content, classes.content_drawer)}>
        <div className={classes.toolbar}>
          <div className={classes.sideCloseIcon}>
            <IconButton color="secondary" onClick={this._handleDrawerToggle}>
              <BackIcon />
            </IconButton>
          </div>

        </div>
        <SideMenu
          expandListMenu = { expandListMenu }
          toggleList = { this._toggleListMenu }
          user = { userState }
          openModal = { this._requestOpenModal }
          playlists = { playlists }
          getItems = { this._getPlaylistItems }
        />
      </div>
    )

    return(
      // Drawer
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <div className={classNames(classes.sideGrow, classes.justifyStart)}>
              <Hidden smDown implementation="css" >
                <Typography variant="title">
                  YourPlayer
                </Typography>
              </Hidden>

              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this._handleDrawerToggle}
                className={classes.navIconHide}
              >
                <PlaylistIcon />
              </IconButton>
            </div>

            <div className={classNames(classes.sideGrow, classes.justifyCenter)}>
              <SearchContainer />
            </div>

            <div className={classNames(classes.sideGrow, classes.justifyEnd)}>
              {
                userState.authenticate ?
                  <LogoutPopper
                    user = { userState }
                    open = { popperOpen}
                    handleClose = { this._closePopper }
                    >
                    <AuthButton
                      user = { userState }
                      loginHandler = { this._openPopper }
                    />
                  </LogoutPopper>
                :
                  <AuthButton
                    loginHandler = { this._handleSignIn }
                  />
              }
            </div>
          </Toolbar>
        </AppBar>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor="left"
            open={this.state.mobileOpen}
            onClose={this._handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <main className={classNames(classes.content, classes.content_main)}>
          <div className={classes.toolbar} />
          {this.props.children}
        </main>

        {/* Custom Player Controller */}
        <div className={classes.bottom_player}>
          <PlayerContainer />
        </div>
        <CreateModal
          modalOpen = { modalOpen }
          modalClose = { this._closeModal }
          playlistNameCheck = { this._checkPLname }
          confirmModalAction = { this._confirmAction }
          action = { modalAction }
          playlistInfo = { selectedPlaylistTobeRemoved }
          createError = { createError }
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    userState : state.userState,
    result : state.result,
    playlists : state.playlists,
    currentPlaylistID : state.currentPlaylistID,
    playlistsRemover : state.playlistsRemover,
    playlistRemover : state.playlistRemover,
    loading : state.loading
  }
}

const mapDispatchToState = { set_userinfo,
                             create_playlist,
                             create_user,
                             get_user_playlists,
                             delete_playlist,
                             fetch_playlistItems,

                            }

export default withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToState)(Layout)))
