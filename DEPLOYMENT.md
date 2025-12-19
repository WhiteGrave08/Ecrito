# How to Deploy to Vercel

This guide explains how to deploy your Next.js application to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup)
- A [GitHub account](https://github.com/) (recommended)
- Your project pushed to a GitHub repository

## Method 1: Deploy via GitHub Integration (Recommended)

This method automatically redeploys your app whenever you push changes to GitHub.

1.  **Push your code** to a GitHub repository.
2.  **Log in** to your [Vercel Dashboard](https://vercel.com/dashboard).
3.  Click **"Add New..."** -> **"Project"**.
4.  **Import** your Git repository.
5.  **Configure Project**:
    - **Framework Preset**: Next.js (should be auto-detected).
    - **Root Directory**: `./` (default).
    - **Environment Variables**: You MUST add the following variables (copy values from your local `.env.local`):
      - `NEXT_PUBLIC_SUPABASE_URL`
      - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
6.  Click **"Deploy"**.

## Method 2: Deploy via Command Line (CLI)

If you prefer to deploy directly from your terminal:

1.  Run the deployment command:
    ```bash
    npx vercel
    ```
2.  Follow the interactive prompts:

    - Set up and deploy? **Y**
    - Which scope? (Select your account)
    - Link to existing project? **N** (unless you already created one)
    - Project name? (Press Enter for default)
    - In which directory is your code located? (Press Enter for `./`)
    - Want to modify these settings? **N** (unless you need to override build command)

3.  **Add Environment Variables**:
    After the first deployment (which might fail if it needs env vars), go to the Vercel Dashboard for your new project, navigate to **Settings > Environment Variables**, and add:

    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

    Then run `npx vercel --prod` to redeploy.

## Post-Deployment Check

After deployment, visit your live URL.

- Check if you can log in / sign up (verifies Supabase connection).
- Check standard functionality.

## Troubleshooting

### React 19 Peer Dependency Issues

If you encounter errors like `ERESOLVE overriding peer dependency` related to `react-joyride` or `react-floater` during deployment:

**Solution:**
We have added an `overrides` section to `package.json` to force these libraries to accept React 19.

```json
"overrides": {
  "react-joyride": {
    "react": "$react",
    "react-dom": "$react-dom"
  },
  "react-floater": {
    "react": "$react",
    "react-dom": "$react-dom"
  }
}
```

This ensures that `npm install` succeeds on Vercel. **Make sure to push the updated `package.json` to your repository.**
