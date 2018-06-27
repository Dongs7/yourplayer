import React, { Component } from 'react'

import debounce from 'lodash/debounce'

import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { fetch_data_from_api } from 'actions'

// component
import Search from 'components/Search'

class SearchContainer extends Component {
  constructor(props){
    super(props)
    this.state = {
      currentInputValue : ''
    }

    this._handleInput = this._handleInput.bind(this)
    this._updateTerm = this._updateTerm.bind(this)
  }

  _updateTerm = debounce((term) => {
    this.props.fetch_data_from_api(term)
  },700)

  _handleInput = (e) => {
    this._updateTerm(e.target.value)
  }

  render(){
    return(
      <Search
        handleInput = { this._handleInput }
        history = {this.props.history}
        focus
        primary="Search Artists / Songs"
      />
    )
  }
}

const mapDispatchToState = { fetch_data_from_api }

export default withRouter(connect(null,mapDispatchToState)(SearchContainer))
