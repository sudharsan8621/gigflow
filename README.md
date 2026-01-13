# 🚀 GigFlow - Mini Freelance Marketplace Platform

A full-stack freelance marketplace where Clients can post jobs (Gigs) and Freelancers can apply for them (Bids).

![GigFlow](https://img.shields.io/badge/GigFlow-Freelance%20Marketplace-blue)

## 🌟 Features

### Core Features
- ✅ **User Authentication** - Secure JWT-based auth with HttpOnly cookies
- ✅ **Gig Management** - Full CRUD operations for job postings
- ✅ **Bidding System** - Freelancers can submit proposals with custom pricing
- ✅ **Hiring Workflow** - Clients can review and hire from multiple bids
- ✅ **Search & Filter** - Find gigs by title and status

### Bonus Features
- ✅ **MongoDB Transactions** - Race condition protection for hiring logic
- ✅ **Real-time Notifications** - Socket.io powered instant updates

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js (Vite) + Tailwind CSS |
| State Management | Redux Toolkit |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose) |
| Authentication | JWT + HttpOnly Cookies |
| Real-time | Socket.io |

## 📁 Project Structure

gigflow/
├── backend/
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── gigController.js
│ │ └── bidController.js
│ ├── middleware/
│ │ ├── authMiddleware.js
│ │ └── errorMiddleware.js
│ ├── models/
│ │ ├── User.js
│ │ ├── Gig.js
│ │ └── Bid.js
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── gigRoutes.js
│ │ └── bidRoutes.js
│ ├── utils/
│ │ └── socket.js
│ ├── server.js
│ ├── package.json
│ └── .env.example
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── store/
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── package.json
│ └── .env.example
│
└── README.md



## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend

Install dependencies:
npm install

Create .env file from example:
cp .env.example .env

Update .env with your values:
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173




Start the server:
npm run dev


Frontend Setup
Navigate to frontend folder:

cd frontend
Install dependencies:
npm install

Create .env file from example:
cp .env.example .env






📡 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login & set HttpOnly cookie
POST	/api/auth/logout	Logout & clear cookie
GET	/api/auth/me	Get current user
Gigs
Method	Endpoint	Description
GET	/api/gigs	Fetch all gigs (with search/filter)
GET	/api/gigs/:id	Get single gig
POST	/api/gigs	Create new gig (protected)
PUT	/api/gigs/:id	Update gig (owner only)
DELETE	/api/gigs/:id	Delete gig (owner only)
GET	/api/gigs/user/my-gigs	Get user's gigs (protected)
Bids
Method	Endpoint	Description
POST	/api/bids	Submit a bid (protected)
GET	/api/bids/:gigId	Get bids for gig (owner only)
GET	/api/bids/my-bids	Get user's bids (protected)
PATCH	/api/bids/:bidId/hire	Hire a freelancer (owner only)
🔐 Database Schema
User

{
  name: String,
  email: String (unique),
  password: String (hashed),
  timestamps: true
}

Gig
{
  title: String,
  description: String,
  budget: Number,
  ownerId: ObjectId (ref: User),
  status: 'open' | 'assigned',
  hiredBidId: ObjectId (ref: Bid),
  hiredFreelancerId: ObjectId (ref: User),
  timestamps: true
}


Bid
{
  gigId: ObjectId (ref: Gig),
  freelancerId: ObjectId (ref: User),
  message: String,
  price: Number,
  status: 'pending' | 'hired' | 'rejected',
  timestamps: true
}

 The Hiring Flow
Client posts a Gig with title, description, and budget
Freelancers browse open gigs and submit bids
Client reviews all bids on their gig
Client clicks "Hire" on their preferred bid
System atomically:
Changes Gig status to assigned
Changes selected Bid status to hired
Changes all other Bids to rejected
Freelancer receives real-time notification: "You have been hired!"
🛡️ Bonus Features Explained
MongoDB Transactions (Race Condition Protection)
The hiring logic uses MongoDB transactions to ensure atomicity. If two clients try to hire different freelancers simultaneously, only one will succeed.

const session = await mongoose.startSession();
session.startTransaction();
// ... atomic operations ...
await session.commitTransaction();



const session = await mongoose.startSession();
session.startTransaction();
// ... atomic operations ...
await session.commitTransaction();





License
This project is for educational/assessment purposes.