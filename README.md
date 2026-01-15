# CampusCash BCH 🚀  
QR-based Campus Payments + Loyalty Rewards powered by Bitcoin Cash (BCH)

CampusCash BCH is a campus-focused payment system that enables **instant BCH QR payments** for college use-cases like **canteen, printing, stationery, and events**, along with a **loyalty rewards system (CashTokens-ready)** to boost student retention and vendor adoption.

---

## ✨ Key Features

### 👨‍🎓 Student App (Mobile-First)
- Scan vendor QR and pay instantly (demo-mode payment simulation)
- View transaction history (Pending / Confirmed / Failed)
- Track reward points earned per vendor and overall
- Redeem reward points for discounts

### 🏪 Vendor Dashboard (Desktop-Friendly)
- Create a bill in INR and auto-generate BCH amount
- Generate QR code for payment
- Live payment tracking with invoice status
- Daily sales summary + analytics

### 🎁 Rewards System (CashTokens-Ready)
- Earn points on every confirmed payment  
  **Rule:** `1 point per ₹10 spent`
- Redeem points at vendors  
  **Rule:** `10 points = ₹10 discount`
- Rewards ledger stored in database
- Architecture designed to upgrade rewards into **CashTokens on-chain**

---

## 🧠 Problem We Solve
Small daily campus payments are often messy due to:
- cash change issues
- UPI delays / failures
- no transaction tracking
- no loyalty or reward system

CampusCash BCH makes payments:
✅ instant  
✅ trackable  
✅ reward-driven  
✅ BCH-powered  

---

## 🏗 System Overview

**Flow:**  
Vendor creates invoice → QR generated → Student scans → Payment confirmed → Rewards credited → Redeem rewards

**Modules:**
- Student Web App
- Vendor Web Dashboard
- Backend API
- Database (users, vendors, invoices, transactions, rewards, redemptions)

---

## 🛠 Tech Stack
- **Frontend:** React + Tailwind CSS  
- **Backend:** Node.js + Express  
- **Database:** MongoDB / Supabase  
- **QR:** QR generator + camera-based QR scanner  
- **Blockchain Layer:** Bitcoin Cash (BCH) payment-ready architecture  
- **Rewards:** DB ledger (CashTokens-ready design)

---

## ⚡ Demo Mode (Hackathon Friendly)
To keep the demo smooth and reliable, the app includes **Demo Mode**:
- payments auto-confirm after a few seconds
- txHash is auto-generated
- BCH-INR conversion is fixed for the demo

**Fixed rate:** `1 BCH = ₹40,000`

---

## 📌 BCH-Ready Upgrade Path
This MVP is designed to be upgraded into full on-chain functionality:

### Future Upgrades
- Real BCH wallet signing & broadcast
- On-chain payment verification using BCH explorer APIs
- CashTokens mint/transfer for loyalty points
- Merchant settlement tools
- College-wide admin dashboard

---

## 📂 Project Structure (Suggested)
campuscash-bch/
├─ client/ # React frontend (Student + Vendor UI)
│ ├─ src/
│ ├─ public/
│ └─ package.json
├─ server/ # Node.js backend (APIs + DB)
│ ├─ src/
│ ├─ routes/
│ ├─ models/
│ └─ package.json
├─ README.md
└─ .env.example

yaml
Copy code

---

## 🧪 Core Demo Scenario
1) Vendor creates bill for ₹30 (Printing)
2) Vendor shows QR code on screen
3) Student scans QR and confirms payment
4) Transaction becomes confirmed + txHash generated
5) Student receives reward points
6) Student redeems points for discount (optional)

---

## 🔐 Roles & Access
- **Student:** scan/pay, view history, rewards, redeem
- **Vendor:** create invoice, track payments, view analytics

Role-based access ensures:
- students cannot access vendor dashboard
- vendors cannot access student pages

---

## 🧾 API Endpoints (Example)

### Auth
- `POST /auth/signup`
- `POST /auth/login`
- `GET /me`

### Vendor
- `POST /vendor/invoice`
- `GET /vendor/invoices`
- `GET /vendor/transactions`
- `GET /vendor/analytics`

### Student
- `POST /student/pay`
- `GET /student/transactions`
- `GET /student/rewards`
- `POST /student/redeem`

---

## 🚀 Getting Started (Local Setup)

### 1) Clone Repository
```bash
git clone <your-repo-link>
cd campuscash-bch
2) Setup Backend
bash
Copy code
cd server
npm install
npm run dev
3) Setup Frontend
bash
Copy code
cd client
npm install
npm run dev
🔑 Environment Variables
Create a .env file using .env.example.

Example:

env
Copy code
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
DEMO_MODE=true
BCH_INR_RATE=40000
📸 Screens Included
✅ Landing Page
✅ Student Login / Signup
✅ Student Home (Scan to Pay)
✅ Confirm Payment
✅ Payment Success + Rewards
✅ Transaction History
✅ Rewards + Redeem

✅ Vendor Login / Signup
✅ Vendor Dashboard
✅ Create Bill
✅ QR Invoice Screen
✅ Live Transactions Table
✅ Analytics

🏆 Built For
BCH-1 Hackcelerator — Bitcoin Cash Builder Sprint
Track: Applications Track

👨‍💻 Team
Samarth Shendre (Developer)

📜 License
This project is for hackathon/demo purposes. You can choose a license like MIT before open-sourcing.

⭐ Support
If you like this project, please give it a ⭐ and share feedback with the community!
