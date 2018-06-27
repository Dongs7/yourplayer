import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import Typography from '@material-ui/core/Typography'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Sliders from 'components/Sliders'
import { convert_title } from 'helper'


const styles = theme => ({
  root: {
    // borderTop:'1px solid #ddd'
  },
  bnRoot : {
    display:'flex',
    width:'100%',
    backgroundColor:'#333'
  },
  bnAction: {
    color:'#888',
    [theme.breakpoints.down("md")]:{
      minWidth:'20%'
    }
  },
  lower_wrapper: {
    height:64,
    display:'flex',
    alignItems:'center',
    flexDirection:'column',
  },
  flex1 : {
    // border:'1px solid red',
    flex:1,
    display:'flex',
    flexDirection:'column',
    justifyContent:'center'
  },
  slider: {
    minWidth:350,
  },
  title_text:{
    color:'#fff'
  }
})

const BottomPlayer = (props) => {
  const { classes,
          handlePlayPause,
          handleSkip,
          toggleShuffle,
          handleRepeat,
          playingSong,

          playerStatus,
          repeatCounter,
          shuffleStatus,

          currentPosition,
          songDuration,
          sliderChangeStart,
          sliderChanging,
          valueWhileChanging,
          sliderChangeEnd,
          sliderState,

        } = props

    return (
      <div className={classes.root}>
        <BottomNavigation className={classes.bnRoot}>
          <BottomNavigationAction
            className={classes.bnAction}
            label="Shuffle"
            onClick= { toggleShuffle }
            icon={<FontAwesomeIcon icon={['fal','random']} size="2x" color={shuffleStatus ? "yellow" : "inherit"}/>}
          />

          <BottomNavigationAction
            className={classes.bnAction}
            label="SkipPrev"
            onClick= { ()=>handleSkip('prev') }
            icon={<FontAwesomeIcon icon={['fal','step-forward']} size="2x" flip="horizontal"/>}
          />

          <BottomNavigationAction
            className={classes.bnAction}
            label="PlayPause"
            onClick= { playerStatus === 'play' ? ()=>handlePlayPause('pause') : ()=>handlePlayPause('play') }
            icon={
              playerStatus === 'play' ? <FontAwesomeIcon icon={['fal','pause']} size="2x"/>
                                      : <FontAwesomeIcon icon={['fal','play']} size="2x"/>

            }
          />

          <BottomNavigationAction
            className={classes.bnAction}
            label="SkipNext"
            onClick= { ()=>handleSkip('next') }
            icon={<FontAwesomeIcon icon={['fal','step-forward']} size="2x"/>}
          />

          <BottomNavigationAction
            className={classes.bnAction}
            label="Repeat"
            onClick= { handleRepeat }
            icon={

                    ((repeatCounter === 1 || repeatCounter === 3) &&
                    <FontAwesomeIcon icon={repeatCounter === 1 ? ['far','repeat-alt'] : ['far','repeat-alt']} size="2x" color={repeatCounter === 3 ? "red" : "inherit"}/>)
                    // <RepeatIcon className={classNames(classes.icons, {[classes.repeatAll] : currentRepeatStatus.all})} onClick={playerRepeatStatus}/>

                     ||

                    (repeatCounter === 2 &&
                    <FontAwesomeIcon icon={['far','repeat-1-alt']} size="2x" color="lightgreen"/>)

                 }
          />
        </BottomNavigation>

        <div id="bottom_lower" className={classes.lower_wrapper}>

          <div className={classNames(classes.slider, classes.flex1)}>
            <Sliders
              playingSong = { playingSong }
              currentPosition = { currentPosition }
              songDuration = { songDuration }
              sliderChangeStart ={ sliderChangeStart}
              sliderChanging = { sliderChanging }
              valueWhileChanging = { valueWhileChanging }
              sliderChangeEnd = { sliderChangeEnd}
              sliderState = { sliderState }
              />
          </div>

          <div className={classes.flex1}>
            <Typography variant="subheading" className={classes.title_text} noWrap>
              {playingSong ? convert_title(playingSong.title) : "Please select a song"}
            </Typography>
          </div>

        </div>
      </div>

    )
  }

BottomPlayer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BottomPlayer);
