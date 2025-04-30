# 🧾 Edviron Backend — School Payment Microservice

> A scalable, secure, and optimized backend for managing school fee payments, tailored for students, trustees, and admins. Built with **NestJS** and **MongoDB**, this REST API provides endpoints for transactions, payments, and real-time webhook updates.

---

## ✨ Key Features & Optimizations

### 🧩 Microservice Architecture
- Built using **NestJS** with a modular structure for scalability.
- Follows **Separation of Concerns** for maintainability and testing ease.

### 🗃️ MongoDB Schemas
- **Order Schema**: Tracks payment initiation requests with school, trustee, and student metadata.
- **Order Status Schema**: Tracks the lifecycle and final status of each payment.
- **Webhook Logs Schema**: Stores raw webhook payloads for auditing and debugging.

### 🔐 JWT Authentication
- Secures all routes with **JWT-based access control**.
- Includes a **User schema** for login credential storage.
- Protects sensitive endpoints from unauthorized access.

### 💳 Payment Gateway Integration
- `/create-payment`: 
  - Accepts payment details, creates an order, and generates a **JWT-signed payload**.
  - Forwards the request to the external payment API and **redirects users** to the gateway's hosted page.
- Environment-specific credentials handled via `.env` using **ConfigModule**.

### 🔁 Webhook Integration
- `/webhook`: Accepts real-time updates from the payment gateway.
  - Parses payload and updates the **Order Status** document.
  - Stores a copy of the raw payload in **Webhook Logs** for transparency.

### 📊 Optimized APIs
- `/transactions`: Aggregates data from **Order** and **Order Status** using the MongoDB **aggregation pipeline**.
  - Supports **pagination**, **sorting**, and **search** (via `?sort=payment_time&order=desc`).
  - Indexed fields: `school_id`, `custom_order_id`, `collect_id`.

- `/transactions/school/:schoolId`: 
  - Filters transactions related to a specific school.

- `/transaction-status/:custom_order_id`: 
  - Retrieves the status of a specific transaction by custom ID.

### 🧪 Robust Validation & Error Handling
- Validates all incoming requests using `class-validator`.
- Structured and descriptive error messages across all endpoints.

### 🔒 Security Best Practices
- JWT-based route protection.
- CORS configured for frontend/backend integration.
- All user inputs sanitized and validated to prevent injection attacks.

### 🌐 Environment Configuration
- Uses `.env` for:
  - MongoDB URI
  - JWT secrets
  - Payment API credentials

### 🧾 Logging & Debugging
- Webhook failures and payloads are stored in a dedicated **Webhook Logs** collection.
- Provides detailed logs for all important actions and failure points.

---

## 📦 Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB Atlas
- **Auth**: JWT (jsonwebtoken)
- **Tools**: class-validator, mongoose, dotenv, axios

---

## 🚀 Performance Optimizations

| Feature           | Implementation                         |
|------------------|------------------------------------------|
| Pagination        | `?page=1&limit=10` query params          |
| Sorting           | `?sort=payment_time&order=desc` support  |
| MongoDB Indexes   | Indexed on `school_id`, `custom_order_id`, `collect_id` |
| Aggregation       | MongoDB aggregation pipeline for joins   |
| Stateless Auth    | JWT tokens instead of sessions           |

---

## 🔧 Setup Instructions

```bash
git clone https://github.com/your-username/edviron-backend.git
cd edviron-backend
npm install
npm run start:dev
