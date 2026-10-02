# 🌿 SkinCare Co. — Clean Skincare & Korean Beauty Boutique

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg)](https://vitejs.dev/)
[![Location](https://img.shields.io/badge/Location-Phnom_Penh,_Cambodia-2F4F3E.svg)](https://maps.google.com)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

**SkinCare Co.** is a boutique e-commerce web application curated for clean skincare and authentic Asian beauty cosmetics in Phnom Penh, Cambodia. Built with a focus on visual elegance, fluid micro-interactions, responsive design, and localized Cambodian shopping workflows.

---

## ✨ Key Features

### 1. 🔐 Dynamic Multi-User Authentication & Profile Setup
- **Dual Mode System**: Seamless toggle between **Sign In** and **Create Account (Sign Up)**.
- **Dynamic Account Registration**: New users can register with their name, email, phone number, password, and **optional profile photo/avatar upload**. Accounts are instantly stored in `localStorage` (`skincare_registered_users`).
- **Predefined Credentials**: Quick 1-click **⚡ Fill Demo Credentials** button for instant demonstration.
- **Auto-Sync Customer Profile**: Newly signed-up users automatically populate the checkout delivery form.

### 2. 👤 Customer Account Management & Data Upload
- **Interactive Profile Hub**: Clickable user badge in the header displays avatar thumbnail, customer name, and opens the **Customer Profile Modal**.
- **Photo / Avatar Upload**: Instant image file selector (JPG, PNG, WebP) with live preview and automatic Base64 encoding.
- **Delivery Address Management**: Edit shipping address and select from all 25 Cambodian provinces; automatically syncs with the shopping bag checkout.
- **Data Import & Export**:
  - 📥 **Upload Customer Data**: Import customer contact details and preferences from a `.json` backup file.
  - 📤 **Export Customer Data**: Download a full `.json` file backup of profile information and order metrics.
  - 🧾 **Purchase History**: View past orders and tax invoice records.

### 3. 📍 Real-Time Phnom Penh Weather & Clock Strip
- **Strict Location Anchoring**: Displays `📍 Phnom Penh, Cambodia` and `🇰🇭 Phnom Penh (GMT+7)`.
- **Live Open-Meteo Integration**: Fetches real-time temperature, condition (Clear, Partly Cloudy, Drizzle, etc.), and humidity for Phnom Penh coordinates (`11.5564, 104.9282`).
- **Ticking Clock**: Precision second-by-second live local time.

### 4. 💄 Authentic Korean & Asian Makeup Catalog
- Featuring genuine, high-resolution packshot photography from top brands:
  - **3CE Stylenanda**: Velvet Lip Tint (Taupe), Multi Eye Color Palette (Overtake), Face Blush (Rose Beige)
  - **Wakemake**: Soft Blurring Eye Palette (Daily Blurring)
  - **Joocyee**: Glossy Water Rouge, Multi-Use Soft Cream Cheek & Lip Tint
  - **Rom&nd**: Juicy Lasting Tint (Figfig)
  - **CLIO**: Kill Cover Mesh Glow Cushion SPF 50+ PA++++
- Instant category filters: *All*, *Cleanser*, *Toner*, *Serum*, *Moisturizer*, *Sunscreen*, *Mask*, *Lip Care*, and *Makeup*.
- Live real-time search with instant keyboard accessibility.

### 5. 🛍️ Interactive Shopping Bag Drawer
- Slide-over drawer with 580px desktop width and smooth backdrop animation.
- Pre-filled customer contact details and Cambodian provinces selector (Phnom Penh, Siem Reap, Battambang, Kandal, Sihanoukville, etc.).
- Real-time order calculation with Pchum Ben 20% promotional discount (`PCHUMBEN20`).
- Delivery calculation: Free delivery on orders over $50 across Cambodia.

### 6. 🧾 Official Tax Invoice Modal & Downloader
- Centered popup invoice generated immediately upon purchase checkout.
- Itemized product breakdown with quantities, unit prices, subtotal, discount, shipping, and total.
- Integrated **ABA Bank Mobile QR Code** for quick digital scan-to-pay.
- Downloadable invoice receipt in `.txt` format and browser print-ready (`window.print()`).
- All invoices are archived in `localStorage` under `skincare_invoices`.

### 7. 🌸 Cultural Pchum Ben Promotion Banner
- Formal Khmer typography banner using Google Fonts (`Moul` and `Battambang`).
- Promotional coupon code `PCHUMBEN20` (20% off all orders).
- One-click dismissible banner with responsive spacing.

### 8. 🌿 About & Contact Experience
- Dedicated About page honoring store founder **Ms Putheanita Prom**.
- Contact page featuring direct store hotline `015 241471` and Facebook profile link.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 18+](https://reactjs.org/) |
| **Build Tool & Bundler** | [Vite](https://vitejs.dev/) |
| **Styling** | Vanilla CSS (Curated Palette: Forest Green `#2F4F3E`, Emerald `#164E3F`, Sage `#E8F0EA`, Gold `#F59E0B`) |
| **Typography** | Google Fonts (`Outfit`, `Playfair Display`, `Moul`, `Battambang`) |
| **Live Weather API** | [Open-Meteo](https://open-meteo.com/) (No API key required) |
| **Payments** | Dynamic ABA QR Code Generation |
| **Client Storage** | Browser `localStorage` for Cart, Auth, Customers & Invoices |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `18.x` or higher
- npm `9.x` or higher

### Installation
Clone the repository and install dependencies:
```bash
# Clone the repository
git clone https://github.com/Putheanita/React-App.git
cd my-react-app

# Install dependencies
npm install
```

### Development Server
Start the local Vite development server with HMR:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Production Build
Compile and bundle the project for production:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 🔑 Demo Credentials

To test the application quickly, you can use:

| Field | Value |
|---|---|
| **Email** | `putheanitaprom@gmail.com` |
| **Password** | `password` (or `123456`) |
| **One-Click** | Click the **"⚡ Fill Demo Credentials"** button on the Sign In tab |

Alternatively, select the **"Create Account ✨"** tab to register any new name, email, and password.

---

## 🏪 Business Profile & Store Information

- **Store Name**: SkinCare Co.
- **Founder & Owner**: Ms Putheanita Prom
- **Store Hotline**: `015 241471`
- **Location**: Phnom Penh, Cambodia
- **Facebook**: [Ms Putheanita Prom on Facebook](https://www.facebook.com/share/1ExFCeLE93/?mibextid=wwXIfr)
- **Active Coupon**: `PCHUMBEN20` (20% Off)

---

## 📁 Project Structure

```
my-react-app/
├── .agents/
│   └── rules/
│       ├── coding_guidelines.md    # UI tokens, fonts, and MVC Controller-View rules
│       └── project_overview.md     # Business rules, contact hotline, tech stack
├── public/
│   ├── favicon.svg                 # Brand icon
│   └── images/                     # Packshots for skincare & authentic makeup
├── src/
│   ├── components/
│   │   ├── CartDrawer.jsx          # Shopping bag slide-over drawer
│   │   ├── Footer.jsx              # Formal boutique footer with hotline & badges
│   │   ├── InvoiceModal.jsx        # Printable & downloadable tax invoice popup
│   │   ├── PchumBenBanner.jsx      # Khmer festival promotional banner
│   │   ├── ProductModal.jsx        # Instant product detail modal
│   │   └── WeatherTimeBar.jsx      # Phnom Penh live weather & GMT+7 clock
│   ├── config/
│   │   └── authConfig.js           # Authentication config & hashing utility
│   ├── controllers/                # 🎮 Controller hooks (actions, state & validation)
│   │   ├── useHomeController.js    # Filter, search, and catalog routing logic
│   │   └── useLoginController.js   # Dynamic registration, login check, and demo fill
│   ├── data/
│   │   └── Products.json           # Catalog of skincare & makeup products
│   ├── pages/                      # 📦 Lean Controller Containers
│   │   ├── abutUS/
│   │   │   └── PutheanetaProfile.jsx # Founder story & brand vision
│   │   ├── Contact.jsx             # Store hotline, address, opening hours
│   │   ├── Home.jsx                # Connects useHomeController to HomeView
│   │   └── Login.jsx               # Connects useLoginController to LoginView
│   ├── views/                      # 🎨 Pure Presentation Views (Zero business logic)
│   │   ├── auth/
│   │   │   ├── AuthAlertView.jsx   # Feedback & alert banner
│   │   │   ├── AuthBrandingView.jsx# Left brand & slogan panel
│   │   │   ├── LoginFormView.jsx   # Sign in form inputs & demo buttons
│   │   │   ├── LoginView.jsx       # Top-level auth view layout
│   │   │   └── SignUpFormView.jsx  # Sign up form inputs
│   │   └── home/
│   │       ├── CategoryFilterView.jsx # Category filter chips
│   │       ├── HeaderNavView.jsx   # Header, navigation, bag & search bar
│   │       ├── HomeView.jsx        # Storefront page layout
│   │       └── ProductGridView.jsx # Product cards grid & empty state
│   ├── utils/
│   │   └── navigation.js           # Navigation & logout helpers
│   ├── App.jsx                     # Root router & cart state container
│   ├── index.css                   # Global CSS reset & typography
│   └── main.jsx                    # React DOM entry point
├── index.html                      # HTML entry with SEO, OpenGraph & meta tags
├── package.json
└── vite.config.js
```

---

## 📄 License
This project is developed for educational and boutique commercial demonstration purposes. All brand packshots and trademarks belong to their respective owners (3CE Stylenanda, Wakemake, Joocyee, Rom&nd, CLIO).
