import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

class Orders extends Component {
  state = {
    orderHistory: [],
    expandedOrderId: null,
    showClearConfirm: false,
  }

  componentDidMount() {
    const data = localStorage.getItem('orderHistory')
    if (data) {
      this.setState({orderHistory: JSON.parse(data)})
    }
  }

  toggleOrder = id => {
    this.setState(prev => ({
      expandedOrderId: prev.expandedOrderId === id ? null : id,
    }))
  }

  onDeleteSingleOrder = (e, orderId) => {
    e.stopPropagation()
    const {orderHistory} = this.state
    const updated = orderHistory.filter(o => o.id !== orderId)
    localStorage.setItem('orderHistory', JSON.stringify(updated))
    this.setState({orderHistory: updated, expandedOrderId: null})
  }

  onClearAllOrders = () => {
    localStorage.removeItem('orderHistory')
    this.setState({orderHistory: [], showClearConfirm: false})
  }

  onShowClearConfirm = () => {
    this.setState({showClearConfirm: true})
  }

  onCancelClear = () => {
    this.setState({showClearConfirm: false})
  }

  renderEmptyOrders = () => (
    <div className="empty-orders-container">
      <div className="empty-orders-icon">📦</div>
      <h2 className="empty-orders-title">No Orders Yet</h2>
      <p className="empty-orders-desc">
        You haven&apos;t placed any orders yet. Start shopping!
      </p>
      <Link to="/" className="start-shopping-btn">
        Start Shopping
      </Link>
    </div>
  )

  renderOrderItem = item => (
    <li key={item.id} className="order-product-item">
      <img src={item.image} alt={item.name} className="order-product-img" />
      <div className="order-product-info">
        <p className="order-product-name">{item.name}</p>
        <p className="order-product-weight">{item.weight}</p>
      </div>
      <div className="order-product-meta">
        <span className="order-product-qty">x{item.count}</span>
        <span className="order-product-price">{item.price}</span>
      </div>
    </li>
  )

  renderClearConfirmModal = () => (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <div className="confirm-modal-icon">🗑️</div>
        <h2 className="confirm-modal-title">Clear All Orders?</h2>
        <p className="confirm-modal-desc">
          This will permanently delete your entire order history. This action
          cannot be undone.
        </p>
        <div className="confirm-modal-actions">
          <button
            type="button"
            className="confirm-cancel-btn"
            onClick={this.onCancelClear}
          >
            Cancel
          </button>
          <button
            type="button"
            className="confirm-delete-btn"
            onClick={this.onClearAllOrders}
          >
            Yes, Clear All
          </button>
        </div>
      </div>
    </div>
  )

  renderOrders = () => {
    const {orderHistory, expandedOrderId} = this.state

    return (
      <ul className="orders-list">
        {orderHistory.map((order, index) => (
          <li key={order.id} className="order-card">
            <div
              className="order-card-header"
              onClick={() => this.toggleOrder(order.id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && this.toggleOrder(order.id)}
            >
              <div className="order-card-left">
                <span className="order-number">
                  Order #{orderHistory.length - index}
                </span>
                <span className="order-date">{order.date}</span>
              </div>
              <div className="order-card-right">
                <span className="order-total-badge">₹{order.total}</span>
                <span className="order-items-count">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </span>
                <button
                  type="button"
                  className="delete-order-btn"
                  title="Delete this order"
                  onClick={e => this.onDeleteSingleOrder(e, order.id)}
                >
                  🗑
                </button>
                <span className="order-expand-icon">
                  {expandedOrderId === order.id ? '▲' : '▼'}
                </span>
              </div>
            </div>

            {expandedOrderId === order.id && (
              <div className="order-card-body">
                <ul className="order-products-list">
                  {order.items.map(item => this.renderOrderItem(item))}
                </ul>
                <div className="order-summary-footer">
                  <span className="order-summary-label">Order Total</span>
                  <span className="order-summary-value">₹{order.total}</span>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    )
  }

  render() {
    const {orderHistory, showClearConfirm} = this.state
    const hasOrders = orderHistory.length > 0

    return (
      <>
        <Header />
        {showClearConfirm && this.renderClearConfirmModal()}
        <div className="orders-page">
          <div className="orders-content">
            <div className="orders-page-header">
              <div className="orders-title-row">
                <h1 className="orders-page-title">Order History</h1>
                {hasOrders && (
                  <span className="orders-count-badge">
                    {orderHistory.length} order{orderHistory.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {hasOrders && (
                <button
                  type="button"
                  className="clear-all-btn"
                  onClick={this.onShowClearConfirm}
                >
                  🗑 Clear All Orders
                </button>
              )}
            </div>
            {hasOrders ? this.renderOrders() : this.renderEmptyOrders()}
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

export default Orders
