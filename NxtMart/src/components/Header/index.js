import {Link, withRouter, NavLink} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const {history} = props

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  const getCartCount = () => {
    const cartData = localStorage.getItem('cartData')
    if (cartData) {
      return JSON.parse(cartData).length
    }
    return 0
  }

  const cartCount = getCartCount()

  return (
    <nav className="header-container">
      <Link to="/">
        <img
          src="https://image2url.com/r2/default/images/1773869549469-c4fa2a6a-0233-4a10-b5c5-6e7c02247449.png"
          alt="website logo"
          className="header-logo"
        />
      </Link>
      <div className="header-nav">
        <NavLink exact to="/" className="header-nav-link" activeClassName="active">
          Home
        </NavLink>
        <NavLink to="/orders" className="header-nav-link" activeClassName="active">
          Orders
        </NavLink>
        <NavLink to="/cart" className="header-nav-link" activeClassName="active">
          Cart
          {cartCount > 0 && (
            <span className="header-cart-badge">{cartCount}</span>
          )}
        </NavLink>
        <button
          type="button"
          className="header-logout-btn"
          onClick={onClickLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
