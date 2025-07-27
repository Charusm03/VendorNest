// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import "./SupplierDetailPage.css";

// const SupplierDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [supplier, setSupplier] = useState(null);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [selectedProducts, setSelectedProducts] = useState({});
//   const [bulkDiscount, setBulkDiscount] = useState(0);
//   const [totalQuantity, setTotalQuantity] = useState(0);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [showMap, setShowMap] = useState(false);

//   useEffect(() => {
//     // Load current user
//     const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
//     setCurrentUser(user);

//     // Load supplier data
//     const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
//     const foundSupplier = suppliers.find(s => s.id === parseInt(id));
    
//     if (foundSupplier) {
//       setSupplier(foundSupplier);
//     } else {
//       alert('Supplier not found');
//       navigate('/home');
//     }
//   }, [id, navigate]);

//   useEffect(() => {
//     // Calculate totals when selected products change
//     calculateTotals();
//   }, [selectedProducts, supplier]);

//   const calculateTotals = () => {
//     if (!supplier) return;

//     let totalQty = 0;
//     let totalAmt = 0;

//     Object.entries(selectedProducts).forEach(([productId, quantity]) => {
//       const product = supplier.products.find(p => p.id === parseInt(productId));
//       if (product && quantity > 0) {
//         totalQty += quantity;
//         totalAmt += product.price * quantity;
//       }
//     });

//     setTotalQuantity(totalQty);

//     // Apply bulk discount
//     let discount = 0;
//     if (totalQty >= 100) {
//       discount = 15; // 15% discount for 100+ kg
//     } else if (totalQty >= 50) {
//       discount = 10; // 10% discount for 50+ kg
//     } else if (totalQty >= 20) {
//       discount = 5; // 5% discount for 20+ kg
//     }

//     setBulkDiscount(discount);
//     const discountAmount = (totalAmt * discount) / 100;
//     setTotalAmount(totalAmt - discountAmount);
//   };

//   const handleQuantityChange = (productId, quantity) => {
//     const product = supplier.products.find(p => p.id === productId);
//     if (quantity > product.quantity) {
//       alert(`Only ${product.quantity} kg available for ${product.name}`);
//       return;
//     }

//     setSelectedProducts(prev => ({
//       ...prev,
//       [productId]: Math.max(0, quantity)
//     }));
//   };

//   const handleAddToCart = () => {
//     if (!currentUser) {
//       alert('Please login to add items to cart');
//       navigate('/');
//       return;
//     }

//     if (currentUser.type !== 'vendor') {
//       alert('Only vendors can purchase products');
//       return;
//     }

//     const hasSelectedProducts = Object.values(selectedProducts).some(qty => qty > 0);
//     if (!hasSelectedProducts) {
//       alert('Please select at least one product');
//       return;
//     }

//     // Get existing cart
//     const existingCart = JSON.parse(localStorage.getItem(`vendor_cart_${currentUser.id}`) || '[]');
    
//     // Add selected products to cart
//     Object.entries(selectedProducts).forEach(([productId, quantity]) => {
//       if (quantity > 0) {
//         const product = supplier.products.find(p => p.id === parseInt(productId));
//         const cartItem = {
//           id: Date.now() + parseInt(productId), // Unique ID
//           supplierId: supplier.id,
//           supplierName: `Supplier #${supplier.id}`,
//           supplierContact: supplier.contactNumber,
//           productId: product.id,
//           productName: product.name,
//           material: product.material,
//           price: product.price,
//           quantity: quantity,
//           total: product.price * quantity,
//           bulkDiscount: bulkDiscount,
//           discountedTotal: (product.price * quantity) - ((product.price * quantity * bulkDiscount) / 100)
//         };
//         existingCart.push(cartItem);
//       }
//     });

//     // Save updated cart
//     localStorage.setItem(`vendor_cart_${currentUser.id}`, JSON.stringify(existingCart));
    
//     alert(`Added ${totalQuantity} kg of products to cart with ${bulkDiscount}% bulk discount!`);
    
//     // Reset selections
//     setSelectedProducts({});
//   };

//   const handleProceedToPayment = () => {
//     if (!currentUser) {
//       alert('Please login to proceed with payment');
//       navigate('/');
//       return;
//     }

//     if (currentUser.type !== 'vendor') {
//       alert('Only vendors can make purchases');
//       return;
//     }

