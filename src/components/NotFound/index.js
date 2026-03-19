import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://new-assets.ccbp.in/frontend/react-js/nxt-mart-app/not-found-img.png"
      alt="not found"
      className="not-found-img"
    />
    <h1 className="not-found-title">Page Not Found</h1>
    <p className="not-found-desc">
      We are sorry, the page you requested could not be found.
    </p>
    <Link to="/" className="go-home-btn">
      Go to Home
    </Link>
  </div>
)

export default NotFound
