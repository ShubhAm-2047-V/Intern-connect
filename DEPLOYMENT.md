# Deployment Guide

Follow these steps to deploy your InternConnect backend and website.

## 1. Push to GitHub
1.  Initialize Git in the root directory:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Create a new repository on GitHub.
3.  Link and push:
    ```bash
    git remote add origin <your-repo-url>
    git branch -M main
    git push -u origin main
    ```

## 2. Deploy on Render
1.  Go to [Render.com](https://render.com/) and log in.
2.  Click **New +** > **Web Service**.
3.  Connect your GitHub account and select your repository.
4.  **Configure Service**:
    -   **Name**: Choose a name (e.g., `internconnect-api`).
    -   **Region**: Closest to you.
    -   **Branch**: `main`.
    -   **Root Directory**: Leave empty (root).
    -   **Runtime**: `Node`.
    -   **Build Command**: `npm install` (Render detects this automatically).
    -   **Start Command**: `npm start` (Render detects this automatically).
5.  **Environment Variables**:
    -   Scroll down to **Environment Variables**.
    -   Add `MONGO_URI`: Your MongoDB connection string.
    -   Add `JWT_SECRET`: A secret string.
    -   Add `NODE_ENV`: `production`.
6.  Click **Create Web Service**.

## 3. Verify
-   Render will start building your app.
-   Once deployed, click the URL at the top left (e.g., `https://internconnect-api.onrender.com`).
-   If successful, you will see your website!
