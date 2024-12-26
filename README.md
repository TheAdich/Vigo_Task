
# Role-Based Web Application

A web application with role-based functionality for users and admins, featuring referral management, reward points, and admin request approvals.

## Features

### 1. Role-Based Access
#### Regular User:
- Create an account and optionally enter a referral code during registration.
- Receive a verification email for referral completion.
- Reward points credited to the referrer upon successful verification.

#### Admin User:
- Manage admin requests (approve/deny).
- Denied users can re-request admin approval.

---

### 2. Reward Point Policy System
- Users earn reward points for successful referrals.

---

### 3. Admin Request Approval
- Users can request admin access.
- Existing admins can approve/deny requests.
- Denied users can resend requests.

---

### 4. Separate Dashboards
- User Dashboard: Manage referrals and view reward points.
- Admin Dashboard: Manage admin requests and platform settings.

---

## Backend Overview

- **Framework**: Node.js
- **Database**: PostgreSQL
  - Using Prisma ORM for database operations.
- **Authentication**: JWT-based secure session management.
- **Security**: Passwords hashed using industry-standard algorithms.
- **Key Modules**:
  - `userRouter`: Handles user authentication and registration.
  - `referalRouter`: Manages referral data and verification.
  - `adminRouter`: Handles admin requests and approvals.
- **Server Setup**: Express.js with middleware for CORS and JSON parsing.

---
### Credential To Check
- **email**:adidadhich2003@gmail.com
- **password**:123456
- **referal code for the above admin**:2577915b-6b4e-4fb4-832f-11516600d549
### Attaching src of the web app
![Screenshot 2024-12-26 210647](https://github.com/user-attachments/assets/ade37258-9594-43b4-8f08-b9a14e409e70)
![Screenshot 2024-12-26 210613](https://github.com/user-attachments/assets/4927d8c4-2041-49f7-b271-0facb4df810f)
![Screenshot 2024-12-26 210546](https://github.com/user-attachments/assets/cf018bb7-da97-40ff-91ef-4fca5cb5011a)


