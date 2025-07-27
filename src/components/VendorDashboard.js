// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import "./VendorDashboard.css";

// const VendorDashboard = () => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [suppliers, setSuppliers] = useState([]);
//   const [filteredSuppliers, setFilteredSuppliers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterBy, setFilterBy] = useState('all');
//   const [sortBy, setSortBy] = useState('verification');
//   const [cart, setCart] = useState([]);
//   const [showCart, setShowCart] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check if user is logged in and is a vendor
//     const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
//     if (!user || user.type !== 'vendor') {
//       navigate('/');
//       return;
//     }
//     setCurrentUser(user);

//     // Load suppliers
//     const storedSuppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
//     setSuppliers(storedSuppliers);
//     setFilteredSuppliers(storedSuppliers);

//     // Load cart from localStorage
//     const storedCart = JSON.parse(localStorage.getItem(`vendor_cart_${user.id}`) || '[]');
//     setCart(storedCart);
//   }, [navigate]);

//   useEffect(() => {
//     // Filter and sort suppliers
//     let filtered = suppliers.filter(supplier => {
//       const matchesSearch = searchTerm === '' || 
//         supplier.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         supplier.products.some(product => 
//           product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           product.material.toLowerCase().includes(searchTerm.toLowerCase())
//         );

//       const matchesFilter = () => {
//         switch(filterBy) {
//           case 'verified': return supplier.verified;
//           case 'unverified': return !supplier.verified;
//           case 'open': return supplier.isOpen;
//           case 'closed': return !supplier.isOpen;
//           default: return true;
//         }
//       };

//       return matchesSearch && matchesFilter();
//     });

//     // Sort suppliers
//     filtered.sort((a, b) => {
//       switch(sortBy) {
//         case 'verification':
//           if (a.verified && !b.verified) return -1;
//           if (!a.verified && b.verified) return 1;
//           return b.rating - a.rating;
//         case 'rating':
//           return b.rating - a.rating;
//         case 'location':
//           return a.location.localeCompare(b.location);
//         default:
//           return 0;
//       }
//     });

//     setFilteredSuppliers(filtered);
//   }, [suppliers, searchTerm, filterBy, sortBy]);

//   const addToCart = (supplier, product, quantity) => {
//     if (quantity <= 0 || quantity > product.quantity) {
//       alert('Invalid quantity selected');
//       return;
//     }

//     const existingItemIndex = cart.findIndex(
//       item => item.supplierId === supplier.id && 
//               item.productName === product.name && 
//               item.material === product.material
//     );

//     let newCart;
//     if (existingItemIndex !== -1) {
//       // Update existing item
//       newCart = [...cart];
//       newCart[existingItemIndex].quantity += quantity;
//       newCart[existingItemIndex].total = newCart[existingItemIndex].price * newCart[existingItemIndex].quantity;
//     } else {
//       // Add new item
//       const cartItem = {
//         id: Date.now(),
//         supplierId: supplier.id,
//         supplierName: `Supplier #${supplier.id}`,
//         supplierContact: supplier.contactNumber,
//         productName: product.name,
//         material: product.material,
//         price: product.price,
//         quantity: quantity,
//         total: product.price * quantity
//       };
//       newCart = [...cart, cartItem];
//     }

//     setCart(newCart);
//     localStorage.setItem(`vendor_cart_${currentUser.id}`, JSON.stringify(newCart));
//     alert(`Added ${quantity} kg of ${product.name} to cart`);
//   };

//   const updateCartQuantity = (itemId, newQuantity) => {
//     if (newQuantity <= 0) {
//       removeFromCart(itemId);
//       return;
//     }

//     const newCart = cart.map(item => 
//       item.id === itemId 
//         ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
//         : item
//     );
//     setCart(newCart);
//     localStorage.setItem(`vendor_cart_${currentUser.id}`, JSON.stringify(newCart));
//   };

