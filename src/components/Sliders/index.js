import 'rc-slider/assets/index.css'

import React from 'react'
import { withStyles } from '@material-ui/core/styles'

import Slider from 'rc-slider'
import { convert_duration, convert_duration_playing } from 'helper'


const styles = theme =>({
  root: {
    display:'flex',
    flexDirection : 'row'
  },
  time_text : {
    fontSize: 13,
    paddingLeft : 10,
    paddingRight : 10,
    color:'#ddd'
  },
  slider_root : {
    padding: 0
  },
})

const Sliders = (props) => {

  const {
          songDuration,
          classes,
          playingSong,
          currentPosition,
          sliderChanging,
          sliderChangeStart,
          sliderChangeEnd,
          sliderState,
          valueWhileChanging
        } = props

  return (
      <div className={classes.root}>
        <span className={classes.time_text}>
          {
            currentPosition ?
            convert_duration_playing(currentPosition)
            :
            '0:00'
          }
        </span>
        <Slider
          className={classes.slider_root}
          min={0}
          max={songDuration}
          onBeforeChange={ sliderChangeStart }
          onChange={ sliderChanging }
          onAfterChange={ sliderChangeEnd }
          trackStyle={{ backgroundColor: '#bbb', height: 12 }}
          railStyle={{ backgroundColor: '#555', height: 12 }}
          handleStyle={{
            padding:0,
            borderColor: '#fff',
            height: 12,
            width: 12,
            marginLeft: -6,
            marginTop: 0,
            backgroundColor: '#fff',
          }}
          value = {sliderState ?
                   valueWhileChanging
                   :
                   currentPosition > 0 ?
                     Math.floor(currentPosition)
                     :
                     0}
          />
        <span className={classes.time_text}>
          {playingSong ? convert_duration(playingSong.duration) : '0:00'}
        </span>
      </div>

  )
}

export default withStyles(styles)(Sliders)
