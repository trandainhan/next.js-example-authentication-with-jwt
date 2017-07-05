import React, { Component } from 'react'
import Router from 'next/router'
import { setCookie } from '../utils/CookieUtils'

export default class Index extends Component {
  constructor (props) {
    super(props)
    this.logout = (e) => this._logout()
  }
  _logout () {
    setCookie('x-access-token', '')
    Router.push({
      pathname: '/login'
    })
  }
  render () {
    return (
      <div>
        <h3>Authenticated</h3>
        <button onClick={this.logout}>Logout</button>
      </div>
    )
  }
}