//   const removeFromCart = (itemId) => {
//     const newCart = cart.filter(item => item.id !== itemId);
//     setCart(newCart);
//     localStorage.setItem(`vendor_cart_${currentUser.id}`, JSON.stringify(newCart));
//   };

//   const clearCart = () => {
//     setCart([]);
//     localStorage.setItem(`vendor_cart_${currentUser.id}`, JSON.stringify([]));
//   };

//   const getTotalCartValue = () => {
//     return cart.reduce((total, item) => total + item.total, 0);
//   };

//   const getTotalCartItems = () => {
//     return cart.reduce((total, item) => total + item.quantity, 0);
//   };

//   const handleCheckout = () => {
//     if (cart.length === 0) {
//       alert('Your cart is empty');
//       return;
//     }
//     navigate('/payment', { state: { cart, totalAmount: getTotalCartValue() } });
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('currentUser');
//     navigate('/');
//   };

//   const clearAllFilters = () => {
//     setSearchTerm('');
//     setFilterBy('all');
//     setSortBy('verification');
//   };

//   // Fixed search input handler to prevent any interference
//   const handleSearchChange = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setSearchTerm(e.target.value);
//   };

//   const renderStars = (rating) => {
//     const stars = [];
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 !== 0;

//     for (let i = 0; i < fullStars; i++) {
//       stars.push('★');
//     }
//     if (hasHalfStar) {
//       stars.push('☆');
//     }
//     while (stars.length < 5) {
//       stars.push('☆');
//     }
//     return stars.join('');
//   };

//   const SearchBar = () => (
//     <div className="search-container">
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Search suppliers, products, materials, locations..."
//           value={searchTerm}
//           onChange={handleSearchChange}
//           onKeyDown={(e) => e.stopPropagation()}
//           onKeyUp={(e) => e.stopPropagation()}
//           className="search-input"
//           autoComplete="off"
//         />
//         <button 
//           className="search-button"
//           type="button"
//         >
//           🔍
//         </button>
//       </div>
//       <div className="filter-controls">
//         <button 
//           className="filter-toggle"
//           onClick={() => setShowFilters(!showFilters)}
//         >
//           Filters {showFilters ? '▲' : '▼'}
//         </button>
//         {(searchTerm || filterBy !== 'all' || sortBy !== 'verification') && (
//           <button className="clear-filters" onClick={clearAllFilters}>
//             Clear All
//           </button>
//         )}
//       </div>
//     </div>
//   );

//   const FilterPanel = () => (
//     showFilters && (
//       <div className="filter-panel">
//         <div className="filter-section">
//           <h4>Filter by Status</h4>
//           <label>
//             <input
//               type="radio"
//               name="filter"
//               value="all"
//               checked={filterBy === 'all'}
//               onChange={(e) => setFilterBy(e.target.value)}
//             />
//             All Suppliers
//           </label>
//           <label>
//             <input
//               type="radio"
//               name="filter"
//               value="verified"
//               checked={filterBy === 'verified'}
//               onChange={(e) => setFilterBy(e.target.value)}
//             />
//             Verified Only
//           </label>
//           <label>
//             <input
//               type="radio"
//               name="filter"
//               value="open"
//               checked={filterBy === 'open'}
//               onChange={(e) => setFilterBy(e.target.value)}
//             />
//             Open Now
//           </label>
//           <label>
//             <input
//               type="radio"
//               name="filter"
//               value="closed"
//               checked={filterBy === 'closed'}
//               onChange={(e) => setFilterBy(e.target.value)}
//             />
//             Closed
//           </label>
//         </div>

//         <div className="filter-section">
//           <h4>Sort by</h4>
//           <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//             <option value="verification">Verification Status</option>
//             <option value="rating">Highest Rating</option>
//             <option value="location">Location (A-Z)</option>
//           </select>
//         </div>
//       </div>
//     )
//   );

//   const CartButton = () => (
//     <div className="cart-button-container">
//       <button 
//         className="cart-button"
//         onClick={() => setShowCart(!showCart)}
//       >
//         🛒 Cart ({getTotalCartItems()}) - ₹{getTotalCartValue()}
//       </button>
//     </div>
//   );

