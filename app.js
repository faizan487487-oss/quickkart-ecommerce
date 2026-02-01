const { useState } = React;

function App() {
    const [cart, setCart] = useState([]);
    const [currentPage, setCurrentPage] = useState('home');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Add to cart function
    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    // Update quantity
    const updateQuantity = (id, change) => {
        setCart(cart.map(item =>
            item.id === id
                ? { ...item, quantity: Math.max(1, item.quantity + change) }
                : item
        ));
    };

    // Remove from cart
    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    // Calculate total
    const getTotal = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    // Get cart count
    const getCartCount = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    // Filter products
    const getFilteredProducts = () => {
        let filtered = products;
        
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }
        
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        return filtered;
    };

    const categories = ['All', ...new Set(products.map(p => p.category))];

    return (
        <div>
            <Navbar 
                cartCount={getCartCount()} 
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
            
            {currentPage === 'home' ? (
                <>
                    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                    <Filters 
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                    />
                    <ProductsList 
                        products={getFilteredProducts()}
                        addToCart={addToCart}
                    />
                </>
            ) : (
                <Cart 
                    cart={cart}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                    getTotal={getTotal}
                    setCurrentPage={setCurrentPage}
                />
            )}
        </div>
    );
}

// Navbar Component
function Navbar({ cartCount, currentPage, setCurrentPage }) {
    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="logo" onClick={() => setCurrentPage('home')}>
                    🛒 QuickKart
                </div>
                <div className="nav-links">
                    <button onClick={() => setCurrentPage('home')}>Home</button>
                    <button onClick={() => setCurrentPage('cart')} className="cart-btn">
                        Cart
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </button>
                </div>
            </div>
        </nav>
    );
}

// Search Bar Component
function SearchBar({ searchQuery, setSearchQuery }) {
    return (
        <div className="search-container">
            <input
                type="text"
                className="search-bar"
                placeholder="🔍 Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    );
}

// Filters Component
function Filters({ categories, selectedCategory, setSelectedCategory }) {
    return (
        <div className="filters">
            {categories.map(category => (
                <button
                    key={category}
                    className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}

// Products List Component
function ProductsList({ products, addToCart }) {
    return (
        <div className="products-container">
            {products.length === 0 ? (
                <div className="cart-empty">
                    <h2>No products found</h2>
                    <p>Try searching for something else</p>
                </div>
            ) : (
                <div className="products-grid">
                    {products.map(product => (
                        <ProductCard 
                            key={product.id}
                            product={product}
                            addToCart={addToCart}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Product Card Component
function ProductCard({ product, addToCart }) {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-rating">⭐ {product.rating}</div>
                <div className="product-price">₹{product.price}</div>
                <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
}

// Cart Component
function Cart({ cart, updateQuantity, removeFromCart, getTotal, setCurrentPage }) {
    return (
        <div className="cart-container">
            <h1 className="cart-title">Shopping Cart</h1>
            
            {cart.length === 0 ? (
                <div className="cart-empty">
                    <h2>Your cart is empty</h2>
                    <p>Add some products to get started!</p>
                    <button 
                        className="checkout-btn"
                        onClick={() => setCurrentPage('home')}
                        style={{marginTop: '2rem'}}
                    >
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <>
                    {cart.map(item => (
                        <div key={item.id} className="cart-item">
                            <img src={item.image} alt={item.name} className="cart-item-image" />
                            <div className="cart-item-info">
                                <h3 className="cart-item-name">{item.name}</h3>
                                <div className="cart-item-price">₹{item.price}</div>
                            </div>
                            <div className="cart-item-controls">
                                <button 
                                    className="quantity-btn"
                                    onClick={() => updateQuantity(item.id, -1)}
                                >
                                    -
                                </button>
                                <span className="quantity">{item.quantity}</span>
                                <button 
                                    className="quantity-btn"
                                    onClick={() => updateQuantity(item.id, 1)}
                                >
                                    +
                                </button>
                                <button 
                                    className="remove-btn"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    <div className="cart-summary">
                        <div className="cart-total">
                            Total: ₹{getTotal()}
                        </div>
                        <button className="checkout-btn">
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

// Render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
