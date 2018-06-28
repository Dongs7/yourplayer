import React from 'react'

import G_logo from 'assets/google.png'
import { withStyles } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'



const styles = ({
  avatar: {
    // marginLeft : 10,
    width:20,
    height:20
  },
  button : {
    paddingTop :0,
    paddingBottom : 0
  },
  popperClose: {
    pointerEvents: 'none',
  },

})

const AuthButton = (props) => {
  const { classes, user, loginHandler } = props

  // user log in
  return(
    <IconButton onClick = { loginHandler }>
      <Avatar
        className = { classes.avatar }
        alt={user ? user.userData.displayName : 'Google Sign in'}
        src={user ? user.userData.photoURL : G_logo}
        />
    </IconButton>

  )
}



AuthButton.defaultProps = {
  user : false
}

export default withStyles(styles)(AuthButton)