//   const CartPanel = () => (
//     showCart && (
//       <div className="cart-panel">
//         <div className="cart-header">
//           <h3>Shopping Cart ({cart.length} items)</h3>
//           <button onClick={() => setShowCart(false)}>✕</button>
//         </div>
        
//         {cart.length > 0 ? (
//           <div className="cart-content">
//             <div className="cart-items">
//               {cart.map(item => (
//                 <div key={item.id} className="cart-item">
//                   <div className="item-info">
//                     <h4>{item.productName}</h4>
//                     <p>Material: {item.material}</p>
//                     <p>Supplier: {item.supplierName}</p>
//                     <p>Price: ₹{item.price}/kg</p>
//                   </div>
                  
//                   <div className="item-controls">
//                     <div className="quantity-controls">
//                       <button 
//                         onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
//                       >
//                         -
//                       </button>
//                       <span>{item.quantity} kg</span>
//                       <button 
//                         onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
//                       >
//                         +
//                       </button>
//                     </div>
                    
//                     <div className="item-total">
//                       ₹{item.total}
//                     </div>
                    
//                     <button 
//                       className="remove-item"
//                       onClick={() => removeFromCart(item.id)}
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             <div className="cart-footer">
//               <div className="cart-total">
//                 <strong>Total: ₹{getTotalCartValue()}</strong>
//               </div>
//               <div className="cart-actions">
//                 <button className="clear-cart" onClick={clearCart}>
//                   Clear Cart
//                 </button>
//                 <button className="checkout-button" onClick={handleCheckout}>
//                   Proceed to Checkout
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="empty-cart">
//             <p>Your cart is empty</p>
//             <button onClick={() => setShowCart(false)}>Continue Shopping</button>
//           </div>
//         )}
//       </div>
//     )
//   );

//   const ProductCard = ({ supplier, product, index }) => {
//     const [selectedQuantity, setSelectedQuantity] = useState(1);

//     return (
//       <div className="product-card" key={index}>
//         <div className="product-info">
//           <h4>{product.name}</h4>
//           <p><strong>Material:</strong> {product.material}</p>
//           <p><strong>Price:</strong> ₹{product.price}/kg</p>
//           <p><strong>Available:</strong> {product.quantity} kg</p>
//         </div>
        
//         <div className="product-actions">
//           <div className="quantity-selector">
//             <label>Quantity (kg):</label>
//             <input
//               type="number"
//               min="1"
//               max={product.quantity}
//               value={selectedQuantity}
//               onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
//             />
//           </div>
          
//           <button 
//             className="add-to-cart"
//             onClick={() => addToCart(supplier, product, selectedQuantity)}
//             disabled={!supplier.isOpen}
//           >
//             {supplier.isOpen ? 'Add to Cart' : 'Unavailable'}
//           </button>
//         </div>
//       </div>
//     );
//   };

//   if (!currentUser) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="vendor-dashboard">
//       {/* Header */}
//       <header className="dashboard-header">
//         <div className="header-content">
//           <h1>Vendor Dashboard</h1>
//           <div className="header-actions">
//             <span>Welcome, {currentUser.username}</span>
//             <button onClick={() => navigate('/home')}>Home</button>
//             <button onClick={handleLogout}>Logout</button>
//           </div>
//         </div>
//       </header>

//       {/* Search and Cart Section */}
//       <div className="top-controls">
//         <SearchBar />
//         <CartButton />
//       </div>

//       {/* Filter Panel */}
//       <FilterPanel />

//       {/* Cart Panel */}
//       <CartPanel />

//       {/* Results Summary */}
//       <div className="results-summary">
//         <h2>
//           Available Suppliers ({filteredSuppliers.length})
//           {searchTerm && <span> - Results for "{searchTerm}"</span>}
//         </h2>
        
