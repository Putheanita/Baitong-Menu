# Component & UI Architecture Guidelines

## 1. Typography & Colors
- Primary Brand: `#2F4F3E` (Deep Forest Green)
- Brand Accent: `#164E3F` / `#52B788` (Emerald / Sage)
- Primary Font: `'Outfit', sans-serif` for UI & body copy
- Display Font: `'Playfair Display', serif` for hero titles and card titles
- Khmer Font: `'Moul', serif` for formal Khmer banners, `'Battambang', serif` for subtitle and description

## 2. Controller-View Separation Pattern (MVC)
To ensure code maintainability and prevent bloated JSX files:
- **Controllers (`src/controllers/`)**:
  - Encapsulate all business logic, validation, state management, API calls, and handlers into dedicated hooks (`useLoginController.js`, `useHomeController.js`).
  - Controllers contain zero HTML/JSX presentation markup.
- **Views (`src/views/`)**:
  - Organized by domain (e.g., `src/views/auth/`, `src/views/home/`).
  - Pure presentation components that receive state and action callbacks via props.
  - Zero business logic or storage manipulation in views.
- **Pages (`src/pages/`)**:
  - Act as lean Controller Containers wiring controller hooks to views (e.g. `Login.jsx` calling `useLoginController` and rendering `<LoginView />`).

## 3. Component Structure
- `src/components/WeatherTimeBar.jsx`: Top utility strip showing real-time Phnom Penh weather and GMT+7 clock.
- `src/components/CartDrawer.jsx`: Shopping bag sliding drawer with 580px width, saved address presets, Cambodian provinces selector, and checkout logic.
- `src/components/InvoiceModal.jsx`: Centered tax invoice modal with printable sheet, PDF export, and text receipt download.
- `src/components/PchumBenBanner.jsx`: Cambodian festival promotional banner.
- `src/components/ProductModal.jsx`: Instant product preview modal.
- `src/components/Footer.jsx`: Formal store footer with customer care, contact info, and security badges.

## 4. Storage Keys Standard
- `isLoggedIn`: Boolean flag for session authentication.
- `skincare_registered_users`: Array of user profiles `{ id, name, email, phone, password, createdAt }`.
- `skincare_current_user`: Active logged-in user profile.
- `skincare_customer_info`: Pre-filled customer delivery address & contact for checkout.
- `skincare_invoices`: History of completed purchases with itemized product breakdowns.
