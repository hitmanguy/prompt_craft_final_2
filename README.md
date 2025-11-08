# 🧭 iLost

**iLost** is a modern, intelligent platform that helps people **reconnect with lost and found items** effortlessly.  
It combines **AI-powered categorization**, **interactive maps**, and **smart matching** to make reunions faster, safer, and smarter.

---

## 🚀 Overview

iLost bridges the gap between **lost and found** through an intuitive interface, location awareness, and privacy-focused communication.  
Whether it’s a misplaced wallet, an ID card, or a pet — iLost helps you **locate, report, and reunite** efficiently.

---

## ✨ Core Features

### 🖼️ Media & Uploads
- Upload **multiple photos** per item.  
- Automatic **image compression and resizing** for performance.  
- AI-powered **item categorization** and **tag suggestion** using image recognition.

### 🔄 Status & Workflow
- Item lifecycle: **Active → Resolved → Archived**.  
- Auto-archive items after a configurable number of days.  
- Quick actions to mark items as found or claimed.

### 🔒 Privacy & Security
- **Contact masking** (e.g., `98******42`) for unverified users.  
- **Email verification** and **secure password reset**.  
- **Rate limiting** and **spam protection** using honeypot + Turnstile/reCAPTCHA.  
- **Moderation queue** for flagged or reported posts.

---

## 🗺️ Location & Maps

### 🌍 Map Integration
iLost features a **fully interactive map system** powered by Google Maps / OpenStreetMap.

- **Clustered pins** showing nearby lost/found items.  
- **Location picker** with autocomplete — automatically stores latitude and longitude.  
- **Draw radius filter** to search within a specific distance.  
- **Geofenced alerts**:  
  > “Notify me if a match appears within 3 km of IITK campus.”  
- Location-based AI matching for more accurate results.

---

## 🔍 Discovery & Matching
- **Smart suggestions** using AI to match LOST and FOUND posts via:
  - Text similarity (fuzzy matching)
  - Time proximity  
  - Location proximity  
- Personalized “**Possible Matches**” inbox for each post with quick actions (`Not a Match` / `Contact`).  
- **Duplicate detection** for posts with identical text or images.  
- **Tagging system** with icons for easy browsing:
  - Electronics
  - ID Cards
  - Pets
  - Luggage
  - Personal Items

---

## 📬 Notifications
- **Email + in-app notifications** for:
  - Match found  
  - Message received  
  - Post resolved  
- **Web push notifications (PWA)** for instant alerts.  
- **Daily/weekly digests** of new items in followed categories or areas.

---

## 💬 Messaging & Privacy
- **In-app messaging** between finder and owner (keeps contact info private).  
- Optional **masked relay** for calls or emails (via Twilio/Email relay).  
- **Safety tips banner** before first contact for secure interactions.

---

## 🧠 AI-Powered Categorization
- Automatically identifies item type using **computer vision**.  
- Suggests **relevant tags and categories** for better discoverability.  
- Detects key item types like:
  - Electronics
  - Documents
  - Pets
  - Luggage
  - Accessories
  - Personal Items

---

## ⚡ Fast Wins (Low Effort, High Value)

| Feature | Description |
|----------|-------------|
| **Auto image compression** | Optimizes photo uploads automatically |
| **Saved filters & searches** | Revisit frequent searches easily |
| **Share cards** | One-click WhatsApp/Telegram sharing + link copy |
| **Report/flag posts** | Basic moderation workflow |
| **Spam protection** | Honeypot + Turnstile/reCAPTCHA |

---

## 🧭 Setup & Installation

### 🧱 Prerequisites
Make sure you have:
- **Node.js (v18+)**
- **npm (v9+)**
- A valid **Google Maps API key** (or OpenStreetMap setup)

---

### ⚙️ Installation

Clone the repository and install dependencies:

```bash
npm install
▶️ Run the Development Server
Start the app in development mode:

bash
Copy code
npm run dev
Then visit your local environment:

Copy code
http://localhost:3000
```

✅ You’re all set! iLost will start with the map feature, AI categorization, and all the smart matching features enabled.

🧩 Tech Stack
Frontend: Next.js / React

Backend: Node.js + Express

Database: MongoDB / PostgreSQL

Authentication: JWT + OAuth + Email verification

Maps: Google Maps API / Leaflet + OpenStreetMap

AI Services: TensorFlow.js / Hugging Face models

Notifications: Firebase Cloud Messaging (FCM) / Web Push

📍 About iLost
“iLost is built to reunite people with what matters most — quickly, safely, and intelligently.”

It’s designed for campuses, cities, and communities to reduce the stress of lost items and improve recovery success rates.

🧑‍💻 Contributing
We welcome contributions!
To get started:

Fork this repository

Create a new feature branch

Commit and push your changes

Open a Pull Request 🚀

📜 License
MIT License © 2025 iLost Team

yaml
Copy code

---

Would you like me to add a small section for `.env.example` (showing how to configure `MAPS_API_KEY`, `EMAIL_API_KEY`, and `AI_MODEL_URL`)?  
It’s a great way to help others set up the project quickly.
