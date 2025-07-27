# 🛒 VendorNest - Grocery Products Web Portal

**VendorNest** is a full-stack web portal designed to bridge the gap between grocery **vendors** and **suppliers**. The platform ensures transparency, trust, and convenience by enabling verified suppliers to offer real-time product availability, pricing, and documentation to vendors.

---

## 🌟 Features

### 🔐 Authentication
- **Vendor Login/Signup**: Username, password-based login.
- **Supplier Login/Signup**: Mobile number, GSTIN, Aadhaar card upload for verification.

### 🏠 Landing Page
- Welcome page with `VendorNest` branding, title, description.
- Toggle buttons to navigate to **Vendor Login** or **Supplier Login**.

### 📊 Vendor Dashboard
- View list of suppliers:
  - Verified suppliers appear at the top.
  - Unverified suppliers at the bottom.
- See product ratings and prices.
- Check vendor location status (Open/Closed).
- Access available products: name, material, price, quantity (kg).

### 📦 Supplier Dashboard
- Add new products.
- Set price and description.
- Manage product list.

### 🗺️ Supplier Detail Page
- View supplier profile with:
  - Map and images
  - Contact details
  - Location
  - Bulk purchase options (discounts by quantity)
  - Verification date
- Product Table with:
  - Material Name
  - Price
  - Discount Info
  - Available Quantity (kg)
  - Your Desired Quantity (kg)

### 💳 Payment Page
- Displays product details.
- Select payment type (e.g., UPI, Card, COD).

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- TailwindCSS / CSS Variables

**Backend:**

**Database:**

**Other:**
- File Upload (for Aadhaar)
- Location Services (for map and status)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
https://github.com/Charusm03/VendorNest.git
cd VendorNest
