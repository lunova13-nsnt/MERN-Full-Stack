import {Component, createRef} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    categoriesList: [],
    cartItems: [],
    activeCategoryId: null,
  }

  scrollRefs = {}

  componentDidMount() {
    this.fetchProducts()
    this.loadCartFromStorage()
  }

  loadCartFromStorage = () => {
    const cartData = localStorage.getItem('cartData')
    if (cartData) {
      this.setState({cartItems: JSON.parse(cartData)})
    }
  }

  saveCartToStorage = cartItems => {
    localStorage.setItem('cartData', JSON.stringify(cartItems))
  }

  fetchProducts = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = 'https://apis2.ccbp.in/nxt-mart/category-list-details'
    try {
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        const categoriesList = data.categories.map(cat => ({
          id: cat.name,
          name: cat.name,
          products: cat.products,
        }))
        categoriesList.forEach(cat => {
          this.scrollRefs[cat.id] = createRef()
        })
        this.setState({
          apiStatus: apiStatusConstants.success,
          categoriesList,
          activeCategoryId:
            categoriesList.length > 0 ? categoriesList[0].id : null,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onAddItem = product => {
    const {cartItems} = this.state
    const existingItem = cartItems.find(item => item.id === product.id)
    let updatedCart
    if (existingItem) {
      updatedCart = cartItems.map(item =>
        item.id === product.id ? {...item, count: item.count + 1} : item,
      )
    } else {
      updatedCart = [...cartItems, {...product, count: 1}]
    }
    this.setState({cartItems: updatedCart})
    this.saveCartToStorage(updatedCart)
  }

  onIncrement = productId => {
    const {cartItems} = this.state
    const updatedCart = cartItems.map(item =>
      item.id === productId ? {...item, count: item.count + 1} : item,
    )
    this.setState({cartItems: updatedCart})
    this.saveCartToStorage(updatedCart)
  }

  onDecrement = productId => {
    const {cartItems} = this.state
    const updatedCart = cartItems
      .map(item =>
        item.id === productId ? {...item, count: item.count - 1} : item,
      )
      .filter(item => item.count > 0)
    this.setState({cartItems: updatedCart})
    this.saveCartToStorage(updatedCart)
  }

  getProductCount = productId => {
    const {cartItems} = this.state
    const item = cartItems.find(i => i.id === productId)
    return item ? item.count : 0
  }

  onSelectCategory = categoryId => {
    this.setState({activeCategoryId: categoryId})
    const el = document.getElementById(`category-${categoryId}`)
    if (el) {
      const offset = 88
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({top, behavior: 'smooth'})
    }
  }

  renderProductCard = product => {
    const count = this.getProductCount(product.id)
    return (
      <li key={product.id} className="product-card" data-testid="product">
        <img src={product.image} alt={product.name} className="product-img" />
        <p className="product-name">{product.name}</p>
        <p className="product-weight">{product.weight}</p>
        <p className="product-price">{product.price}</p>
        {count === 0 ? (
          <button
            type="button"
            className="add-btn"
            data-testid="add-button"
            onClick={() => this.onAddItem(product)}
          >
            Add
          </button>
        ) : (
          <div className="quantity-controller">
            <button
              type="button"
              className="qty-btn"
              data-testid="decrement-count"
              onClick={() => this.onDecrement(product.id)}
            >
              -
            </button>
            <span className="qty-count" data-testid="active-count">
              {count}
            </span>
            <button
              type="button"
              className="qty-btn"
              data-testid="increment-count"
              onClick={() => this.onIncrement(product.id)}
            >
              +
            </button>
          </div>
        )}
      </li>
    )
  }

  renderSuccessView = () => {
    const {categoriesList, activeCategoryId} = this.state
    return (
      <div className="home-layout">
        <aside className="sidebar">
          <p className="sidebar-title">Categories</p>
          {categoriesList.map(cat => (
            <a
              key={cat.id}
              href={`#category-${cat.id}`}
              className={`sidebar-category-btn ${
                activeCategoryId === cat.id ? 'active' : ''
              }`}
              onClick={e => {
                e.preventDefault()
                this.onSelectCategory(cat.id)
              }}
            >
              {cat.name}
            </a>
          ))}
        </aside>

        <main className="main-content">
          <div className="mobile-categories">
            {categoriesList.map(cat => (
              <a
                key={cat.id}
                href={`#category-${cat.id}`}
                className={`mobile-cat-btn ${
                  activeCategoryId === cat.id ? 'active' : ''
                }`}
                onClick={e => {
                  e.preventDefault()
                  this.onSelectCategory(cat.id)
                }}
              >
                {cat.name}
              </a>
            ))}
          </div>

          {categoriesList.map(cat => (
            <section
              key={cat.id}
              id={`category-${cat.id}`}
              className="category-section"
            >
              <div className="category-section-header">
                <h2 className="category-section-title">{cat.name}</h2>
                <div className="category-title-bar" />
              </div>

              <ul className="products-scroll-container">
                {cat.products.map(product =>
                  this.renderProductCard(product),
                )}
              </ul>
            </section>
          ))}
        </main>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="home-layout">
      <div className="main-content">
        <div className="failure-view-container">
          <img
            src="https://new-assets.ccbp.in/frontend/react-js/nxt-mart-app/failure-img.png"
            alt="failure view"
            className="failure-view-img"
          />
          <h2 className="failure-view-title">Oops! Something Went Wrong</h2>
          <p className="failure-view-desc">
            We are having some trouble processing your request. Please try
            again.
          </p>
          <button
            type="button"
            className="retry-btn"
            onClick={this.fetchProducts}
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  )

  renderLoaderView = () => (
    <div className="home-layout">
      <div className="main-content">
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#263868" height={50} width={50} />
        </div>
      </div>
    </div>
  )

  renderCurrentView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderCurrentView()}
      </>
    )
  }
}

export default Home
