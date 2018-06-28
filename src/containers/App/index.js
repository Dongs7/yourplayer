import React, { Component } from 'react'

import { MuiThemeProvider } from '@material-ui/core/styles'
import { theme } from 'config'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import some from 'lodash/some'


// Layout
import Layout from 'containers/Layout'
// Routes
import Main from 'Routes/Main'
import PlaylistResult from 'Routes/PlaylistResult'
import { hot } from 'react-hot-loader'

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimesCircle,
         faCoffee,
         faRepeatAlt as faRepeatAltReg,
         faRepeat1Alt,
         faRandom,
         faHeadphones,
       } from '@fortawesome/pro-regular-svg-icons'

import { faPlay,
         faPause,
         faRepeatAlt,
         faRandom as faRandomOff,
         faStepForward,
         faPlus,
         faClock,
         faSpinner
       } from '@fortawesome/pro-light-svg-icons'

library.add(faTimesCircle,
            faCoffee,
            faRepeatAltReg,
            faRepeat1Alt,
            faPlay,
            faPause,
            faRepeatAlt,
            faRandom,
            faRandomOff,
            faStepForward,
            faPlus,
            faClock,
            faSpinner,
            faHeadphones
           )

class App extends Component {

  render() {
    const PrivateRoute = ({ component: Component, ...rest }) =>
      (
      <Route {...rest}
             render={(props) => (

        // Is user authenticated?
        this.props.userState.authenticate ?
        // Does this playlist belong to the authenticated user?
          this.props.playlists ?
            some(this.props.playlists.playlists.items, {id:props.match.params.playlistId}) ?
              <Component {...props} auth={props}/>
              :
             <Redirect to="/" />
            :
            <Redirect to='/' />
          :
          <Redirect to='/' />
      )}/>
    )

      return (
          <MuiThemeProvider theme={theme}>
            <Router>
              <Layout>
                <Switch>
                  <Route exact path='/' component={Main} />
                  <PrivateRoute path="/playlist/:playlistId" component={PlaylistResult} />
                </Switch>
              </Layout>
            </Router>
          </MuiThemeProvider>
      );
  }
}

const mapStateToProps = (state) => {
  // console.log(state)
  return{
    userState : state.userState,
    playlists : state.playlists
  }
}

export default hot(module)(connect(mapStateToProps)(App))
