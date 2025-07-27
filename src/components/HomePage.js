import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./HomePage.css"; // Make sure to import the CSS file

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('vendors');
  const [suppliers, setSuppliers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load suppliers from localStorage
    const storedSuppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    
    // Add sample data if no suppliers exist
    if (storedSuppliers.length === 0) {
      const sampleSuppliers = [
        {
          id: 1,
          mobile: '9876543210',
          gstin: 'GST123456789',
          verified: true,
          products: [
            { name: 'Rice', price: 50, quantity: 100, material: 'Basmati Rice' },
            { name: 'Wheat', price: 30, quantity: 200, material: 'Whole Wheat' }
          ],
          location: 'Chennai, Tamil Nadu',
          isOpen: true,
          rating: 4.5,
          contactNumber: '9876543210'
        },
        {
          id: 2,
          mobile: '9876543211',
          gstin: 'GST123456790',
          verified: true,
          products: [
            { name: 'Sugar', price: 40, quantity: 150, material: 'White Sugar' },
            { name: 'Salt', price: 20, quantity: 300, material: 'Iodized Salt' }
          ],
          location: 'Bangalore, Karnataka',
          isOpen: false,
          rating: 4.2,
          contactNumber: '9876543211'
        },
        {
          id: 3,
          mobile: '9876543212',
          gstin: 'GST123456791',
          verified: false,
          products: [
            { name: 'Oil', price: 120, quantity: 80, material: 'Sunflower Oil' }
          ],
          location: 'Mumbai, Maharashtra',
          isOpen: true,
          rating: 3.8,
          contactNumber: '9876543212'
        }
      ];
      localStorage.setItem('suppliers', JSON.stringify(sampleSuppliers));
      setSuppliers(sampleSuppliers);
    } else {
      setSuppliers(storedSuppliers);
    }

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    setCurrentUser(user);
  }, []);

  // Sort suppliers: verified first, then by rating
  const sortedSuppliers = [...suppliers].sort((a, b) => {
    if (a.verified && !b.verified) return -1;
    if (!a.verified && b.verified) return 1;
    return b.rating - a.rating;
  });

  const handleSupplierClick = (supplierId) => {
    navigate(`/supplier/${supplierId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/');
  };

  const handleLoginRedirect = () => {
    navigate('/');
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

  return (
    <div>
      <header>
        <div>
          <h1>VendorNest</h1>
          <div>
            {currentUser ? (
              <div>
                <span>Welcome, {currentUser.username || currentUser.mobile}</span>
                <button onClick={handleLogout}>Logout</button>
                <button onClick={() => navigate(currentUser.type === 'vendor' ? '/vendor' : '/supplier')}>
                  Dashboard
                </button>
              </div>
            ) : (
              <button onClick={handleLoginRedirect}>Login</button>
            )}
          </div>
        </div>
      </header>

      <nav>
        <button 
          onClick={() => setActiveTab('vendors')}
          disabled={activeTab === 'vendors'}
        >
          Vendors View
        </button>
        <button 
          onClick={() => setActiveTab('suppliers')}
          disabled={activeTab === 'suppliers'}
        >
          Suppliers View
        </button>
      </nav>

      <main>
        {activeTab === 'vendors' && (
          <div className="fade-in">
            <h2>Available Suppliers</h2>
            <div className="suppliers-container">
              {sortedSuppliers.map(supplier => (
                <div key={supplier.id} className="supplier-card">
                  <div className="supplier-header">
                    <h3>
                      Supplier #{supplier.id}
                      {supplier.verified ? (
                        <span className="verified-badge">✓ Verified</span>
                      ) : (
                        <span className="unverified-badge">⚠ Not Verified</span>
                      )}
                    </h3>
                    
                    <div className="supplier-info">
                      <div>
                        <p>
                          <span className="star-rating">{renderStars(supplier.rating)}</span>
                          ({supplier.rating}/5)
                        </p>
                        <p><strong>Location:</strong> {supplier.location}</p>
                        <p className={supplier.isOpen ? 'status-open' : 'status-closed'}>
                          <strong>Status:</strong> {supplier.isOpen ? 'Open' : 'Closed'}
                        </p>
                        <p><strong>Contact:</strong> {supplier.contactNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="products-section">
                    <h4>Available Products:</h4>
                    {supplier.products.map((product, index) => (
                      <div key={index} className="product-item">
                        <div>
                          <p>
                            <strong>{product.name}</strong> - {product.material}
                          </p>
                          <p><strong>Price:</strong> ₹{product.price}/kg</p>
                          <p><strong>Available Quantity:</strong> {product.quantity} kg</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="supplier-action">
                    <button 
                      onClick={() => handleSupplierClick(supplier.id)}
                      disabled={!supplier.isOpen}
                    >
                      {supplier.isOpen ? 'View Details' : 'Currently Closed'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'suppliers' && (
          <div className="fade-in">
            <h2>Supplier Management</h2>
            {currentUser && currentUser.type === 'supplier' ? (
              <div className="management-section">
                <p>Welcome back! Manage your products and business from your dashboard.</p>
                <button onClick={() => navigate('/supplier')}>
                  Go to Supplier Dashboard
                </button>
              </div>
            ) : currentUser && currentUser.type === 'vendor' ? (
              <div className="management-section">
                <p>You are logged in as a vendor. Switch to vendor view to see available suppliers.</p>
                <button onClick={() => setActiveTab('vendors')}>
                  View Suppliers
                </button>
              </div>
            ) : (
              <div className="management-section">
                <p>Please login as a supplier to manage your products and business.</p>
                <button onClick={handleLoginRedirect}>
                  Login as Supplier
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer>
        <div>
          <p>&copy; 2025 VendorNest. Connecting vendors and suppliers for better business.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;