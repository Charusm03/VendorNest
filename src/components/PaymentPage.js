// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import "./PaymentPage.css";

// const PaymentPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [currentUser, setCurrentUser] = useState(null);
//   const [orderData, setOrderData] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState('upi');
//   const [paymentDetails, setPaymentDetails] = useState({
//     // UPI details
//     upiId: '',
//     // Card details
//     cardNumber: '',
//     cardHolderName: '',
//     expiryMonth: '',
//     expiryYear: '',
//     cvv: '',
//     // Net Banking
//     bankName: '',
//     // Cash on Delivery
//     deliveryAddress: '',
//     phoneNumber: '',
//     // Common
//     billingAddress: ''
//   });
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [orderSummary, setOrderSummary] = useState({
//     subtotal: 0,
//     discount: 0,
//     deliveryCharges: 0,
//     tax: 0,
//     total: 0
//   });

//   useEffect(() => {
//     // Check authentication
//     const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
//     if (!user || user.type !== 'vendor') {
//       alert('Please login as vendor to make payments');
//       navigate('/');
//       return;
//     }
//     setCurrentUser(user);

//     // Get order data from navigation state or cart
//     if (location.state) {
//       setOrderData(location.state);
//       calculateOrderSummary(location.state);
//     } else {
//       // Load from cart if no direct order data
//       const cart = JSON.parse(localStorage.getItem(`vendor_cart_${user.id}`) || '[]');
//       if (cart.length === 0) {
//         alert('No items in cart');
//         navigate('/vendor');
//         return;
//       }
      
//       const cartOrderData = {
//         cart: cart,
//         totalAmount: cart.reduce((sum, item) => sum + (item.discountedTotal || item.total), 0),
//         totalQuantity: cart.reduce((sum, item) => sum + item.quantity, 0)
//       };
//       setOrderData(cartOrderData);
//       calculateOrderSummary(cartOrderData);
//     }
//   }, [navigate, location.state]);

//   const calculateOrderSummary = (data) => {
//     let subtotal = 0;
//     let discount = 0;

//     if (data.cart) {
//       // From cart
//       subtotal = data.cart.reduce((sum, item) => sum + item.total, 0);
//       discount = data.cart.reduce((sum, item) => {
//         const itemDiscount = item.total - (item.discountedTotal || item.total);
//         return sum + itemDiscount;
//       }, 0);
//     } else if (data.items) {
//       // Direct order from supplier detail page
//       subtotal = data.subtotal || data.items.reduce((sum, item) => sum + item.total, 0);
//       discount = (subtotal * (data.bulkDiscount || 0)) / 100;
//     }

//     const deliveryCharges = subtotal > 500 ? 0 : 50; // Free delivery above ₹500
//     const tax = (subtotal - discount) * 0.05; // 5% tax
//     const total = subtotal - discount + deliveryCharges + tax;

//     setOrderSummary({
//       subtotal: subtotal,
//       discount: discount,
//       deliveryCharges: deliveryCharges,
//       tax: tax,
//       total: total
//     });
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setPaymentDetails(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const validatePaymentDetails = () => {
//     switch (paymentMethod) {
//       case 'upi':
//         if (!paymentDetails.upiId) {
//           alert('Please enter UPI ID');
//           return false;
//         }
//         if (!paymentDetails.upiId.includes('@')) {
//           alert('Please enter valid UPI ID');
//           return false;
//         }
//         break;
      
//       case 'card':
//         if (!paymentDetails.cardNumber || paymentDetails.cardNumber.length < 16) {
//           alert('Please enter valid card number');
//           return false;
//         }
//         if (!paymentDetails.cardHolderName) {
//           alert('Please enter card holder name');
//           return false;
//         }
//         if (!paymentDetails.expiryMonth || !paymentDetails.expiryYear) {
//           alert('Please enter card expiry date');
//           return false;
//         }
//         if (!paymentDetails.cvv || paymentDetails.cvv.length < 3) {
//           alert('Please enter valid CVV');
//           return false;
//         }
//         break;
      
//       case 'netbanking':
//         if (!paymentDetails.bankName) {
//           alert('Please select bank');
//           return false;
//         }
//         break;
      
//       case 'cod':
//         if (!paymentDetails.deliveryAddress) {
//           alert('Please enter delivery address');
//           return false;
//         }
//         if (!paymentDetails.phoneNumber) {
//           alert('Please enter phone number');
//           return false;
//         }
//         break;
//     }
//     return true;
//   };

//   const processPayment = async () => {
//     if (!validatePaymentDetails()) return;

//     setIsProcessing(true);

//     // Simulate payment processing
//     setTimeout(() => {
//       // Create order record
//       const order = {
//         id: Date.now(),
//         vendorId: currentUser.id,
//         vendorName: currentUser.username,
//         orderDate: new Date().toISOString(),
//         paymentMethod: paymentMethod,
//         orderSummary: orderSummary,
//         status: paymentMethod === 'cod' ? 'confirmed' : 'paid',
//         items: orderData.cart || orderData.items || [],
//         supplierId: orderData.supplierId,
//         supplierName: orderData.supplierName,
//         supplierContact: orderData.supplierContact,
//         deliveryAddress: paymentDetails.deliveryAddress || paymentDetails.billingAddress,
//         estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days from now
//       };

//       // Save order
//       const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
//       existingOrders.push(order);
//       localStorage.setItem('orders', JSON.stringify(existingOrders));

//       // Clear cart if payment from cart
//       if (orderData.cart) {
//         localStorage.removeItem(`vendor_cart_${currentUser.id}`);
//       }

//       // Update supplier product quantities
//       updateSupplierStock(order.items);

//       setIsProcessing(false);
      
//       // Show success message and redirect
//       alert(`Order placed successfully! Order ID: ${order.id}`);
//       navigate('/vendor');
//     }, 3000); // 3 second delay to simulate processing
//   };

//   const updateSupplierStock = (items) => {
//     const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    
//     items.forEach(item => {
//       const supplierIndex = suppliers.findIndex(s => s.id === item.supplierId);
//       if (supplierIndex !== -1) {
//         const productIndex = suppliers[supplierIndex].products.findIndex(p => p.id === item.productId);
//         if (productIndex !== -1) {
//           suppliers[supplierIndex].products[productIndex].quantity -= item.quantity;
//           // Remove product if quantity becomes 0
//           if (suppliers[supplierIndex].products[productIndex].quantity <= 0) {
//             suppliers[supplierIndex].products.splice(productIndex, 1);
//           }
//         }
//       }
//     });
    
//     localStorage.setItem('suppliers', JSON.stringify(suppliers));
//   };

//   const renderPaymentForm = () => {
//     switch (paymentMethod) {
//       case 'upi':
//         return (
//           <div className="payment-form fade-in">
//             <h4>UPI Payment</h4>
//             <div className="form-group">
//               <label>UPI ID:</label>
//               <input
//                 type="text"
//                 name="upiId"
//                 value={paymentDetails.upiId}
//                 onChange={handleInputChange}
//                 placeholder="yourname@upi"
//                 required
//               />
//             </div>
//             <div className="form-info">
//               <p>Popular UPI Apps: PhonePe, Google Pay, Paytm, BHIM</p>
//             </div>
//           </div>
//         );

//       case 'card':
//         return (
//           <div className="payment-form fade-in">
//             <h4>Credit/Debit Card</h4>
//             <div className="form-group">
//               <label>Card Number:</label>
//               <input
//                 type="text"
//                 name="cardNumber"
//                 value={paymentDetails.cardNumber}
//                 onChange={handleInputChange}
//                 placeholder="1234 5678 9012 3456"
//                 maxLength="19"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Card Holder Name:</label>
//               <input
//                 type="text"
//                 name="cardHolderName"
//                 value={paymentDetails.cardHolderName}
//                 onChange={handleInputChange}
//                 placeholder="Name as on card"
//                 required
//               />
//             </div>
//             <div className="form-row">
//               <div className="form-group">
//                 <label>Expiry Month:</label>
//                 <select
//                   name="expiryMonth"
//                   value={paymentDetails.expiryMonth}
//                   onChange={handleInputChange}
//                   required
//                 >
//                   <option value="">MM</option>
//                   {Array.from({ length: 12 }, (_, i) => (
//                     <option key={i + 1} value={i + 1}>
//                       {String(i + 1).padStart(2, '0')}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>Expiry Year:</label>
//                 <select
//                   name="expiryYear"
//                   value={paymentDetails.expiryYear}
//                   onChange={handleInputChange}
//                   required
//                 >
//                   <option value="">YYYY</option>
//                   {Array.from({ length: 10 }, (_, i) => (
//                     <option key={i} value={new Date().getFullYear() + i}>
//                       {new Date().getFullYear() + i}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-group">
//                 <label>CVV:</label>
//                 <input
//                   type="text"
//                   name="cvv"
//                   value={paymentDetails.cvv}
//                   onChange={handleInputChange}
//                   placeholder="123"
//                   maxLength="4"
//                   required
//                 />
//               </div>
//             </div>
//           </div>
//         );

//       case 'netbanking':
//         return (
//           <div className="payment-form fade-in">
//             <h4>Net Banking</h4>
//             <div className="form-group">
//               <label>Select Bank:</label>
//               <select
//                 name="bankName"
//                 value={paymentDetails.bankName}
//                 onChange={handleInputChange}
//                 required
//               >
//                 <option value="">Choose Bank</option>
//                 <option value="sbi">State Bank of India</option>
//                 <option value="hdfc">HDFC Bank</option>
//                 <option value="icici">ICICI Bank</option>
//                 <option value="axis">Axis Bank</option>
//                 <option value="pnb">Punjab National Bank</option>
//                 <option value="bob">Bank of Baroda</option>
//                 <option value="canara">Canara Bank</option>
//                 <option value="union">Union Bank</option>
//               </select>
//             </div>
//             <div className="form-info">
//               <p>You will be redirected to your bank's website to complete the payment.</p>
//             </div>
//           </div>
//         );

//       case 'cod':
//         return (
//           <div className="payment-form fade-in">
//             <h4>Cash on Delivery</h4>
//             <div className="form-group">
//               <label>Delivery Address:</label>
//               <textarea
//                 name="deliveryAddress"
//                 value={paymentDetails.deliveryAddress}
//                 onChange={handleInputChange}
//                 placeholder="Enter complete delivery address"
//                 rows="3"
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Phone Number:</label>
//               <input
//                 type="tel"
//                 name="phoneNumber"
//                 value={paymentDetails.phoneNumber}
//                 onChange={handleInputChange}
//                 placeholder="Mobile number for delivery"
//                 required
//               />
//             </div>
//             <div className="form-info">
//               <p>Additional COD charges: ₹20</p>
//               <p>Please keep exact change ready for the delivery person.</p>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   if (!currentUser || !orderData) {
//     return <div className="loading-container">Loading...</div>;
//   }

//   return (
//     <div>
//       <header>
//         <div>
//           <h1>Payment Processing</h1>
//           <div>
//             <button onClick={() => navigate(-1)}>Back</button>
//             <button onClick={() => navigate('/vendor')}>Cancel Order</button>
//           </div>
//         </div>
//       </header>

//       <div className="payment-container">
//         {/* Order Summary */}
//         <div className="order-summary">
//           <h2>Order Summary</h2>
//           <div>
//             <h3>Items Ordered:</h3>
//             {orderData.cart ? (
//               // From cart
//               orderData.cart.map((item, index) => (
//                 <div key={index} className="order-item">
//                   <div>
//                     <h4>{item.productName} ({item.material})</h4>
//                     <p>Supplier: {item.supplierName}</p>
//                     <p>Quantity: {item.quantity} kg</p>
//                     <p>Price: ₹{item.price}/kg</p>
//                     <p>Subtotal: ₹{item.total}</p>
//                     {item.bulkDiscount > 0 && (
//                       <p>Discount ({item.bulkDiscount}%): -₹{(item.total - item.discountedTotal).toFixed(2)}</p>
//                     )}
//                     <p><strong>Total: ₹{(item.discountedTotal || item.total).toFixed(2)}</strong></p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               // Direct order
//               orderData.items?.map((item, index) => (
//                 <div key={index} className="order-item">
//                   <div>
//                     <h4>{item.productName} ({item.material})</h4>
//                     <p>Quantity: {item.quantity} kg</p>
//                     <p>Price: ₹{item.price}/kg</p>
//                     <p>Total: ₹{item.total}</p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           <div className="price-breakdown">
//             <h3>Price Breakdown:</h3>
//             <div>
//               <p><span>Subtotal:</span> <span>₹{orderSummary.subtotal.toFixed(2)}</span></p>
//               {orderSummary.discount > 0 && (
//                 <p><span>Bulk Discount:</span> <span>-₹{orderSummary.discount.toFixed(2)}</span></p>
//               )}
//               <p><span>Delivery Charges:</span> <span>{orderSummary.deliveryCharges > 0 ? `₹${orderSummary.deliveryCharges}` : 'FREE'}</span></p>
//               <p><span>Tax (5%):</span> <span>₹{orderSummary.tax.toFixed(2)}</span></p>
//               {paymentMethod === 'cod' && <p><span>COD Charges:</span> <span>₹20</span></p>}
//               <div>
//                 <strong>
//                   <span>Total Amount:</span> <span>₹{(orderSummary.total + (paymentMethod === 'cod' ? 20 : 0)).toFixed(2)}</span>
//                 </strong>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Payment Section */}
//         <div className="payment-section">
//           {/* Payment Methods */}
//           <div>
//             <h2>Payment Method</h2>
//             <div className="payment-methods">
//               <div className={`payment-method ${paymentMethod === 'upi' ? 'selected' : ''}`}>
//                 <input
//                   type="radio"
//                   id="upi"
//                   name="paymentMethod"
//                   value="upi"
//                   checked={paymentMethod === 'upi'}
//                   onChange={(e) => setPaymentMethod(e.target.value)}
//                 />
//                 <label htmlFor="upi">UPI Payment</label>
//               </div>
//               <div className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}>
//                 <input
//                   type="radio"
//                   id="card"
//                   name="paymentMethod"
//                   value="card"
//                   checked={paymentMethod === 'card'}
//                   onChange={(e) => setPaymentMethod(e.target.value)}
//                 />
//                 <label htmlFor="card">Credit/Debit Card</label>
//               </div>
//               <div className={`payment-method ${paymentMethod === 'netbanking' ? 'selected' : ''}`}>
//                 <input
//                   type="radio"
//                   id="netbanking"
//                   name="paymentMethod"
//                   value="netbanking"
//                   checked={paymentMethod === 'netbanking'}
//                   onChange={(e) => setPaymentMethod(e.target.value)}
//                 />
//                 <label htmlFor="netbanking">Net Banking</label>
//               </div>
//               <div className={`payment-method ${paymentMethod === 'cod' ? 'selected' : ''}`}>
//                 <input
//                   type="radio"
//                   id="cod"
//                   name="paymentMethod"
//                   value="cod"
//                   checked={paymentMethod === 'cod'}
//                   onChange={(e) => setPaymentMethod(e.target.value)}
//                 />
//                 <label htmlFor="cod">Cash on Delivery</label>
//               </div>
//             </div>
//           </div>

//           {/* Payment Form */}
//           <div>
//             {renderPaymentForm()}
//           </div>

//           {/* Billing Address */}
//           <div className="billing-section">
//             <h3>Billing Address</h3>
//             <div className="form-group">
//               <label>Address:</label>
//               <textarea
//                 name="billingAddress"
//                 value={paymentDetails.billingAddress}
//                 onChange={handleInputChange}
//                 placeholder="Enter billing address"
//                 rows="3"
//                 required
//               />
//             </div>
//           </div>

//           {/* Processing Button */}
//           <div>
//             <button 
//               className="pay-button"
//               onClick={processPayment}
//               disabled={isProcessing}
//             >
//               {isProcessing ? 'Processing Payment...' : `Pay ₹${(orderSummary.total + (paymentMethod === 'cod' ? 20 : 0)).toFixed(2)}`}
//             </button>
//           </div>
//         </div>

//         {/* Processing Overlay */}
//         {isProcessing && (
//           <div className="processing-overlay">
//             <div className="processing-content">
//               <p>Processing your payment...</p>
//               <p>Please do not refresh or close this page.</p>
//               <div className="processing-spinner"></div>
//             </div>
//           </div>
//         )}

//         {/* Security Info */}
//         <div className="security-info">
//           <h3>🔒 Security Information</h3>
//           <div className="security-features">
//             <p>✅ Your payment information is secure and encrypted</p>
//             <p>✅ We do not store your card or banking details</p>
//             <p>✅ All transactions are processed through secure payment gateways</p>
//             <p>✅ You will receive order confirmation via SMS and email</p>
//           </div>
//         </div>

//         {/* Terms and Conditions */}
//         <div className="terms-section">
//           <h4>Terms & Conditions:</h4>
//           <div className="terms-list">
//             <p>Delivery within 2-3 business days</p>
//             <p>Free delivery on orders above ₹500</p>
//             <p>COD orders are subject to verification</p>
//             <p>Cancellation allowed within 1 hour of order placement</p>
//             <p>Refunds processed within 5-7 business days</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./PaymentPage.css";

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentDetails, setPaymentDetails] = useState({
    // UPI details
    upiId: '',
    // Card details
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    // Net Banking
    bankName: '',
    // Cash on Delivery
    deliveryAddress: '',
    phoneNumber: '',
    // Common
    billingAddress: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    discount: 0,
    deliveryCharges: 0,
    tax: 0,
    total: 0
  });

  useEffect(() => {
    // Check authentication
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user || user.type !== 'vendor') {
      alert('Please login as vendor to make payments');
      navigate('/');
      return;
    }
    setCurrentUser(user);

    // Get order data from navigation state or cart
    if (location.state) {
      setOrderData(location.state);
      calculateOrderSummary(location.state);
    } else {
      // Load from cart if no direct order data
      const cart = JSON.parse(localStorage.getItem(`vendor_cart_${user.id}`) || '[]');
      if (cart.length === 0) {
        alert('No items in cart');
        navigate('/vendor');
        return;
      }
      
      const cartOrderData = {
        cart: cart,
        totalAmount: cart.reduce((sum, item) => sum + (item.discountedTotal || item.total), 0),
        totalQuantity: cart.reduce((sum, item) => sum + item.quantity, 0)
      };
      setOrderData(cartOrderData);
      calculateOrderSummary(cartOrderData);
    }
  }, [navigate, location.state]);

  const calculateOrderSummary = (data) => {
    let subtotal = 0;
    let discount = 0;

    if (data.cart) {
      // From cart
      subtotal = data.cart.reduce((sum, item) => sum + item.total, 0);
      discount = data.cart.reduce((sum, item) => {
        const itemDiscount = item.total - (item.discountedTotal || item.total);
        return sum + itemDiscount;
      }, 0);
    } else if (data.items) {
      // Direct order from supplier detail page
      subtotal = data.subtotal || data.items.reduce((sum, item) => sum + item.total, 0);
      discount = (subtotal * (data.bulkDiscount || 0)) / 100;
    }

    const deliveryCharges = subtotal > 500 ? 0 : 50; // Free delivery above ₹500
    const tax = (subtotal - discount) * 0.05; // 5% tax
    const total = subtotal - discount + deliveryCharges + tax;

    setOrderSummary({
      subtotal: subtotal,
      discount: discount,
      deliveryCharges: deliveryCharges,
      tax: tax,
      total: total
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePaymentDetails = () => {
    switch (paymentMethod) {
      case 'upi':
        if (!paymentDetails.upiId) {
          alert('Please enter UPI ID');
          return false;
        }
        if (!paymentDetails.upiId.includes('@')) {
          alert('Please enter valid UPI ID');
          return false;
        }
        break;
      
      case 'card':
        if (!paymentDetails.cardNumber || paymentDetails.cardNumber.length < 16) {
          alert('Please enter valid card number');
          return false;
        }
        if (!paymentDetails.cardHolderName) {
          alert('Please enter card holder name');
          return false;
        }
        if (!paymentDetails.expiryMonth || !paymentDetails.expiryYear) {
          alert('Please enter card expiry date');
          return false;
        }
        if (!paymentDetails.cvv || paymentDetails.cvv.length < 3) {
          alert('Please enter valid CVV');
          return false;
        }
        break;
      
      case 'netbanking':
        if (!paymentDetails.bankName) {
          alert('Please select bank');
          return false;
        }
        break;
      
      case 'cod':
        if (!paymentDetails.deliveryAddress) {
          alert('Please enter delivery address');
          return false;
        }
        if (!paymentDetails.phoneNumber) {
          alert('Please enter phone number');
          return false;
        }
        break;
    }
    return true;
  };

  const processPayment = async () => {
    if (!validatePaymentDetails()) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Create order record
      const order = {
        id: Date.now(),
        vendorId: currentUser.id,
        vendorName: currentUser.username,
        orderDate: new Date().toISOString(),
        paymentMethod: paymentMethod,
        orderSummary: orderSummary,
        status: paymentMethod === 'cod' ? 'confirmed' : 'paid',
        items: orderData.cart || orderData.items || [],
        supplierId: orderData.supplierId,
        supplierName: orderData.supplierName,
        supplierContact: orderData.supplierContact,
        deliveryAddress: paymentDetails.deliveryAddress || paymentDetails.billingAddress,
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days from now
      };

      // Save order
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      // Clear cart if payment from cart
      if (orderData.cart) {
        localStorage.removeItem(`vendor_cart_${currentUser.id}`);
      }

      // Update supplier product quantities
      updateSupplierStock(order.items);

      setIsProcessing(false);
      
      // Show success message and redirect
      alert(`Order placed successfully! Order ID: ${order.id}`);
      navigate('/vendor');
    }, 3000); // 3 second delay to simulate processing
  };

  const updateSupplierStock = (items) => {
    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    
    items.forEach(item => {
      const supplierIndex = suppliers.findIndex(s => s.id === item.supplierId);
      if (supplierIndex !== -1) {
        const productIndex = suppliers[supplierIndex].products.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
          suppliers[supplierIndex].products[productIndex].quantity -= item.quantity;
          // Remove product if quantity becomes 0
          if (suppliers[supplierIndex].products[productIndex].quantity <= 0) {
            suppliers[supplierIndex].products.splice(productIndex, 1);
          }
        }
      }
    });
    
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
  };

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'upi':
        return (
          <div className="payment-form fade-in">
            <h4>UPI Payment</h4>
            <div className="form-group">
              <label>UPI ID:</label>
              <input
                type="text"
                name="upiId"
                value={paymentDetails.upiId}
                onChange={handleInputChange}
                placeholder="yourname@upi"
                required
              />
            </div>
            <div className="form-info">
              <p>Popular UPI Apps: PhonePe, Google Pay, Paytm, BHIM</p>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="payment-form fade-in">
            <h4>Credit/Debit Card</h4>
            <div className="form-group">
              <label>Card Number:</label>
              <input
                type="text"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                required
              />
            </div>
            <div className="form-group">
              <label>Card Holder Name:</label>
              <input
                type="text"
                name="cardHolderName"
                value={paymentDetails.cardHolderName}
                onChange={handleInputChange}
                placeholder="Name as on card"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Month:</label>
                <select
                  name="expiryMonth"
                  value={paymentDetails.expiryMonth}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Expiry Year:</label>
                <select
                  name="expiryYear"
                  value={paymentDetails.expiryYear}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">YYYY</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={new Date().getFullYear() + i}>
                      {new Date().getFullYear() + i}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>CVV:</label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentDetails.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  maxLength="4"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 'netbanking':
        return (
          <div className="payment-form fade-in">
            <h4>Net Banking</h4>
            <div className="form-group">
              <label>Select Bank:</label>
              <select
                name="bankName"
                value={paymentDetails.bankName}
                onChange={handleInputChange}
                required
              >
                <option value="">Choose Bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="pnb">Punjab National Bank</option>
                <option value="bob">Bank of Baroda</option>
                <option value="canara">Canara Bank</option>
                <option value="union">Union Bank</option>
              </select>
            </div>
            <div className="form-info">
              <p>You will be redirected to your bank's website to complete the payment.</p>
            </div>
          </div>
        );

      case 'cod':
        return (
          <div className="payment-form fade-in">
            <h4>Cash on Delivery</h4>
            <div className="form-group">
              <label>Delivery Address:</label>
              <textarea
                name="deliveryAddress"
                value={paymentDetails.deliveryAddress}
                onChange={handleInputChange}
                placeholder="Enter complete delivery address"
                rows="3"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <input
                type="tel"
                name="phoneNumber"
                value={paymentDetails.phoneNumber}
                onChange={handleInputChange}
                placeholder="Mobile number for delivery"
                required
              />
            </div>
            <div className="form-info">
              <p>Additional COD charges: ₹20</p>
              <p>Please keep exact change ready for the delivery person.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!currentUser || !orderData) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <div className="page-wrapper">
      <header>
        <div>
          <h1>Payment Processing</h1>
          <div>
            <button onClick={() => navigate(-1)}>Back</button>
            <button onClick={() => navigate('/vendor')}>Cancel Order</button>
          </div>
        </div>
      </header>

      <div className="payment-container">
        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>
          
          <div>
            <h3>Items Ordered:</h3>
            <div className="order-items-container">
              {orderData.cart ? (
                // From cart
                orderData.cart.map((item, index) => (
                  <div key={index} className="order-item">
                    <div>
                      <h4>{item.productName} ({item.material})</h4>
                      <p>Supplier: {item.supplierName}</p>
                      <p>Quantity: {item.quantity} kg</p>
                      <p>Price: ₹{item.price}/kg</p>
                      <p>Subtotal: ₹{item.total}</p>
                      {item.bulkDiscount > 0 && (
                        <p>Discount ({item.bulkDiscount}%): -₹{(item.total - item.discountedTotal).toFixed(2)}</p>
                      )}
                      <p><strong>Total: ₹{(item.discountedTotal || item.total).toFixed(2)}</strong></p>
                    </div>
                  </div>
                ))
              ) : (
                // Direct order
                orderData.items?.map((item, index) => (
                  <div key={index} className="order-item">
                    <div>
                      <h4>{item.productName} ({item.material})</h4>
                      <p>Quantity: {item.quantity} kg</p>
                      <p>Price: ₹{item.price}/kg</p>
                      <p>Total: ₹{item.total}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="price-breakdown">
            <h3>Price Breakdown:</h3>
            <div>
              <p><span>Subtotal:</span> <span>₹{orderSummary.subtotal.toFixed(2)}</span></p>
              {orderSummary.discount > 0 && (
                <p><span>Bulk Discount:</span> <span>-₹{orderSummary.discount.toFixed(2)}</span></p>
              )}
              <p><span>Delivery Charges:</span> <span>{orderSummary.deliveryCharges > 0 ? `₹${orderSummary.deliveryCharges}` : 'FREE'}</span></p>
              <p><span>Tax (5%):</span> <span>₹{orderSummary.tax.toFixed(2)}</span></p>
              {paymentMethod === 'cod' && <p><span>COD Charges:</span> <span>₹20</span></p>}
              <div>
                <strong>
                  <span>Total Amount:</span> <span>₹{(orderSummary.total + (paymentMethod === 'cod' ? 20 : 0)).toFixed(2)}</span>
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="payment-section">
          {/* Payment Methods */}
          <div>
            <h2>Payment Method</h2>
            <div className="payment-methods">
              <div className={`payment-method ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  id="upi"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="upi">UPI Payment</label>
              </div>
              <div className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="card">Credit/Debit Card</label>
              </div>
              <div className={`payment-method ${paymentMethod === 'netbanking' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  id="netbanking"
                  name="paymentMethod"
                  value="netbanking"
                  checked={paymentMethod === 'netbanking'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="netbanking">Net Banking</label>
              </div>
              <div className={`payment-method ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="cod">Cash on Delivery</label>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            {renderPaymentForm()}
          </div>

          {/* Billing Address */}
          <div className="billing-section">
            <h3>Billing Address</h3>
            <div className="form-group">
              <label>Address:</label>
              <textarea
                name="billingAddress"
                value={paymentDetails.billingAddress}
                onChange={handleInputChange}
                placeholder="Enter billing address"
                rows="3"
                required
              />
            </div>
          </div>

          {/* Processing Button */}
          <div>
            <button 
              className="pay-button"
              onClick={processPayment}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing Payment...' : `Pay ₹${(orderSummary.total + (paymentMethod === 'cod' ? 20 : 0)).toFixed(2)}`}
            </button>
          </div>
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="processing-overlay">
            <div className="processing-content">
              <p>Processing your payment...</p>
              <p>Please do not refresh or close this page.</p>
              <div className="processing-spinner"></div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Sections - Static at bottom */}
      <div className="footer-sections">
        {/* Security Info */}
        <div className="security-info">
          <div className="security-info-container">
            <h3>🔒 Security Information</h3>
            <div className="security-features">
              <p>✅ Your payment information is secure and encrypted</p>
              <p>✅ We do not store your card or banking details</p>
              <p>✅ All transactions are processed through secure payment gateways</p>
              <p>✅ You will receive order confirmation via SMS and email</p>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="terms-section">
          <div className="terms-section-container">
            <h4>Terms & Conditions:</h4>
            <div className="terms-list">
              <p>Delivery within 2-3 business days</p>
              <p>Free delivery on orders above ₹500</p>
              <p>COD orders are subject to verification</p>
              <p>Cancellation allowed within 1 hour of order placement</p>
              <p>Refunds processed within 5-7 business days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;