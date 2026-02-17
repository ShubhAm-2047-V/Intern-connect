# How to Run InternConnect Backend

Since Node.js was not detected on your system, I have generated all the necessary code but you need to manually run it.

## Prerequisites
1.  **Install Node.js**: Download from [nodejs.org](https://nodejs.org/).
2.  **Install MongoDB**: Download Community Server from [mongodb.com](https://www.mongodb.com/try/download/community) or use MongoDB Atlas.

## Setup Steps
1.  Open a terminal/command prompt.
2.  Navigate to the server directory:
    ```bash
    cd d:/website/server
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Configure Environment:
    -   Open `d:/website/server/.env`
    -   Ensure `MONGO_URI` points to your MongoDB instance (default is localhost).

## Seeding Data (Optional)
To populate the database with dummy users and jobs:
```bash
npm run seed
```

## Running the Server
Start the backend server:
```bash
npm start
```
The server will run at `http://localhost:5000`.

## API Endpoints (Quick Reference)
-   **POST** `/api/auth/login` (email, password)
-   **GET** `/api/student/internships`
-   **POST** `/api/student/apply/:id`
