import React from 'react'

import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
    minWidth:100,
    width:'100%'
  },
  cssFocused: {},
  cssLabel: {
    color:'#fff',
    '&$cssFocused': {
      color: '#fff',
    },
    fontSize:15
  },
  cssUnderline: {
    '&:before': {
      borderBottomColor: '#fff',
    },
    '&:after': {
      borderBottomColor: '#fff',
    },
  },
  cssInput : {
    color:'#fff'
  },
  blackLabel:{
    color:'#000'
  }
})


const Search = (props) => {
  const { classes, handleInput, focus, history, primary, color, createError } = props
  return(
    <FormControl className={classes.margin} error = { createError.error ? true : false} aria-describedby="error-text">
      <InputLabel
        FormLabelClasses={{
          root: color ? classes.blackLabel : classes.cssLabel,
          focused: color ? classes.blackLabel : classes.cssFocused,
        }}
        htmlFor="termInput"
      >
        {primary}
      </InputLabel>
      <Input
        classes={{
          root : color ? classes.blackLabel : classes.cssInput,
          underline: classes.cssUnderline
        }}
        id="termInput"
        onChange={handleInput}
        onFocus={focus ? ()=>history.replace('/') : null }
        error = { createError.error ? true : false}
      />
      {
        createError.error &&
        <FormHelperText id="error-text">{createError.msg}</FormHelperText>
      }
    </FormControl>
  )
}

Search.propTypes = {
  classes: PropTypes.object.isRequired,
}

Search.defaultProps = {
  focus : false,
  color: false,
  createError : false
}

export default withStyles(styles)(Search)
