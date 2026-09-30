# SkinCare Co. — Project Architecture & Rules

## Overview
**SkinCare Co.** is a boutique e-commerce web application specialized in clean Korean skincare and authentic Asian beauty cosmetics in Phnom Penh, Cambodia.

## Core Tech Stack
- **Framework**: React 18+ with Vite
- **Styling**: Vanilla CSS with curated color palette (Forest Green `#2F4F3E`, Emerald `#164E3F`, Sage `#E8F0EA`, Gold `#F59E0B`)
- **State & Persistence**:
  - `localStorage` for cart persistence (`skincare_cart`)
  - `localStorage` for dynamic user registration (`skincare_registered_users`)
  - `localStorage` for current session user (`skincare_current_user`)
  - `localStorage` for saved customer delivery profiles (`skincare_customer_info`)
  - `localStorage` for completed invoice transaction records (`skincare_invoices`)
- **External Integrations**:
  - **Open-Meteo Weather API**: Real-time temperature, condition, and humidity for Phnom Penh, Cambodia.
  - **ABA Bank QR Payment**: Live dynamic QR code generator integration for instant mobile banking checkout.

## Business Constraints & Credentials
- **Store Name**: SkinCare Co.
- **Store Hotline**: `015 241471`
- **Location**: Phnom Penh, Cambodia
- **Founder**: Ms Putheanita Prom
- **Active Promo Code**: `PCHUMBEN20` (20% sitewide discount)
- **Time Zone**: `Asia/Phnom_Penh (GMT+7)`

## Coding Standards
1. Keep dependencies minimal and fast; prefer standard Web APIs (`fetch`, `Intl.DateTimeFormat`, `Blob`, `URL.createObjectURL`).
2. Always ensure zero console errors and successful production builds (`npm run build`).
3. Maintain full mobile responsiveness across all devices (mobile, tablet, desktop).
4. Preserve Khmer typography standards (proper font pairing with Moul and Battambang).
