# Full-Stack E-Commerce Application

A modern, full-stack e-commerce platform built with Next.js, Node.js, Express, and MongoDB. The application features a fully responsive design, user authentication, a complete shopping cart and checkout flow, Stripe payment integration, an AI chatbot for support, and an admin dashboard for managing products, categories, orders, and users.

## Features
- **User Authentication:** Sign up, sign in, forgot/reset password with email verification using JWT.
- **Product Management:** Browse, search, filter, and paginate products.
- **Shopping Cart & Wishlist:** Fully functional cart and wishlist system synced with the database.
- **Checkout Flow:** Secure payment processing with Stripe.
- **AI Chatbot Support:** Integrated intelligent AI chatbot using OpenRouter API to assist customers.
- **Admin Dashboard:** Manage users, products, categories, subcategories, brands, and orders.
- **Responsive Design:** Mobile-first, accessible, and highly animated UI using Tailwind CSS 4, Framer Motion, and Radix UI.
- **Image Processing:** Sharp integration for optimizing product image uploads on the server.

## Tech Stack

### Frontend
- **Framework:** Next.js (React 19)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion, Tailwind CSS Animate
- **State Management:** Zustand
- **Form Handling:** React Hook Form & Zod
- **UI Components:** Radix UI Primitives
- **Icons:** Lucide React
- **HTTP Client:** Axios with Axios Retry

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **Authentication:** JSON Web Token (JWT) & bcryptjs
- **Payments:** Stripe API integration
- **Emails:** Nodemailer
- **Image Uploads:** Multer & Sharp
- **Validation:** Express Validator

## Project Structure
```text
Ecommerce/
├── frontend/   # Next.js frontend application
└── backend/    # Node.js/Express backend API
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) running locally or on a cloud cluster

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Ecommerce
```

### 2. Setup Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables: Create a `config.env` file in the `backend` folder based on the following template:
   ```env
   PORT=4000
   DB_URI=mongodb://127.0.0.1/INETechs
   JWT_SECRET_KEY=your_jwt_secret
   JWT_EXPIRE_TIME=7d
   BASE_URL=http://localhost:4000
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000

   # Email (for forgot password)
   Email_Port=465
   Emial_user=your-email@gmail.com
   Email_passowrd=your-app-password

   # Stripe (for payments)
   stipe_secret=your_stripe_secret_key
   ```
4. Start the backend development server:
   ```bash
   npm run start:dev
   ```
   *The server will run on `http://localhost:4000`.*

### 3. Setup Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables: Create a `.env.local` file in the `frontend` folder:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
   NEXT_PUBLIC_APP_NAME=Ecommerce

   # OpenRouter AI
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The app will be available at `http://localhost:3000`.*

## API Overview
The Node.js backend provides a robust RESTful API with the following main resource endpoints:
- `/api/v1/auth`: Registration, login, and password management.
- `/api/v1/users`: User profile and admin user management.
- `/api/v1/products`: Product catalog, search, and details.
- `/api/v1/categories`: Categories and subcategories.
- `/api/v1/cart`: Shopping cart operations.
- `/api/v1/wishlist`: Wishlist operations.
- `/api/v1/orders`: Order creation and Stripe webhooks processing.
- `/api/v1/reviews`: Product ratings and reviews.
- `/api/v1/addresses`: User address management.
- `/api/v1/coupons`: Discount code logic.

## Contributing
Contributions, issues, and feature requests are welcome!

## License
This project is licensed under the ISC License.
