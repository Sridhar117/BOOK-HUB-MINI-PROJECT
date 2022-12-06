import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import {Component} from 'react'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', showError: false}

  username = event => {
    this.setState({username: event.target.value})
  }

  password = event => {
    this.setState({password: event.target.value})
  }

  onFailureLogin = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  onSuccessLogin = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onLogin = async event => {
    event.preventDefault()
    const loginUrl = 'https://apis.ccbp.in/login'
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(loginUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSuccessLogin(data.jwt_token)
    } else {
      this.onFailureLogin(data.error_msg)
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    const {showError, errorMsg} = this.state
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="app-container">
        <div>
          <img
            src="https://res.cloudinary.com/dkpxole2a/image/upload/v1669553971/Rectangle_1467_nyniyx.png"
            alt="website login"
            className="book-image"
          />
        </div>
        <div>
          <img
            src="https://res.cloudinary.com/dkpxole2a/image/upload/v1669562068/Book%20Hub%20heading.png"
            alt="login website logo"
            className="logo"
          />

          <form className="form-container" onSubmit={this.onLogin}>
            <label htmlFor="username">Username*</label>
            <input
              type="text"
              id="username"
              className="input-element"
              onChange={this.username}
            />
            <label htmlFor="password">Password*</label>
            <input
              type="password"
              id="password"
              className="input-element"
              onChange={this.password}
            />
            <button type="submit" className="login-button">
              Login
            </button>
            {showError && <p className="error-msg">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
