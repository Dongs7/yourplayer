import React, { Component } from 'react'

import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { fetch_data_from_api, add_song_to_playlist, get_selected_song_info, delete_song_from_playlist, fetch_playlistItems } from 'actions'
import DisplayResult from 'components/DisplayResult'

class DataContainer extends Component {
  constructor(props){
    super(props)

    this.state = {
      fixedTitleSearch : false,
      fixedTitlePlaylist : false,
      menuTarget : null,
      songToBeHandled : null,
      menuActionType : null,
      isRowSelected : false,
      selectedSongIdx : null,
      snackbarOpen : false,
      snackbarContent : {}
    }

    // this.third = React.createRef();

    this._handleFetchMore = this._handleFetchMore.bind(this)
    // this._updateWindowScrollPosition = this._updateWindowScrollPosition.bind(this)
    this._getSongInfo = this._getSongInfo.bind(this)
    this._selectSong = this._selectSong.bind(this)
    this._closeMenu = this._closeMenu.bind(this)
    this._showSnackbar = this._showSnackbar.bind(this)
    this._closeSnackbar = this._closeSnackbar.bind(this)

  }

  // if the nextpagetoken exists, fetch more items
  _handleFetchMore = (token) => {
    this.props.fetch_data_from_api(this.props.currentTerm, token)
  }

  // Scroll update function,
  // _updateWindowScrollPosition = () => {
  //   if(window.pageYOffset >= (this.third.current.offsetTop-58)){
  //     this.setState({ fixedTitle : true })
  //   }
  //   else{
  //     this.setState({ fixedTitle : false })
  //   }
  // }

  _closeMenu = (target_playlistID) => {
    const { userState } = this.props
    const { songToBeHandled } = this.state
    this.setState({ menuTarget : null })
    if(target_playlistID === null){
      this.setState({ songToBeHandled : null })
      this.setState({ menuActionType : null })
    }else{
      if(this.state.menuActionType === 'add'){
        this.props.add_song_to_playlist(userState.userData.uid, target_playlistID, songToBeHandled)
      }else{
        this.props.delete_song_from_playlist(userState.userData.uid, target_playlistID, songToBeHandled)
      }

    }
  }

  // After 'ADD' button pressed
  _getSongInfo = (e,info,type) => {
    this.setState({ menuActionType : type })
    this.setState({ songToBeHandled : info })
    this.setState({ menuTarget : e.currentTarget })
  }

  // After list button pressed
  _selectSong = (info, target, idx) => {
    this.setState({ isRowSelected : true })
    this.setState({ selectedSongIdx : idx })
    this.props.get_selected_song_info(info, target, idx)
  }

  //Snackbar handler
  _showSnackbar = (msg,code) => {
    // console.log("snackbar open")
    this.setState({ snackbarOpen : true })
    this.setState({ snackbarContent : {msg : msg, code:code} })
  }

  //Close snackbar
  _closeSnackbar = () => {
    this.setState({ snackbarOpen : false })
  }

  componentDidUpdate = (prevProps) => {
    if(prevProps.loading.add_song === true){
      if(prevProps.loading.add_song !== this.props.loading.add_song){
        this._showSnackbar(this.props.loading.msg, this.props.loading.code)
      }
    }
  }

  componentDidMount = () =>{
    //add scroll event listener
    // window.addEventListener('scroll', this._updateWindowScrollPosition)
  }

  componentWillUnmount = () => {
    //remove scroll event listener
    // window.removeEventListener('scroll', this._updateWindowScrollPosition)
  }

  render(){
    const { result, playlists, match,history, loading, selectedSong, currentPlaylistID } = this.props
    const { fixedTitle,snackbarOpen,snackbarContent, menuTarget, menuActionType,  isRowSelected,selectedSongIdx } = this.state

    let targetDisplaylist = match.path === '/' ? 1 : 2
    return(
          <DisplayResult
            fixedTitle = { fixedTitle }
            result = { result }
            handleFetchMore = { this._handleFetchMore }
            getSongInfo = { this._getSongInfo }
            selectSong = { this._selectSong }
            playlists = { playlists }
            closeMenu = { this._closeMenu }
            menuTarget = { menuTarget }
            match = { match }
            history = { history }
            loading = { loading }
            playingSong = { selectedSong.info }
            currentDisplay = { targetDisplaylist }
            menuActionType = { menuActionType }
            currentPlaylistID = { currentPlaylistID }
            // third = { this.third}
            // anchorHeight = { anchorHeight }
            isSelected = { isRowSelected }
            selectedSongIdx = { selectedSongIdx }
            snackbar = { snackbarOpen }
            snackbarContent = { snackbarContent }
            closeSnackbar = { this._closeSnackbar }
          />
    )
  }
}

const mapStateToProps = state => {
  return{
    userState : state.userState,
    currentTerm : state.currentTerm,
    result : state.result,
    playlists : state.playlists,
    loading : state.loading,
    selectedSong : state.selectedSong,
    currentPlaylistID : state.currentPlaylistID,
    remover : state.remover
  }
}

const mapDispatchToState = { fetch_data_from_api, add_song_to_playlist, get_selected_song_info, delete_song_from_playlist, fetch_playlistItems }

export default withRouter(connect(mapStateToProps,mapDispatchToState)(DataContainer))
