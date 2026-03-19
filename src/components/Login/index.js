import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showPassword: false,
    errorMsg: '',
    showError: false,
  }

  componentDidMount() {}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onToggleShowPassword = () => {
    this.setState(prev => ({showPassword: !prev.showPassword}))
  }

  onLoginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onLoginFailure = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showPassword, showError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo-container">
            <img
              src="https://image2url.com/r2/default/images/1773869549469-c4fa2a6a-0233-4a10-b5c5-6e7c02247449.png"
              alt="login website logo"
              className="login-logo"
            />
            <p className="login-tagline">Fresh groceries, delivered fast</p>
          </div>

          <h1 className="login-title">Welcome Back</h1>

          <form onSubmit={this.onSubmitForm}>
            <div className="login-form-group">
              <label htmlFor="username" className="login-label">
                USERNAME
              </label>
              <input
                id="username"
                type="text"
                className="login-input"
                placeholder="Enter your username"
                value={username}
                onChange={this.onChangeUsername}
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password" className="login-label">
                PASSWORD
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder="Enter your password"
                value={password}
                onChange={this.onChangePassword}
              />
            </div>

            <div className="show-password-row">
              <input
                id="showPassword"
                type="checkbox"
                className="show-password-checkbox"
                checked={showPassword}
                onChange={this.onToggleShowPassword}
              />
              <label htmlFor="showPassword" className="show-password-label">
                Show Password
              </label>
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>

            {showError && (
              <p className="login-error-msg">*{errorMsg}</p>
            )}
          </form>
        </div>
      </div>
    )
  }
}

export default Login