//         {filteredSuppliers.length === 0 && (
//           <div className="no-results">
//             <p>No suppliers found matching your criteria.</p>
//             <button onClick={clearAllFilters}>Clear All Filters</button>
//           </div>
//         )}
//       </div>

//       {/* Suppliers List */}
//       <div className="suppliers-list">
//         {filteredSuppliers.map(supplier => (
//           <div key={supplier.id} className="supplier-card">
//             <div className="supplier-header">
//               <div className="supplier-title">
//                 <h3>Supplier #{supplier.id}</h3>
//                 <div className="supplier-badges">
//                   {supplier.verified ? (
//                     <span className="verified-badge">✓ Verified</span>
//                   ) : (
//                     <span className="unverified-badge">⚠ Not Verified</span>
//                   )}
//                   <span className={`status-badge ${supplier.isOpen ? 'open' : 'closed'}`}>
//                     {supplier.isOpen ? '🟢 Open' : '🔴 Closed'}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="supplier-content">
//               <div className="supplier-info-section">
//                 <div className="supplier-info">
//                   <p><strong>Rating:</strong> {renderStars(supplier.rating)} ({supplier.rating}/5)</p>
//                   <p><strong>Location:</strong> {supplier.location}</p>
//                   <p><strong>Contact:</strong> {supplier.contactNumber}</p>
//                 </div>
//               </div>

//               <div className="supplier-products">
//                 <h4>Available Products:</h4>
//                 <div className="products-grid">
//                   {supplier.products.map((product, index) => (
//                     <ProductCard 
//                       key={index}
//                       supplier={supplier}
//                       product={product}
//                       index={index}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="supplier-actions">
//               <button 
//                 className="view-details"
//                 onClick={() => navigate(`/supplier/${supplier.id}`)}
//                 disabled={!supplier.isOpen}
//               >
//                 {supplier.isOpen ? 'View Full Details' : 'Currently Closed'}
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default VendorDashboard;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./VendorDashboard.css";

const VendorDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('verification');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and is a vendor
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user || user.type !== 'vendor') {
      navigate('/');
      return;
    }
    setCurrentUser(user);

    // Load suppliers
    const storedSuppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    setSuppliers(storedSuppliers);
    setFilteredSuppliers(storedSuppliers);

    // Load cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem(`vendor_cart_${user.id}`) || '[]');
    setCart(storedCart);
  }, [navigate]);

  useEffect(() => {
    // Filter and sort suppliers
    let filtered = suppliers.filter(supplier => {
      const matchesSearch = searchTerm === '' || 
        supplier.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.products.some(product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.material.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesFilter = () => {
        switch(filterBy) {
          case 'verified': return supplier.verified;
          case 'unverified': return !supplier.verified;
          case 'open': return supplier.isOpen;
          case 'closed': return !supplier.isOpen;
          default: return true;
        }
      };

      return matchesSearch && matchesFilter();
    });

    // Sort suppliers
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'verification':
          if (a.verified && !b.verified) return -1;
          if (!a.verified && b.verified) return 1;
          return b.rating - a.rating;
        case 'rating':
          return b.rating - a.rating;
        case 'location':
          return a.location.localeCompare(b.location);
        default:
          return 0;
      }
    });

    setFilteredSuppliers(filtered);
  }, [suppliers, searchTerm, filterBy, sortBy]);

  const addToCart = (supplier, product, quantity) => {
    if (quantity <= 0 || quantity > product.quantity) {
      alert('Invalid quantity selected');
      return;
    }

    const existingItemIndex = cart.findIndex(
      item => item.supplierId === supplier.id && 
              item.productName === product.name && 
              item.material === product.material
    );

    let newCart;
    if (existingItemIndex !== -1) {
      // Update existing item
      newCart = [...cart];
      newCart[existingItemIndex].quantity += quantity;
      newCart[existingItemIndex].total = newCart[existingItemIndex].price * newCart[existingItemIndex].quantity;
    } else {
      // Add new item
      const cartItem = {
        id: Date.now(),
        supplierId: supplier.id,
        supplierName: `Supplier #${supplier.id}`,
        supplierContact: supplier.contactNumber,
        productName: product.name,
        material: product.material,
        price: product.price,
        quantity: quantity,
        total: product.price * quantity
      };
      newCart = [...cart, cartItem];
    }

    setCart(newCart);
    localStorage.setItem(`vendor_cart_${currentUser.id}`, JSON.stringify(newCart));
    alert(`Added ${quantity} kg of ${product.name} to cart`);
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const newCart = cart.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
        : item
    );
    setCart(newCart);
    localStorage.setItem(`vendor_cart_${currentUser.id}`, JSON.stringify(newCart));
  };

  const removeFromCart = (itemId) => {
    const newCart = cart.filter(item => item.id !== itemId);
    setCart(newCart);
    localStorage.setItem(`vendor_cart_${currentUser.id}`, JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem(`vendor_cart_${currentUser.id}`, JSON.stringify([]));
  };

  const getTotalCartValue = () => {
    return cart.reduce((total, item) => total + item.total, 0);
  };

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    navigate('/payment', { state: { cart, totalAmount: getTotalCartValue() } });
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterBy('all');
    setSortBy('verification');
  };

  // Fixed search input handler to prevent any interference
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // Prevent form submission or any other interference
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
    e.stopPropagation();
  };

  const handleSearchFocus = (e) => {
    e.stopPropagation();
  };

  const handleSearchBlur = (e) => {
    e.stopPropagation();
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('☆');
    }
    while (stars.length < 5) {
      stars.push('☆');
    }
    return stars.join('');
  };

  const SearchBar = () => (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search suppliers, products, materials, locations..."
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          className="search-input"
          autoComplete="off"
          spellCheck="false"
        />
        <button 
          className="search-button"
          type="button"
          onClick={(e) => e.preventDefault()}
        >
          🔍
        </button>
      </div>
      <div className="filter-controls">
        <button 
          className="filter-toggle"
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters {showFilters ? '▲' : '▼'}
        </button>
        {(searchTerm || filterBy !== 'all' || sortBy !== 'verification') && (
          <button className="clear-filters" onClick={clearAllFilters}>
            Clear All
          </button>
        )}
      </div>
    </div>
  );

  const FilterPanel = () => (
    showFilters && (
      <div className="filter-panel">
        <div className="filter-section">
          <h4>Filter by Status</h4>
          <label>
            <input
              type="radio"
              name="filter"
              value="all"
              checked={filterBy === 'all'}
              onChange={(e) => setFilterBy(e.target.value)}
            />
            All Suppliers
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="verified"
              checked={filterBy === 'verified'}
              onChange={(e) => setFilterBy(e.target.value)}
            />
            Verified Only
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="open"
              checked={filterBy === 'open'}
              onChange={(e) => setFilterBy(e.target.value)}
            />
            Open Now
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="closed"
              checked={filterBy === 'closed'}
              onChange={(e) => setFilterBy(e.target.value)}
            />
            Closed
          </label>
        </div>

        <div className="filter-section">
          <h4>Sort by</h4>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="verification">Verification Status</option>
            <option value="rating">Highest Rating</option>
            <option value="location">Location (A-Z)</option>
          </select>
        </div>
      </div>
    )
  );

  const CartButton = () => (
    <div className="cart-button-container">
      <button 
        className="cart-button"
        onClick={() => setShowCart(!showCart)}
      >
        🛒 Cart ({getTotalCartItems()}) - ₹{getTotalCartValue()}
      </button>
    </div>
  );

  const CartPanel = () => (
    showCart && (
      <div className="cart-panel">
        <div className="cart-header">
          <h3>Shopping Cart ({cart.length} items)</h3>
          <button onClick={() => setShowCart(false)}>✕</button>
        </div>
        
        {cart.length > 0 ? (
          <div className="cart-content">
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <h4>{item.productName}</h4>
                    <p>Material: {item.material}</p>
                    <p>Supplier: {item.supplierName}</p>
                    <p>Price: ₹{item.price}/kg</p>
                  </div>
                  
                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span>{item.quantity} kg</span>
                      <button 
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="item-total">
                      ₹{item.total}
                    </div>
                    
                    <button 
                      className="remove-item"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-footer">
              <div className="cart-total">
                <strong>Total: ₹{getTotalCartValue()}</strong>
              </div>
              <div className="cart-actions">
                <button className="clear-cart" onClick={clearCart}>
                  Clear Cart
                </button>
                <button className="checkout-button" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button onClick={() => setShowCart(false)}>Continue Shopping</button>
          </div>
        )}
      </div>
    )
  );

  const ProductCard = ({ supplier, product, index }) => {
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    return (
      <div className="product-card" key={index}>
        <div className="product-info">
          <h4>{product.name}</h4>
          <p><strong>Material:</strong> {product.material}</p>
          <p><strong>Price:</strong> ₹{product.price}/kg</p>
          <p><strong>Available:</strong> {product.quantity} kg</p>
        </div>
        
        <div className="product-actions">
          <div className="quantity-selector">
            <label>Quantity (kg):</label>
            <input
              type="number"
              min="1"
              max={product.quantity}
              value={selectedQuantity}
              onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
            />
          </div>
          
          <button 
            className="add-to-cart"
            onClick={() => addToCart(supplier, product, selectedQuantity)}
            disabled={!supplier.isOpen}
          >
            {supplier.isOpen ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    );
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="vendor-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Vendor Dashboard</h1>
          <div className="header-actions">
            <span>Welcome, {currentUser.username}</span>
            <button onClick={() => navigate('/home')}>Home</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      {/* Search and Cart Section */}
      <div className="top-controls">
        <SearchBar />
        <CartButton />
      </div>

      {/* Filter Panel */}
      <FilterPanel />

      {/* Cart Panel */}
      <CartPanel />

      {/* Results Summary */}
      <div className="results-summary">
        <h2>
          Available Suppliers ({filteredSuppliers.length})
          {searchTerm && <span> - Results for "{searchTerm}"</span>}
        </h2>
        
        {filteredSuppliers.length === 0 && (
          <div className="no-results">
            <p>No suppliers found matching your criteria.</p>
            <button onClick={clearAllFilters}>Clear All Filters</button>
          </div>
        )}
      </div>

      {/* Suppliers List */}
      <div className="suppliers-list">
        {filteredSuppliers.map(supplier => (
          <div key={supplier.id} className="supplier-card">
            <div className="supplier-header">
              <div className="supplier-title">
                <h3>Supplier #{supplier.id}</h3>
                <div className="supplier-badges">
                  {supplier.verified ? (
                    <span className="verified-badge">✓ Verified</span>
                  ) : (
                    <span className="unverified-badge">⚠ Not Verified</span>
                  )}
                  <span className={`status-badge ${supplier.isOpen ? 'open' : 'closed'}`}>
                    {supplier.isOpen ? '🟢 Open' : '🔴 Closed'}
                  </span>
                </div>
              </div>
            </div>

            <div className="supplier-content">
              <div className="supplier-info-section">
                <div className="supplier-info">
                  <p><strong>Rating:</strong> {renderStars(supplier.rating)} ({supplier.rating}/5)</p>
                  <p><strong>Location:</strong> {supplier.location}</p>
                  <p><strong>Contact:</strong> {supplier.contactNumber}</p>
                </div>
              </div>

              <div className="supplier-products">
                <h4>Available Products:</h4>
                <div className="products-grid">
                  {supplier.products.map((product, index) => (
                    <ProductCard 
                      key={index}
                      supplier={supplier}
                      product={product}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="supplier-actions">
              <button 
                className="view-details"
                onClick={() => navigate(`/supplier/${supplier.id}`)}
                disabled={!supplier.isOpen}
              >
                {supplier.isOpen ? 'View Full Details' : 'Currently Closed'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorDashboard;