import React, { Component } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import Head from 'next/head'
import axios from 'axios'
import { setCookie } from '../utils/CookieUtils'

class Login extends Component {
  constructor (props) {
    super(props)
    this.state = {
      username: 'test',
      password: 'test',
      errorMessage: ''
    }
    this.changeUsername = e => this._changeUsername(e.target.value)
    this.changePassword = e => this._changePassword(e.target.value)
    this.login = e => this._login()
  }
  _changeUsername (value) {
    this.setState({
      username: value
    })
  }
  _changePassword (value) {
    this.setState({
      password: value
    })
  }
  async _login () {
    const { username, password } = this.state
    if (!username || !password) return
    try {
      const res = await axios.post(window.location.origin + '/authenticate', this.state)
      if (res.data.success) {
        setCookie('x-access-token', res.data.token)
        Router.push({
          pathname: '/'
        })
      }
    } catch (error) {
      this.setState({
        errorMessage: error.response.data.message
      })
    }
  }
  render () {
    const { username, password , errorMessage } = this.state
    return (
      <div style={styles.login}>
        <div style={styles.user}>
          <div>Username: (test)</div>
          <input
            type="text"
            value={username}
            onChange={this.changeUsername}
          />
        </div>
        <div style={styles.password}>
          <div>Password: (test)</div>
          <input
            type="password"
            value={password}
            onChange={this.changePassword}
          />
        </div>
        <button
          style={styles.button}
          onClick={this.login}
        >
          Login
        </button>
        <p style={{color: 'red'}}>{errorMessage}</p>
        <h3>You can not access index page without login</h3>
        <h3>You can try by changing the url</h3>
      </div>
    )
  }
}

const styles = {
  login: {
    width: '50%',
    margin: 'auto',
    marginTop: '20px'
  },
  button: {
    marginTop: '10px',
  },
  user: {
    marginTop: '10px'
  },
  password: {
    marginTop: '10px'
  }
}

export default Login
