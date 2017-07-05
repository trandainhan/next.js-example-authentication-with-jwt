import React, { Component } from 'react'
import Link from 'next/link'
import Router from 'next/router'
import Head from 'next/head'
import axios from 'axios'

import Header from '../components/Header'
import { setCookie } from '../utils/CookieUtils'

const BASE_URL = "http://localhost:3000"

class NewNoteBook extends Component {
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
      const res = await axios.post(BASE_URL + '/authenticate', this.state)
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
    const loginable = username && password
    return (
      <div style={styles.login}>
        <p htmlFor="username">{errorMessage}</p>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            className='form-control'
            type="text"
            value={username}
            onChange={this.changeUsername}
          />
        </div>
        <div className="form-group">
          <label htmlFor="pwd">Password:</label>
          <input
            className='form-control'
            type="password"
            value={password}
            onChange={this.changePassword}
          />
        </div>
        <button
          className='btn btn-default'
          style={styles.button}
          onClick={this.login}
        >
          Login
        </button>
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
    marginRight: '10px'
  }
}

export default NewNoteBook
