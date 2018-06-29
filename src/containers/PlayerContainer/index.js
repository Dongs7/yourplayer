import React, { Component } from 'react'

import { connect } from 'react-redux'
import { random } from 'lodash'
import YouTube from 'react-youtube'
import { set_player_status, set_repeat_selector,get_selected_song_info } from 'actions'

import BottomPlayer from './BottomPlayer'

class PlayerController extends Component {
  constructor(props){
    super(props)
    this.state ={
      player : {},
      songDuration : 0,
      currentPosition: 0,
      seekValue : 0,
      isSliderChanged : false,
      repeatCounter : 1,
      isShuffle : false,
      currentTrackIdx : -1,
      loadingTitle : false,
    }

    this.timer = null

    this._handlePlayerReady = this._handlePlayerReady.bind(this)
    // Player control
    this._handlePlayPause = this._handlePlayPause.bind(this)
    this._handleSkip = this._handleSkip.bind(this)
    this._toggleShuffle = this._toggleShuffle.bind(this)
    this._handleRepeat = this._handleRepeat.bind(this)

    this._handlePlayer = this._handlePlayer.bind(this)

    // Handle Player
    this._onPlay = this._onPlay.bind(this)
    this._onPause = this._onPause.bind(this)
    this._onStateChange = this._onStateChange.bind(this)
    this._sliderChangeStart = this._sliderChangeStart.bind(this)
    this._sliderChanging = this._sliderChanging.bind(this)
    this._sliderChangeEnd = this._sliderChangeEnd.bind(this)
    this._handleRepeat = this._handleRepeat.bind(this)
    this._getTrack = this._getTrack.bind(this)


  }

  _sliderChangeStart = () => {
    this.setState({ isSliderChanged : true })
  }

  _sliderChanging(value){
    if (this.state.isSliderChanged) {
      this.setState({ seekValue: value })
    }
  }

  _sliderChangeEnd = () => {
    const { isSliderChanged, player, seekValue  } = this.state
    if (isSliderChanged){
      player.seekTo(seekValue)
    }
    else{
      this.setState({ seekValue: 0 })
    }
    setTimeout(()=>{
      this.setState({ isSliderChanged : false })
    }, 1200)
  }

  _handleRepeat = () => {
    let counter = this.state.repeatCounter
    counter = counter !== 3 ? counter + 1 : 1
    this.setState({ repeatCounter: counter})
    this.props.set_repeat_selector(counter)
  }



  // when youtube player is ready,
  // set player state to youtube player
  _handlePlayerReady = (e) => {
    this.setState({ player : e.target})
  }

  // Handle player state (play or pause)
  _handlePlayPause = (value) => {
    // console.log("play / pause button pressed")
    if(this.props.selectedSong.info){
      this.props.set_player_status(value)
      this._handlePlayer()
    }

  }

  _handlePlayer = () => {
    // console.log("handple player called")
    // console.log("check current player status " , this.props.playerStatus)
    if(this.props.playerStatus === 'play'){
      this._onPause()
    }
    else{
        this._onPlay()
    }
  }

  // Handle Skip
  _handleSkip = (type) => {
    // console.log(this.state.isShuffle)
    if(this.props.selectedSong.info){
      if(this.state.isShuffle){
        this._getTrack("shuffle")
      }else{
        this._getTrack(type)
      }
    }
  }

  // Handle Shuffle
  _toggleShuffle = () => {
    // console.log("shuffle button pressed and current song is from " , this.props.selectedSong.songFrom)
    this.setState({ isShuffle : !this.state.isShuffle })
  }

  currentTimer(value){
    this.setState({ currentPosition : value })
  }

  _onPlay = () => {
    const { player } = this.state
    this.setState({ songDuration : player.getDuration() })

    this.timer = setInterval(()=>
                  {this.currentTimer( player.getCurrentTime())}
                  ,100)

    player.playVideo()
  }

  _onPause = () => {
    clearInterval(this.timer)
    this.state.player.pauseVideo()
  }

  // get random number between 0 and 'total' excluding 'exclude'
  getRandomTrackIdx = (total, exclude) => {
    let tempIdx = random(0,total-1)
    if (tempIdx === exclude){
      return this.getRandomTrackIdx(total, exclude)
    }
    return tempIdx
  }

