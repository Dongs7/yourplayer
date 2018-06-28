import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import WarningIcon from '@material-ui/icons/Warning'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import green from '@material-ui/core/colors/green'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import classNames from 'classnames'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
}

const styles1 = theme => ({
  success: {
    backgroundColor: green[600],
  },
  warning: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
})


const snackCustom = (props) => {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant]

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  )
}

const SnackCustom = withStyles(styles1)(snackCustom);

const SnackBar = (props) => {
  const { snackbar, closeSnackbar, snackbarContent } = props
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={snackbar}
      autoHideDuration={5000}
      onClose={closeSnackbar}
      >
      <SnackCustom
        onClose={closeSnackbar}
        variant={snackbarContent.code === 1 ? "success" : "warning"}
        message={snackbarContent.msg}
      />
    </Snackbar>
  )
}

export default SnackBar
