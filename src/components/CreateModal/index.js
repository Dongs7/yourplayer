import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import Button from '@material-ui/core/Button'

//test comp
import Search from 'components/Search'


const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: '#ddd',
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    top:'50%',
    left:'50%',
    transform:'translate(-50%,-50%)'
  },
  margin:{
    margin:theme.spacing.unit
  },
  testing : {
    color:'red'
  }
})

const CreateModal = (props) => {
  const { classes,
          modalOpen,
          modalClose,
          playlistNameCheck,
          confirmModalAction,
          action,
          playlistInfo,
          createError
        } = props
  return(
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={modalOpen}
      onClose={modalClose}
    >
      <div className={classes.paper}>
        <Typography variant="title" id="modal-title" color="primary">
          { action === 'create' && 'create a new playlist' }
          { action === 'delete' && 'delete playlist' }
        </Typography>

        {
          action === 'create' &&
          <Search
            handleInput = { playlistNameCheck }
            primary="Enter your playlist name"
            color
            createError={ createError }
            />
        }

        {
          action === 'delete' &&
          <Typography variant="subheading" className={classes.margin} component="div" align="center">
            Are you sure you want to delete playlist
            <Typography variant="subheading" color="secondary" align="inherit">
              {playlistInfo.title}
            </Typography>
          </Typography>
        }


        <div style={{ textAlign:'right'}}>
          <Button variant="raised" onClick={ modalClose }> cancel</Button>
          <Button
            variant="raised"
            onClick={ ()=>confirmModalAction(action) }
            color="primary"
            disabled={createError.error ? true : false}
          >
            { action === 'create' && 'create' }
            { action === 'delete' && 'delete' }
          </Button>
        </div>

      </div>
    </Modal>
  )
}

CreateModal.defaultProps ={
    createError : false
}

export default withStyles(styles)(CreateModal);
