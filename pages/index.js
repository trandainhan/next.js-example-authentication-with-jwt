import React, { Component } from 'react'
import Router from 'next/router'
import jwtDecode from 'jwt-decode';
import { setCookie, getCookie } from '../utils/CookieUtils'
import axios from 'axios'

export default class Index extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: ''
    }
    this.logout = (e) => this._logout()
    this.testCSRF = (e) => this._testCSRF()

  }
  _logout () {
    setCookie('x-access-token', '')
    Router.push({
      pathname: '/login'
    })
  }
  // Use javascript to get jwt-token in cookies which can only
  // done by JavaScript that runs on your domain can read the cookie
  // You can override axios request config for general solution
  async _testCSRF () {
    const token = getCookie('x-access-token')
    const decoded = jwtDecode(token)
    try {
      const res = await axios.post(window.location.origin + '/api/preventCRSF', {
        example: 'data'
      }, {
        headers: {
          'X-XSRF-TOKEN': decoded.xsrfToken
        }
      })
      if (res.data.success) {
        this.setState({
          message: res.data.message
        })
      }
    } catch (error) {
      this.setState({
        message: error.response.data.message
      })
    }
  }
  render () {
    return (
      <div>
        <h3>Authenticated</h3>
        <div><button onClick={this.logout}>Logout</button></div>
        <br/>
        <div><button onClick={this.testCSRF}>Access API protected by CSRF</button></div>
        <span>{this.state.message}</span>
      </div>
    )
  }
}
