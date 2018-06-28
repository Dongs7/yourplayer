import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import CssBaseline from '@material-ui/core/CssBaseline'

import App from 'containers/App'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import rootReducers from 'reducers'

import registerServiceWorker from './registerServiceWorker'

const store = createStore(rootReducers,applyMiddleware(thunk))

ReactDOM.render(
    <React.Fragment>
      <CssBaseline />
      <Provider store = { store }>
        {/* <PersistGate loading={<Test/>} persistor={persistor}> */}
          <App />
        {/* </PersistGate> */}
      </Provider>
    </React.Fragment>
    , document.getElementById('root'));
  registerServiceWorker();