  _getTrack = (type) => {
    const { selectedSong, result } = this.props
    let select_song_from = selectedSong.songFrom
    let select_song_idx = selectedSong.idx
    let targetArray = null, newIdx = 0
    // 1 - search result
    if(select_song_from === 1){
      targetArray = result.searchResults.items
    }
    //playlist
    else{
      targetArray = result.playlistResults.items
    }
    //repeat-all
    if(type === 'all'){
      newIdx = select_song_idx + 1 < targetArray.length ? select_song_idx + 1 : 0
    }
    //shuffle
    else if(type === 'shuffle'){
      newIdx = this.getRandomTrackIdx(targetArray.length, select_song_idx)
    }
    else{
      if(type === 'prev'){
        newIdx = select_song_idx - 1  >= 0 ? select_song_idx - 1 : targetArray.length - 1
      }
      else{
        newIdx = select_song_idx + 1 < targetArray.length ? select_song_idx + 1 : 0
      }
    }

    this.props.get_selected_song_info(targetArray[newIdx], select_song_from, newIdx)
  }



  // 1 - play
  // 2 - pause
  // 3 - buffering
  //-1 - not playing
  // 0 - done
  // 5 - queued
  _onStateChange = (e) => {

    const { repeatCounter, isShuffle } = this.state
    clearInterval(this.timer)
    // video cued, ready to play
    if(e.data === 5){
      //guess it works better to play the video after 800ms second after the video is cued
      setTimeout(()=>{
        this._onPlay()
      },800)
    }
    // when playback is done
    else if(e.data === 0){
      // console.log("ZERO!")
      if(repeatCounter === 1){
        this.props.set_player_status('done')
      }
      else if(repeatCounter === 2){
        this._onPlay()
      }
      else{
        // if shuffle is off, repeat all
        if(!isShuffle){
          this._getTrack('all')
        }
        else{
          this.setState({ repeatCounter : 1})
        }
      }
      if(isShuffle === true){
        // shuffle
        // console.log("isshuffle")
        this.props.set_player_status('done')
        this._getTrack('shuffle')
      }
      else {
        this.props.set_player_status('done')
      }
    }
    else if(e.data === 3 || e.data === -1){
      this.setState({ loadingTitle : true })
    }

    // playing...
    else if(e.data === 1){
      this.props.set_player_status('play')
      this.setState({ loadingTitle : false })
    }
  }


  componentDidUpdate = (prevProps) => {
    const { selectedSong } = prevProps

    if(selectedSong.info !== this.props.selectedSong.info){
      this.props.set_player_status('done')
      clearInterval(this.timer)
      this.setState({ currentPosition : 0 })
    }
  }

  render(){

    const { playerStatus, selectedSong } = this.props
    const { currentPosition, songDuration, isSliderChanged, seekValue, repeatCounter, isShuffle, loadingTitle } = this.state
    const opts = {
      width:10,
      height:1,
      playerVars: {
        autoplay: 0,
        fs:1,
        playsinline:1,
      },
    }
    return(
      <div>
        <BottomPlayer
          handlePlayPause = {this._handlePlayPause}
          handleSkip = {this._handleSkip}
          toggleShuffle = {this._toggleShuffle}
          handleRepeat = {this._handleRepeat}
          playerStatus = { playerStatus }
          playingSong = { selectedSong.info }
          currentPosition = { currentPosition }
          songDuration = { songDuration }
          sliderChangeStart ={ this._sliderChangeStart}
          sliderChanging = { this._sliderChanging }
          valueWhileChanging = { seekValue }
          sliderChangeEnd ={ this._sliderChangeEnd}
          sliderState = { isSliderChanged }
          repeatCounter = { repeatCounter }
          shuffleStatus = { isShuffle }

          loadingTitle = { loadingTitle }
          />
        <YouTube
          opts = { opts }
          videoId = {selectedSong.info ? selectedSong.info.videoId : null}
          onReady = { this._handlePlayerReady }
          onPlay = { this._onPlay }
          onPause = { this._onPause }
          onStateChange = { this._onStateChange}
          />

      </div>
    )
  }
}

const mapStateToProps = state => {
  return{
    playerStatus : state.playerStatus,
    selectedSong : state.selectedSong,
    result : state.result
  }
}

const mapDispatchToState = { set_player_status, set_repeat_selector,get_selected_song_info }

export default connect(mapStateToProps, mapDispatchToState )(PlayerController)
