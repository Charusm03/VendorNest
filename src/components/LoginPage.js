import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LoginPage.css";

const LoginPage = () => {
  const [userType, setUserType] = useState('vendor');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  // Vendor form state
  const [vendorData, setVendorData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  // Supplier form state
  const [supplierData, setSupplierData] = useState({
    mobile: '',
    gstin: '',
    aadharCard: null,
    password: '',
    confirmPassword: ''
  });

  const handleVendorChange = (e) => {
    setVendorData({
      ...vendorData,
      [e.target.name]: e.target.value
    });
  };

  const handleSupplierChange = (e) => {
    if (e.target.name === 'aadharCard') {
      setSupplierData({
        ...supplierData,
        aadharCard: e.target.files[0]
      });
    } else {
      setSupplierData({
        ...supplierData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleVendorSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (vendorData.password !== vendorData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      // Store vendor data in localStorage
      const vendors = JSON.parse(localStorage.getItem('vendors') || '[]');
      vendors.push({
        id: Date.now(),
        username: vendorData.username,
        password: vendorData.password,
        type: 'vendor'
      });
      localStorage.setItem('vendors', JSON.stringify(vendors));
      alert('Vendor account created successfully!');
      setIsSignUp(false);
    } else {
      // Login logic
      const vendors = JSON.parse(localStorage.getItem('vendors') || '[]');
      const vendor = vendors.find(v => v.username === vendorData.username && v.password === vendorData.password);
      if (vendor) {
        localStorage.setItem('currentUser', JSON.stringify(vendor));
        navigate('/vendor');
      } else {
        alert('Invalid credentials');
      }
    }
  };

  const handleSupplierSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (supplierData.password !== supplierData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      if (!supplierData.aadharCard) {
        alert('Please upload Aadhar card');
        return;
      }
      // Store supplier data in localStorage
      const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
      suppliers.push({
        id: Date.now(),
        mobile: supplierData.mobile,
        gstin: supplierData.gstin,
        aadharCard: supplierData.aadharCard.name,
        password: supplierData.password,
        type: 'supplier',
        verified: false,
        products: [],
        location: 'Sample Location',
        isOpen: true,
        rating: 0,
        contactNumber: supplierData.mobile
      });
      localStorage.setItem('suppliers', JSON.stringify(suppliers));
      alert('Supplier account created successfully!');
      setIsSignUp(false);
    } else {
      // Login logic
      const suppliers = JSON.parse(localStorage.getItem('suppliers') || '[]');
      const supplier = suppliers.find(s => s.mobile === supplierData.mobile && s.password === supplierData.password);
      if (supplier) {
        localStorage.setItem('currentUser', JSON.stringify(supplier));
        navigate('/supplier');
      } else {
        alert('Invalid credentials');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="header">
        <h1>VendorNest</h1>
        <p>Your one-stop grocery products web portal connecting vendors and suppliers</p>
      </div>

      <div className="user-type-selector">
        <button 
          onClick={() => setUserType('vendor')}
          disabled={userType === 'vendor'}
        >
          Vendor Login
        </button>
        <button 
          onClick={() => setUserType('supplier')}
          disabled={userType === 'supplier'}
        >
          Supplier Login
        </button>
      </div>

      {userType === 'vendor' ? (
        <div className="form-container">
          <div className="form-header">
            <h2>{isSignUp ? 'Vendor Sign Up' : 'Vendor Login'}</h2>
          </div>
          <div className="form-content">
            <form onSubmit={handleVendorSubmit}>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={vendorData.username}
                  onChange={handleVendorChange}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={vendorData.password}
                  onChange={handleVendorChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
              {isSignUp && (
                <div className="form-group">
                  <label>Confirm Password:</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={vendorData.confirmPassword}
                    onChange={handleVendorChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}
              <button type="submit" className="submit-btn">
                {isSignUp ? 'Create Account' : 'Login'}
              </button>
            </form>
            <div className="toggle-section">
              <p>
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <button onClick={() => setIsSignUp(!isSignUp)} className="toggle-btn">
                  {isSignUp ? 'Login' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="form-container">
          <div className="form-header">
            <h2>{isSignUp ? 'Supplier Sign Up' : 'Supplier Login'}</h2>
          </div>
          <div className="form-content">
            <form onSubmit={handleSupplierSubmit}>
              <div className="form-group">
                <label>Mobile Number:</label>
                <input
                  type="tel"
                  name="mobile"
                  value={supplierData.mobile}
                  onChange={handleSupplierChange}
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
              {isSignUp && (
                <>
                  <div className="form-group">
                    <label>GSTIN:</label>
                    <input
                      type="text"
                      name="gstin"
                      value={supplierData.gstin}
                      onChange={handleSupplierChange}
                      placeholder="Enter your GSTIN"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Aadhar Card Upload:</label>
                    <input
                      type="file"
                      name="aadharCard"
                      onChange={handleSupplierChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Password:</label>
                    <input
                      type="password"
                      name="password"
                      value={supplierData.password}
                      onChange={handleSupplierChange}
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password:</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={supplierData.confirmPassword}
                      onChange={handleSupplierChange}
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </>
              )}
              {!isSignUp && (
                <div className="form-group">
                  <label>Password:</label>
                  <input
                    type="password"
                    name="password"
                    value={supplierData.password}
                    onChange={handleSupplierChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>
              )}
              <button type="submit" className="submit-btn">
                {isSignUp ? 'Create Account' : 'Login'}
              </button>
            </form>
            <div className="toggle-section">
              <p>
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <button onClick={() => setIsSignUp(!isSignUp)} className="toggle-btn">
                  {isSignUp ? 'Login' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => navigate('/home')} className="guest-btn">
        Continue as Guest
      </button>
    </div>
  );
};

export default LoginPage;