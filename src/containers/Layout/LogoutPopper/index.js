import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import { Manager, Target, Popper } from 'react-popper'

import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import Button from '@material-ui/core/Button'

const styles = theme => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing.unit * 2,
  },
  popperClose: {
    pointerEvents: 'none',
  },
});

const LogoutPopper = (props) => {
  const { classes, open, handleClose, user } = props
  return(
    <Manager>
          <Target>
            <div
              ref={node => {
                this.target1 = node;
              }}
              >
              {props.children}
            </div>
          </Target>
          <Popper
            placement="bottom-start"
            eventsEnabled={open}
            className={classNames({ [classes.popperClose]: !open })}
          >
            {
              open &&
              <ClickAwayListener onClickAway={handleClose}>
                <Grow in={open} id="menu-list-grow" style={{ transformOrigin: '0 0 0' }}>
                  <Paper>
                    <Button fullWidth disabled>HI! {user.userData.displayName}</Button>
                    <MenuList role="menu">
                      <MenuItem onClick={()=>handleClose(123) }>LOGOUT</MenuItem>
                    </MenuList>
                  </Paper>
                </Grow>
              </ClickAwayListener>
            }

          </Popper>
        </Manager>
  )
}

export default withStyles(styles)(LogoutPopper);
