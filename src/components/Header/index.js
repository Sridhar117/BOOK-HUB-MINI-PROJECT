import {withRouter, Link} from 'react-router-dom'
import {Component} from 'react'
import {RiCloseCircleFill} from 'react-icons/ri'
import Cookies from 'js-cookie'

import './index.css'

class Header extends Component {
  state = {displayNavbar: false}

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  onClickMenuButton = () => {
    this.setState(prevState => ({displayNavbar: !prevState.displayNavbar}))
  }

  onClickCrossButton = () => {
    this.setState({displayNavbar: false})
  }

  render() {
    const {displayNavbar} = this.state
    const {home, bookshelves} = this.props
    const activeHome = home ? 'nav-home-component' : 'nav-bookshelves-component'
    const activeBookshelves = bookshelves
      ? 'nav-home-component'
      : 'nav-bookshelves-component'

    return (
      <div>
        <div className="navbar-container">
          <div>
            <Link to="/" className="text-underline-none">
              <img
                src="https://res.cloudinary.com/dkpxole2a/image/upload/v1669562068/Book%20Hub%20heading.png"
                alt="website logo"
                className="logo"
              />
            </Link>
          </div>
          <ul className="nav-components-container nav-items-lg">
            <Link to="/" className="text-underline-none">
              <li>
                <p className={`${activeHome}`}>Home</p>
              </li>
            </Link>
            <Link to="/shelf" className="text-underline-none">
              <li>
                <p className={`${activeBookshelves}`}>Bookshelves</p>
              </li>
            </Link>
            <li>
              <button
                type="button"
                className="logout-button"
                onClick={this.onClickLogout}
              >
                Logout
              </button>
            </li>
          </ul>
          <ul className="nav-options-list navbar-options-list">
            <li>
              <button
                type="button"
                className="cross-icon-btn"
                onClick={this.onClickMenuButton}
              >
                <img
                  src="https://res.cloudinary.com/dkpxole2a/image/upload/v1670342350/icon%20image.png"
                  alt="icon"
                />
              </button>
            </li>
          </ul>
        </div>
        {displayNavbar && (
          <div className="navbar-container">
            <Link to="/" className="text-underline-none">
              <h1 className={`${activeHome}`}>Home</h1>
            </Link>
            <Link to="/shelf" className="text-underline-none">
              <h1 className={`${activeBookshelves}`}>Bookshelves</h1>
            </Link>
            <button
              type="button"
              className="logout-button"
              onClick={this.onClickLogout}
            >
              Logout
            </button>
            <button
              type="button"
              onClick={this.onClickCrossButton}
              className="cross-icon-btn"
            >
              <RiCloseCircleFill className="cross-icon" />
            </button>
          </div>
        )}
      </div>
    )
  }
}

export default withRouter(Header)
