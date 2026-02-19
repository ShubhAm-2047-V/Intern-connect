# How to Restore and Run This Project

Follow these steps to set up this project on a new computer.

## Prerequisites
-   [Node.js](https://nodejs.org/) installed (v16+ recommended).
-   [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a cloud MongoDB URI.
-   [Git](https://git-scm.com/) installed.

## 1. Clone the Repository
Clone the project from GitHub to your local machine:
```bash
git clone https://github.com/ShubhAm-2047-V/Intern-connect.git
cd Intern-connect
```

## 2. Install Dependencies
Install the required Node.js packages for both the server and client (if separate). Since this is a simple setup:
```bash
npm install
```
*Note: This will install dependencies listed in `package.json`.*

## 3. Verify Environment Variables
Check that the `.env` file exists in the `server` folder.
*If it's missing (it shouldn't be, we backed it up), create it manually:*
`server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/internconnect
JWT_SECRET=your_secret_key_here
```

## 4. Run Instructions
There are two parts to this application: the backend server and the frontend.

### Option A: Run with the batch script (Windows)
Double-click `run_app.bat` or run it from the command line:
```bash
./run_app.bat
```

### Option B: Run manually
1.  **Start the Backend Server**:
    Open a terminal in the root directory:
    ```bash
    node server/server.js
    ```
    You should see: `Server running on port 5000` and `MongoDB Connected`.

2.  **Open the Frontend**:
    Simply open `index.html` in your browser, or use a live server extension if you are editing code.

## Troubleshooting
-   **MongoDB Connection Error**: Ensure MongoDB service is running (`services.msc` > MongoDB Server) or check your `MONGO_URI`.
-   **Module not found**: Run `npm install` again to ensure all packages are downloaded.
