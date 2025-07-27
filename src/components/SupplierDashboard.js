import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./SupplierDashboard.css";
const SupplierDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [businessStats, setBusinessStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0
  });
  const navigate = useNavigate();

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    material: '',
    price: '',
    quantity: '',
    description: '',
    category: 'grains'
  });

  // Business info state
  const [businessInfo, setBusinessInfo] = useState({
    isOpen: true,
    location: '',
    description: '',
    specialOffers: ''
  });

  useEffect(() => {
    // Check if user is logged in and is a supplier
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user || user.type !== 'supplier') {
      navigate('/');
      return;
    }
    setCurrentUser(user);

    // Load supplier's products and business info
    loadSupplierData(user.id);
    loadOrders(user.id);
    updateBusinessStats(user.id);
  }, [navigate]);

  const loadSupplierData = (supplierId) => {
    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    const supplier = suppliers.find(s => s.id === supplierId);
    
    if (supplier) {
      setProducts(supplier.products || []);
      setBusinessInfo({
        isOpen: supplier.isOpen || true,
        location: supplier.location || '',
        description: supplier.description || '',
        specialOffers: supplier.specialOffers || ''
      });
    }
  };

  const loadOrders = (supplierId) => {
    // Load orders from localStorage (orders would be created when vendors make purchases)
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const supplierOrders = allOrders.filter(order => order.supplierId === supplierId);
    setOrders(supplierOrders);
  };

  const updateBusinessStats = (supplierId) => {
    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    const supplier = suppliers.find(s => s.id === supplierId);
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const supplierOrders = allOrders.filter(order => order.supplierId === supplierId);

    if (supplier) {
      const totalRevenue = supplierOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      
      setBusinessStats({
        totalProducts: supplier.products?.length || 0,
        totalOrders: supplierOrders.length,
        totalRevenue: totalRevenue,
        averageRating: supplier.rating || 0
      });
    }
  };

  const updateSupplierInStorage = (updatedSupplier) => {
    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    const updatedSuppliers = suppliers.map(s => 
      s.id === updatedSupplier.id ? updatedSupplier : s
    );
    localStorage.setItem('suppliers', JSON.stringify(updatedSuppliers));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.material || !newProduct.price || !newProduct.quantity) {
      alert('Please fill in all required fields');
      return;
    }

    const product = {
      id: Date.now(),
      name: newProduct.name,
      material: newProduct.material,
      price: parseFloat(newProduct.price),
      quantity: parseFloat(newProduct.quantity),
      description: newProduct.description,
      category: newProduct.category,
      dateAdded: new Date().toISOString()
    };

    const updatedProducts = [...products, product];
    setProducts(updatedProducts);

    // Update supplier in localStorage
    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    const updatedSuppliers = suppliers.map(s => 
      s.id === currentUser.id ? { ...s, products: updatedProducts } : s
    );
    localStorage.setItem('suppliers', JSON.stringify(updatedSuppliers));

    // Reset form
    setNewProduct({
      name: '',
      material: '',
      price: '',
      quantity: '',
      description: '',
      category: 'grains'
    });
    setIsAddingProduct(false);
    updateBusinessStats(currentUser.id);
    alert('Product added successfully!');
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      material: product.material,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      description: product.description || '',
      category: product.category || 'grains'
    });
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    
    const updatedProduct = {
      ...editingProduct,
      name: newProduct.name,
      material: newProduct.material,
      price: parseFloat(newProduct.price),
      quantity: parseFloat(newProduct.quantity),
      description: newProduct.description,
      category: newProduct.category,
      lastUpdated: new Date().toISOString()
    };

    const updatedProducts = products.map(p => 
      p.id === editingProduct.id ? updatedProduct : p
    );
    setProducts(updatedProducts);

    // Update supplier in localStorage
    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    const updatedSuppliers = suppliers.map(s => 
      s.id === currentUser.id ? { ...s, products: updatedProducts } : s
    );
    localStorage.setItem('suppliers', JSON.stringify(updatedSuppliers));

    // Reset form
    setNewProduct({
      name: '',
      material: '',
      price: '',
      quantity: '',
      description: '',
      category: 'grains'
    });
    setEditingProduct(null);
    alert('Product updated successfully!');
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);

      // Update supplier in localStorage
      const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
      const updatedSuppliers = suppliers.map(s => 
        s.id === currentUser.id ? { ...s, products: updatedProducts } : s
      );
      localStorage.setItem('suppliers', JSON.stringify(updatedSuppliers));
      updateBusinessStats(currentUser.id);
      alert('Product deleted successfully!');
    }
  };

  const handleBusinessInfoUpdate = (e) => {
    e.preventDefault();
    
    // Update supplier business info in localStorage
    const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
    const updatedSuppliers = suppliers.map(s => 
      s.id === currentUser.id ? { 
        ...s, 
        isOpen: businessInfo.isOpen,
        location: businessInfo.location,
        description: businessInfo.description,
        specialOffers: businessInfo.specialOffers
      } : s
    );
    localStorage.setItem('suppliers', JSON.stringify(updatedSuppliers));
    alert('Business information updated successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBusinessInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBusinessInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <header>
        <div>
          <h1>Supplier Dashboard</h1>
          <div>
            <span>Welcome, Supplier #{currentUser.id}</span>
            <button onClick={() => navigate('/home')}>Home</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      {/* Business Stats */}
      <div>
        <h2>Business Overview</h2>
        <div>
          <div>
            <h3>Total Products</h3>
            <p>{businessStats.totalProducts}</p>
          </div>
          <div>
            <h3>Total Orders</h3>
            <p>{businessStats.totalOrders}</p>
          </div>
          <div>
            <h3>Total Revenue</h3>
            <p>₹{businessStats.totalRevenue}</p>
          </div>
          <div>
            <h3>Average Rating</h3>
            <p>{businessStats.averageRating}/5</p>
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div>
        <h2>Business Information</h2>
        <form onSubmit={handleBusinessInfoUpdate}>
          <div>
            <label>
              <input
                type="checkbox"
                name="isOpen"
                checked={businessInfo.isOpen}
                onChange={handleBusinessInfoChange}
              />
              Currently Open for Business
            </label>
          </div>
          <div>
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={businessInfo.location}
              onChange={handleBusinessInfoChange}
              placeholder="Enter your business location"
            />
          </div>
          <div>
            <label>Business Description:</label>
            <textarea
              name="description"
              value={businessInfo.description}
              onChange={handleBusinessInfoChange}
              placeholder="Describe your business..."
              rows="3"
            />
          </div>
          <div>
            <label>Special Offers:</label>
            <textarea
              name="specialOffers"
              value={businessInfo.specialOffers}
              onChange={handleBusinessInfoChange}
              placeholder="Any special offers or discounts..."
              rows="2"
            />
          </div>
          <button type="submit">Update Business Info</button>
        </form>
      </div>

      {/* Product Management */}
      <div>
        <div>
          <h2>Product Management</h2>
          <button 
            onClick={() => setIsAddingProduct(!isAddingProduct)}
          >
            {isAddingProduct ? 'Cancel' : 'Add New Product'}
          </button>
        </div>

        {/* Add/Edit Product Form */}
        {(isAddingProduct || editingProduct) && (
          <div>
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
              <div>
                <label>Product Name:</label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Basmati Rice"
                />
              </div>
              <div>
                <label>Material/Type:</label>
                <input
                  type="text"
                  name="material"
                  value={newProduct.material}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Premium Quality"
                />
              </div>
              <div>
                <label>Category:</label>
                <select
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                >
                  <option value="grains">Grains</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="dairy">Dairy</option>
                  <option value="spices">Spices</option>
                  <option value="oils">Oils</option>
                  <option value="others">Others</option>
                </select>
              </div>
              <div>
                <label>Price (₹/kg):</label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Price per kg"
                />
              </div>
              <div>
                <label>Available Quantity (kg):</label>
                <input
                  type="number"
                  name="quantity"
                  value={newProduct.quantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.1"
                  placeholder="Available quantity"
                />
              </div>
              <div>
                <label>Description:</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  placeholder="Product description (optional)"
                  rows="3"
                />
              </div>
              <div>
                <button type="submit">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setIsAddingProduct(false);
                    setEditingProduct(null);
                    setNewProduct({
                      name: '',
                      material: '',
                      price: '',
                      quantity: '',
                      description: '',
                      category: 'grains'
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div>
          <h3>Your Products ({products.length})</h3>
          {products.length > 0 ? (
            <div>
              {products.map(product => (
                <div key={product.id}>
                  <div>
                    <h4>{product.name}</h4>
                    <p>Material: {product.material}</p>
                    <p>Category: {product.category}</p>
                    <p>Price: ₹{product.price}/kg</p>
                    <p>Available: {product.quantity} kg</p>
                    {product.description && <p>Description: {product.description}</p>}
                    {product.dateAdded && (
                      <p>Added: {new Date(product.dateAdded).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div>
                    <button onClick={() => handleEditProduct(product)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <p>No products added yet.</p>
              <button onClick={() => setIsAddingProduct(true)}>
                Add Your First Product
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <h2>Recent Orders</h2>
        {orders.length > 0 ? (
          <div>
            {orders.map(order => (
              <div key={order.id}>
                <h4>Order #{order.id}</h4>
                <p>Vendor: {order.vendorName}</p>
                <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                <p>Total: ₹{order.totalAmount}</p>
                <p>Status: {order.status}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No orders received yet.</p>
        )}
      </div>
    </div>
  );
};

export default SupplierDashboard;