import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

class Cart extends Component {
  state = {
    cartItems: [],
    isOrderPlaced: false,
  }

  componentDidMount() {
    this.loadCart()
  }

  loadCart = () => {
    const cartData = localStorage.getItem('cartData')
    if (cartData) {
      this.setState({cartItems: JSON.parse(cartData)})
    }
  }

  saveCart = cartItems => {
    localStorage.setItem('cartData', JSON.stringify(cartItems))
    this.setState({cartItems})
  }

  onIncrement = id => {
    const {cartItems} = this.state
    const updated = cartItems.map(item =>
      item.id === id ? {...item, count: item.count + 1} : item,
    )
    this.saveCart(updated)
  }

  onDecrement = id => {
    const {cartItems} = this.state
    const updated = cartItems
      .map(item => (item.id === id ? {...item, count: item.count - 1} : item))
      .filter(item => item.count > 0)
    this.saveCart(updated)
  }

  getItemTotal = item => {
    const numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, ''))
    return (numericPrice * item.count).toFixed(2)
  }

  getOrderTotal = () => {
    const {cartItems} = this.state
    return cartItems
      .reduce((acc, item) => acc + parseFloat(this.getItemTotal(item)), 0)
      .toFixed(2)
  }

  getTotalItemCount = () => {
    const {cartItems} = this.state
    return cartItems.length
  }

  onClickCheckout = () => {
    const {cartItems} = this.state
    const orderTotal = this.getOrderTotal()

    // Build order object
    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: cartItems,
      total: orderTotal,
    }

    // Save to order history
    const existing = localStorage.getItem('orderHistory')
    const history = existing ? JSON.parse(existing) : []
    history.unshift(newOrder)
    localStorage.setItem('orderHistory', JSON.stringify(history))

    // Clear cart
    localStorage.removeItem('cartData')
    this.setState({cartItems: [], isOrderPlaced: true})
  }

  renderPaymentSuccess = () => (
    <div className="payment-success-container">
      <div className="success-icon">✓</div>
      <h1 className="payment-success-title">Payment Successful</h1>
      <p className="payment-success-desc">Thank you for ordering</p>
      <p className="payment-success-sub">
        Your order has been placed and saved to your order history!
      </p>
      <div className="success-actions">
        <Link to="/">
          <button type="button" className="shop-now-btn">
            Return to Homepage
          </button>
        </Link>
        <Link to="/orders">
          <button type="button" className="view-orders-btn">
            View Orders
          </button>
        </Link>
      </div>
    </div>
  )

  renderEmptyCart = () => (
    <div className="empty-cart-container">
      <img
        src="https://static.vecteezy.com/system/resources/previews/005/006/007/non_2x/no-item-in-the-shopping-cart-click-to-go-shopping-now-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
        alt="empty cart"
        className="empty-cart-img"
      />
      <h2 className="empty-cart-title">Your Cart Is Empty</h2>
      <p className="empty-cart-desc">
        Looks like you haven&apos;t added anything yet.
      </p>
      <Link to="/" className="shop-now-btn">
        Shop Now
      </Link>
    </div>
  )

  renderCartItems = () => {
    const {cartItems} = this.state
    const orderTotal = this.getOrderTotal()
    const totalItemCount = this.getTotalItemCount()

    return (
      <>
        <div className="cart-table-header">
          <span>Item</span>
          <span>Quantity</span>
          <span className="cart-item-price-col">Price</span>
          <span>Total</span>
        </div>
        <ul className="cart-items-list">
          {cartItems.map(item => (
            <li key={item.id} className="cart-item" data-testid="cartItem">
              <div className="cart-item-info">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                />
                <div>
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-weight">{item.weight}</p>
                </div>
              </div>

              <div className="cart-qty-controller">
                <button
                  type="button"
                  className="cart-qty-btn"
                  data-testid="decrement-quantity"
                  onClick={() => this.onDecrement(item.id)}
                >
                  -
                </button>
                <span data-testid="item-quantity" className="qty-count">
                  {item.count}
                </span>
                <button
                  type="button"
                  className="cart-qty-btn"
                  data-testid="increment-quantity"
                  onClick={() => this.onIncrement(item.id)}
                >
                  +
                </button>
              </div>

              <span className="cart-item-price cart-item-price-col">
                {item.price}
              </span>

              <span className="cart-item-total-price">
                ₹{this.getItemTotal(item)}
              </span>
            </li>
          ))}
        </ul>

        <h1 className="order-total-heading">{`Total (${totalItemCount} items) :`}</h1>

        <div className="order-summary">
          <div className="order-summary-row">
            <span>Subtotal</span>
            <span data-testid="total-price">₹{orderTotal}</span>
          </div>
          <div className="order-summary-row">
            <span>Delivery Fee</span>
            <span className="free-delivery">Free</span>
          </div>
          <hr className="order-summary-divider" />
          <div className="order-total-row">
            <span>Order Total</span>
            <span>₹{orderTotal}</span>
          </div>
          <button
            type="button"
            className="checkout-btn"
            onClick={this.onClickCheckout}
          >
            Checkout
          </button>
        </div>
      </>
    )
  }

  render() {
    const {cartItems, isOrderPlaced} = this.state
    const hasItems = cartItems.length > 0

    if (isOrderPlaced) {
      return (
        <>
          <Header />
          <div className="cart-page">
            <div className="cart-content">{this.renderPaymentSuccess()}</div>
          </div>
        </>
      )
    }

    return (
      <>
        <Header />
        <div className="cart-page">
          <div className="cart-content">
            <h1 className="cart-page-title">My Cart</h1>
            {hasItems ? this.renderCartItems() : this.renderEmptyCart()}
          </div>
        </div>
        <footer className="footer">
          <img
            src="https://image2url.com/r2/default/images/1773869549469-c4fa2a6a-0233-4a10-b5c5-6e7c02247449.png"
            alt="website logo"
            className="footer-logo"
          />
          <p className="footer-text">
            &copy; {new Date().getFullYear()} Nxt Mart. All rights reserved.
          </p>
        </footer>
      </>
    )
  }
}

export default Cart