//     const hasSelectedProducts = Object.values(selectedProducts).some(qty => qty > 0);
//     if (!hasSelectedProducts) {
//       alert('Please select at least one product');
//       return;
//     }

//     // Prepare order data
//     const orderItems = [];
//     Object.entries(selectedProducts).forEach(([productId, quantity]) => {
//       if (quantity > 0) {
//         const product = supplier.products.find(p => p.id === parseInt(productId));
//         orderItems.push({
//           productId: product.id,
//           productName: product.name,
//           material: product.material,
//           price: product.price,
//           quantity: quantity,
//           total: product.price * quantity
//         });
//       }
//     });

//     const orderData = {
//       supplierId: supplier.id,
//       supplierName: `Supplier #${supplier.id}`,
//       supplierContact: supplier.contactNumber,
//       items: orderItems,
//       totalQuantity: totalQuantity,
//       subtotal: totalAmount + (totalAmount * bulkDiscount) / (100 - bulkDiscount),
//       bulkDiscount: bulkDiscount,
//       totalAmount: totalAmount,
//       orderDate: new Date().toISOString()
//     };

//     navigate('/payment', { state: orderData });
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

//   const MapComponent = () => (
//     <div style={{ 
//       width: '100%', 
//       height: '300px', 
//       backgroundColor: '#f0f0f0', 
//       border: '1px solid #ccc',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       flexDirection: 'column'
//     }}>
//       <h3>📍 Location Map</h3>
//       <p>{supplier?.location}</p>
//       <p>(Interactive map would be integrated here)</p>
//       <div style={{
//         width: '200px',
//         height: '150px',
//         backgroundColor: '#e8e8e8',
//         border: '2px dashed #999',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center'
//       }}>
//         <span>Map View</span>
//       </div>
//     </div>
//   );

//   if (!supplier) {
//     return <div className="supplier-detail-container">Loading supplier details...</div>;
//   }

//   return (
//     <div className="supplier-detail-container">
//       <header className="supplier-header">
//         <h1>Supplier Details</h1>
//         <div className="supplier-header-actions">
//           <button onClick={() => navigate('/home')}>Back to Home</button>
//           {currentUser && currentUser.type === 'vendor' && (
//             <button onClick={() => navigate('/vendor')}>Vendor Dashboard</button>
//           )}
//           {!currentUser && (
//             <button onClick={() => navigate('/')}>Login</button>
//           )}
//         </div>
//       </header>

//       {/* Supplier Header Info */}
//       <div className="supplier-info">
//         <div className="supplier-info-details">
//           <h2>
//             Supplier #{supplier.id}
//             {supplier.verified && <span className="verified"> ✅ Verified</span>}
//             {!supplier.verified && <span className="not-verified"> ⚠️ Not Verified</span>}
//           </h2>
//           <p>📞 Contact: {supplier.contactNumber}</p>
//           <p>📍 Location: {supplier.location}</p>
//           <p>⭐ Rating: {renderStars(supplier.rating)} ({supplier.rating}/5)</p>
//           <p>🕒 Status: <span className={supplier.isOpen ? "open" : "closed"}>{supplier.isOpen ? 'Open' : 'Closed'}</span></p>
//           {supplier.verified && (
//             <p className="verified">✅ Verified Date: {new Date().toLocaleDateString()}</p>
//           )}
//           <button onClick={() => setShowMap(!showMap)} style={{marginTop:'0.5rem'}}>
//             {showMap ? 'Hide Map' : 'Show Location Map'}
//           </button>
//         </div>
//         <div className="supplier-info-map">
//           {/* Map Section */}
//           {showMap && <MapComponent />}
//         </div>
//       </div>

//       {/* Photos Section */}
//       <div className="supplier-photos supplier-section">
//         <h3>📸 Supplier Photos</h3>
//         <div className="supplier-photos-list">
//           {[1, 2, 3].map(i => (
//             <div key={i} className="supplier-photo">Photo {i}</div>
//           ))}
//         </div>
//       </div>

//       {/* Business Description */}
//       {supplier.description && (
//         <div className="supplier-section">
//           <h3>About This Supplier</h3>
//           <p>{supplier.description}</p>
//         </div>
//       )}

//       {/* Special Offers */}
//       {supplier.specialOffers && (
//         <div className="supplier-section">
//           <h3>🎯 Special Offers</h3>
//           <p>{supplier.specialOffers}</p>
//         </div>
//       )}

