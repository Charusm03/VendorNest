import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import VendorDashboard from "./components/VendorDashboard";
import SupplierDashboard from "./components/SupplierDashboard";
import SupplierDetailPage from "./components/SupplierDetailPage";
import PaymentPage from './components/PaymentPage';
import "./App.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/vendor" element={<VendorDashboard />} />
        <Route path="/supplier" element={<SupplierDashboard />} />
        <Route path="/supplier/:id" element={<SupplierDetailPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </Router>
  );
};

export default App;