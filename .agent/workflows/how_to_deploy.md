---
description: How to deploy the Luna Web App
---

# Deploying Luna

You can deploy your "Luna" Night Sky Simulation for free using **Vercel** or **GitHub Pages**.

## Option 1: Vercel (Recommended - Easiest)

Vercel is optimized for frontend frameworks like Vite/React.

1.  **Create a GitHub Repository**:
    *   Initialize git if you haven't: `git init`
    *   Add files: `git add .`
    *   Commit: `git commit -m "Initial commit"`
    *   Push to a new repository on GitHub.

2.  **Deploy on Vercel**:
    *   Go to [vercel.com](https://vercel.com) and sign up/login.
    *   Click "Add New..." -> "Project".
    *   Import your GitHub repository.
    *   Framework Preset should automatically detect "Vite".
    *   Click **Deploy**.

## Option 2: GitHub Pages

1.  **Install `gh-pages`**:
    ```bash
    npm install gh-pages --save-dev
    ```

2.  **Update `package.json`**:
    Add the `homepage` field and deployment scripts:
    ```json
    {
      "homepage": "https://<your-username>.github.io/<repo-name>",
      "scripts": {
        // ... existing scripts
        "predeploy": "npm run build",
        "deploy": "gh-pages -d dist"
      }
    }
    ```

3.  **Update `vite.config.ts`**:
    Set the base URL:
    ```ts
    export default defineConfig({
      base: '/<repo-name>/', // Replace with your repository name
      plugins: [react()],
      // ...
    })
    ```

4.  **Deploy**:
    ```bash
    npm run deploy
    ```

## Build Locally (For testing)

To verify the production build works locally before deploying:

1.  **Build**:
    ```bash
    npm run build
    ```
2.  **Preview**:
    ```bash
    npm run preview
    ```
    This spins up a local server serving the optimized production build.