//       {/* Bulk Purchase Discount Info */}
//       <div className="supplier-section">
//         <h3>💰 Bulk Purchase Discounts</h3>
//         <ul className="bulk-discount-list">
//           <li>🔸 20+ kg: 5% discount</li>
//           <li>🔸 50+ kg: 10% discount</li>
//           <li>🔸 100+ kg: 15% discount</li>
//         </ul>
//       </div>

//       {/* Products Table */}
//       <div className="supplier-section">
//         <h3>📦 Available Products</h3>
//         {supplier.isOpen ? (
//           <div>
//             <table className="products-table">
//               <thead>
//                 <tr>
//                   <th>Material</th>
//                   <th>Price (₹/kg)</th>
//                   <th>Discount Available</th>
//                   <th>Available Quantity (kg)</th>
//                   <th>Your Quantity (kg)</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {supplier.products.map(product => {
//                   const selectedQty = selectedProducts[product.id] || 0;
//                   const productDiscount = selectedQty >= 20 ? bulkDiscount : 0;
//                   return (
//                     <tr key={product.id}>
//                       <td>
//                         <div>
//                           <strong>{product.name}</strong>
//                           <br />
//                           <small>{product.material}</small>
//                           {product.description && (
//                             <div>
//                               <em>{product.description}</em>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         <div>
//                           <strong>₹{product.price}</strong>
//                           {productDiscount > 0 && (
//                             <div>
//                               <small className="discount">
//                                 After {productDiscount}% discount: ₹{(product.price * (100 - productDiscount) / 100).toFixed(2)}
//                               </small>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                       <td>
//                         {selectedQty >= 100 ? '15%' :
//                          selectedQty >= 50 ? '10%' :
//                          selectedQty >= 20 ? '5%' : '0%'}
//                       </td>
//                       <td>
//                         <strong>{product.quantity}</strong>
//                       </td>
//                       <td>
//                         <input
//                           type="number"
//                           min="0"
//                           max={product.quantity}
//                           value={selectedQty}
//                           onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
//                           className="product-input"
//                           disabled={!supplier.isOpen}
//                         />
//                         {selectedQty > 0 && (
//                           <div>
//                             <small>
//                               Subtotal: ₹{(product.price * selectedQty).toFixed(2)}
//                               {productDiscount > 0 && (
//                                 <span className="discount">
//                                   <br />Discounted: ₹{(product.price * selectedQty * (100 - productDiscount) / 100).toFixed(2)}
//                                 </span>
//                               )}
//                             </small>
//                           </div>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>

//             {/* Order Summary */}
//             {totalQuantity > 0 && (
//               <div className="order-summary-box">
//                 <h3>📋 Order Summary</h3>
//                 <div>
//                   <p><strong>Total Quantity:</strong> {totalQuantity} kg</p>
//                   <p><strong>Subtotal:</strong> ₹{(totalAmount + (totalAmount * bulkDiscount) / (100 - bulkDiscount || 1)).toFixed(2)}</p>
//                   {bulkDiscount > 0 && (
//                     <>
//                       <p className="discount">
//                         <strong>Bulk Discount ({bulkDiscount}%):</strong> 
//                         -₹{((totalAmount * bulkDiscount) / (100 - bulkDiscount)).toFixed(2)}
//                       </p>
//                       <p className="final-total">
//                         <strong>Final Total:</strong> ₹{totalAmount.toFixed(2)}
//                       </p>
//                     </>
//                   )}
//                   {bulkDiscount === 0 && (
//                     <p className="final-total">
//                       <strong>Total:</strong> ₹{totalAmount.toFixed(2)}
//                     </p>
//                   )}
//                 </div>

//                 <div className="order-summary-actions">
//                   <button onClick={handleAddToCart}>
//                     🛒 Add to Cart
//                   </button>
//                   <button onClick={handleProceedToPayment}>
//                     💳 Proceed to Payment
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="supplier-closed">
//             <h3>🔴 Supplier Currently Closed</h3>
//             <p>This supplier is currently not accepting orders. Please check back later.</p>
//           </div>
//         )}
//       </div>

//       {/* Contact Information */}
//       <div className="contact-info-box">
//         <h3>📞 Contact Information</h3>
//         <div>
//           <p><strong>Phone:</strong> {supplier.contactNumber}</p>
//           <p><strong>Location:</strong> {supplier.location}</p>
//           <p><strong>Business Hours:</strong> {supplier.isOpen ? 'Currently Open' : 'Currently Closed'}</p>
//           {supplier.verified && (
//             <p><strong>Verification Status:</strong> ✅ Verified Supplier</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SupplierDetailPage;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./SupplierDetailPage.css";

const SupplierDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [bulkDiscount, setBulkDiscount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    // Load current user
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);

    // Load supplier data
    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    const foundSupplier = suppliers.find(s => s.id === parseInt(id));
    
    if (foundSupplier) {
      setSupplier(foundSupplier);
    } else {
      alert('Supplier not found');
      navigate('/home');
    }
  }, [id, navigate]);

  useEffect(() => {
    // Calculate totals when selected products change
    calculateTotals();
  }, [selectedProducts, supplier]);

  const calculateTotals = () => {
    if (!supplier) return;

    let totalQty = 0;
    let totalAmt = 0;

    Object.entries(selectedProducts).forEach(([productId, quantity]) => {
      const product = supplier.products.find(p => p.id === parseInt(productId));
      if (product && quantity > 0) {
        totalQty += quantity;
        totalAmt += product.price * quantity;
      }
    });

    setTotalQuantity(totalQty);

    // Apply bulk discount
    let discount = 0;
    if (totalQty >= 100) {
      discount = 15; // 15% discount for 100+ kg
    } else if (totalQty >= 50) {
      discount = 10; // 10% discount for 50+ kg
    } else if (totalQty >= 20) {
      discount = 5; // 5% discount for 20+ kg
    }

    setBulkDiscount(discount);
    const discountAmount = (totalAmt * discount) / 100;
    setTotalAmount(totalAmt - discountAmount);
  };

  const handleQuantityChange = (productId, quantity) => {
    const product = supplier.products.find(p => p.id === productId);
    if (quantity > product.quantity) {
      alert(`Only ${product.quantity} kg available for ${product.name}`);
      return;
    }

    setSelectedProducts(prev => ({
      ...prev,
      [productId]: Math.max(0, quantity)
    }));
  };

  const handleAddToCart = () => {
    if (!currentUser) {
      alert('Please login to add items to cart');
      navigate('/');
      return;
    }

    if (currentUser.type !== 'vendor') {
      alert('Only vendors can purchase products');
      return;
    }

    const hasSelectedProducts = Object.values(selectedProducts).some(qty => qty > 0);
    if (!hasSelectedProducts) {
      alert('Please select at least one product');
      return;
    }

    // Get existing cart
    const existingCart = JSON.parse(localStorage.getItem(`vendor_cart_${currentUser.id}`) || '[]');
    
    // Add selected products to cart
    Object.entries(selectedProducts).forEach(([productId, quantity]) => {
      if (quantity > 0) {
        const product = supplier.products.find(p => p.id === parseInt(productId));
        const cartItem = {
          id: Date.now() + parseInt(productId), // Unique ID
          supplierId: supplier.id,
          supplierName: `Supplier #${supplier.id}`,
          supplierContact: supplier.contactNumber,
          productId: product.id,
          productName: product.name,
          material: product.material,
          price: product.price,
          quantity: quantity,
          total: product.price * quantity,
          bulkDiscount: bulkDiscount,
          discountedTotal: (product.price * quantity) - ((product.price * quantity * bulkDiscount) / 100)
        };
        existingCart.push(cartItem);
      }
    });

    // Save updated cart
    localStorage.setItem(`vendor_cart_${currentUser.id}`, JSON.stringify(existingCart));
    
    alert(`Added ${totalQuantity} kg of products to cart with ${bulkDiscount}% bulk discount!`);
    
    // Reset selections
    setSelectedProducts({});
  };

  const handleProceedToPayment = () => {
    if (!currentUser) {
      alert('Please login to proceed with payment');
      navigate('/');
      return;
    }

    if (currentUser.type !== 'vendor') {
      alert('Only vendors can make purchases');
      return;
    }

    const hasSelectedProducts = Object.values(selectedProducts).some(qty => qty > 0);
    if (!hasSelectedProducts) {
      alert('Please select at least one product');
      return;
    }

    // Prepare order data
    const orderItems = [];
    Object.entries(selectedProducts).forEach(([productId, quantity]) => {
      if (quantity > 0) {
        const product = supplier.products.find(p => p.id === parseInt(productId));
        orderItems.push({
          productId: product.id,
          productName: product.name,
          material: product.material,
          price: product.price,
          quantity: quantity,
          total: product.price * quantity
        });
      }
    });

    const orderData = {
      supplierId: supplier.id,
      supplierName: `Supplier #${supplier.id}`,
      supplierContact: supplier.contactNumber,
      items: orderItems,
      totalQuantity: totalQuantity,
      subtotal: totalAmount + (totalAmount * bulkDiscount) / (100 - bulkDiscount),
      bulkDiscount: bulkDiscount,
      totalAmount: totalAmount,
      orderDate: new Date().toISOString()
    };

    navigate('/payment', { state: orderData });
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

  const MapComponent = () => (
    <div className="map-container">
      <div className="map-header">
        <h3>📍 Location Map</h3>
        <p>{supplier?.location}</p>
        <p>(Interactive map would be integrated here)</p>
      </div>
      <div className="map-placeholder">
        <span>Map View</span>
      </div>
    </div>
  );

  if (!supplier) {
    return <div className="loading">Loading supplier details...</div>;
  }

  return (
    <div className="dashboard-container">
      <header>
        <div>
          <h1>Supplier Details</h1>
          <div>
            <button onClick={() => navigate('/home')}>Back to Home</button>
            {currentUser && currentUser.type === 'vendor' && (
              <button onClick={() => navigate('/vendor')}>Vendor Dashboard</button>
            )}
            {!currentUser && (
              <button onClick={() => navigate('/')}>Login</button>
            )}
          </div>
        </div>
      </header>

      {/* Supplier Header Info */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>
            Supplier #{supplier.id}
            {supplier.verified && <span className="verified-badge"> ✅ Verified</span>}
            {!supplier.verified && <span className="not-verified-badge"> ⚠️ Not Verified</span>}
          </h2>
          <div className="supplier-status">
            <span className={supplier.isOpen ? "status-open" : "status-closed"}>
              {supplier.isOpen ? '🟢 Open' : '🔴 Closed'}
            </span>
          </div>
        </div>
        <div className="section-content">
          <div className="supplier-info-grid">
            <div className="supplier-info-details">
              <div className="info-item">
                <span className="info-label">📞 Contact:</span>
                <span className="info-value">{supplier.contactNumber}</span>
              </div>
              <div className="info-item">
                <span className="info-label">📍 Location:</span>
                <span className="info-value">{supplier.location}</span>
              </div>
              <div className="info-item">
                <span className="info-label">⭐ Rating:</span>
                <span className="info-value">
                  <span className="star-rating">{renderStars(supplier.rating)}</span>
                  ({supplier.rating}/5)
                </span>
              </div>
              {supplier.verified && (
                <div className="info-item">
                  <span className="info-label">✅ Verified Date:</span>
                  <span className="info-value">{new Date().toLocaleDateString()}</span>
                </div>
              )}
              <button 
                className="btn-secondary"
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? 'Hide Map' : 'Show Location Map'}
              </button>
            </div>
            <div className="supplier-map-section">
              {showMap && <MapComponent />}
            </div>
          </div>
        </div>
      </div>

      {/* Photos Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>📸 Supplier Photos</h2>
        </div>
        <div className="section-content">
          <div className="photos-grid">
            {[1, 2, 3].map(i => (
              <div key={i} className="photo-placeholder">
                <span>Photo {i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Business Description */}
      {supplier.description && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>About This Supplier</h2>
          </div>
          <div className="section-content">
            <p className="description-text">{supplier.description}</p>
          </div>
        </div>
      )}

      {/* Special Offers */}
      {supplier.specialOffers && (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>🎯 Special Offers</h2>
          </div>
          <div className="section-content">
            <div className="special-offers-box">
              <p>{supplier.specialOffers}</p>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Purchase Discount Info */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>💰 Bulk Purchase Discounts</h2>
        </div>
        <div className="section-content">
          <div className="discount-info-grid">
            <div className="discount-card">
              <div className="discount-icon">🔸</div>
              <div className="discount-details">
                <h4>20+ kg</h4>
                <p>5% discount</p>
              </div>
            </div>
            <div className="discount-card">
              <div className="discount-icon">🔸</div>
              <div className="discount-details">
                <h4>50+ kg</h4>
                <p>10% discount</p>
              </div>
            </div>
            <div className="discount-card">
              <div className="discount-icon">🔸</div>
              <div className="discount-details">
                <h4>100+ kg</h4>
                <p>15% discount</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>📦 Available Products</h2>
        </div>
        <div className="section-content">
          {supplier.isOpen ? (
            <div>
              <div className="products-table-container">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Price (₹/kg)</th>
                      <th>Discount Available</th>
                      <th>Available Quantity (kg)</th>
                      <th>Your Quantity (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplier.products.map(product => {
                      const selectedQty = selectedProducts[product.id] || 0;
                      const productDiscount = selectedQty >= 20 ? bulkDiscount : 0;
                      return (
                        <tr key={product.id}>
                          <td>
                            <div className="product-info">
                              <strong className="product-name">{product.name}</strong>
                              <div className="product-material">{product.material}</div>
                              {product.description && (
                                <div className="product-description">
                                  <em>{product.description}</em>
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="price-info">
                              <strong className="original-price">₹{product.price}</strong>
                              {productDiscount > 0 && (
                                <div className="discounted-price">
                                  After {productDiscount}% discount: ₹{(product.price * (100 - productDiscount) / 100).toFixed(2)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="discount-badge">
                              {selectedQty >= 100 ? '15%' :
                               selectedQty >= 50 ? '10%' :
                               selectedQty >= 20 ? '5%' : '0%'}
                            </span>
                          </td>
                          <td>
                            <strong className="available-quantity">{product.quantity}</strong>
                          </td>
                          <td>
                            <div className="quantity-input-container">
                              <input
                                type="number"
                                min="0"
                                max={product.quantity}
                                value={selectedQty}
                                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                                className="quantity-input"
                                disabled={!supplier.isOpen}
                              />
                              {selectedQty > 0 && (
                                <div className="subtotal-info">
                                  <div className="subtotal">
                                    Subtotal: ₹{(product.price * selectedQty).toFixed(2)}
                                  </div>
                                  {productDiscount > 0 && (
                                    <div className="discounted-subtotal">
                                      Discounted: ₹{(product.price * selectedQty * (100 - productDiscount) / 100).toFixed(2)}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Order Summary */}
              {totalQuantity > 0 && (
                <div className="order-summary">
                  <div className="order-summary-header">
                    <h3>📋 Order Summary</h3>
                  </div>
                  <div className="order-summary-content">
                    <div className="summary-row">
                      <span className="summary-label">Total Quantity:</span>
                      <span className="summary-value">{totalQuantity} kg</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Subtotal:</span>
                      <span className="summary-value">₹{(totalAmount + (totalAmount * bulkDiscount) / (100 - bulkDiscount || 1)).toFixed(2)}</span>
                    </div>
                    {bulkDiscount > 0 && (
                      <>
                        <div className="summary-row discount-row">
                          <span className="summary-label">Bulk Discount ({bulkDiscount}%):</span>
                          <span className="summary-value discount">
                            -₹{((totalAmount * bulkDiscount) / (100 - bulkDiscount)).toFixed(2)}
                          </span>
                        </div>
                        <div className="summary-row final-total-row">
                          <span className="summary-label">Final Total:</span>
                          <span className="summary-value final-total">₹{totalAmount.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                    {bulkDiscount === 0 && (
                      <div className="summary-row final-total-row">
                        <span className="summary-label">Total:</span>
                        <span className="summary-value final-total">₹{totalAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  <div className="order-summary-actions">
                    <button className="btn-secondary" onClick={handleAddToCart}>
                      🛒 Add to Cart
                    </button>
                    <button className="btn-primary" onClick={handleProceedToPayment}>
                      💳 Proceed to Payment
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="supplier-closed">
              <div className="closed-icon">🔴</div>
              <h3>Supplier Currently Closed</h3>
              <p>This supplier is currently not accepting orders. Please check back later.</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>📞 Contact Information</h2>
        </div>
        <div className="section-content">
          <div className="contact-info-grid">
            <div className="contact-item">
              <span className="contact-label">Phone:</span>
              <span className="contact-value">{supplier.contactNumber}</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Location:</span>
              <span className="contact-value">{supplier.location}</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">Business Hours:</span>
              <span className="contact-value">
                <span className={supplier.isOpen ? "status-open" : "status-closed"}>
                  {supplier.isOpen ? 'Currently Open' : 'Currently Closed'}
                </span>
              </span>
            </div>
            {supplier.verified && (
              <div className="contact-item">
                <span className="contact-label">Verification Status:</span>
                <span className="contact-value verified">✅ Verified Supplier</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierDetailPage;