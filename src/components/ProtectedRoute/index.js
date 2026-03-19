import {Route, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = ({component: Component, ...rest}) => (
  <Route
    {...rest}
    render={props => {
      const jwtToken = Cookies.get('jwt_token')
      if (jwtToken === undefined) {
        return <Redirect to="/login" />
      }
      return <Component {...props} />
    }}
  />
)

export default ProtectedRoute
