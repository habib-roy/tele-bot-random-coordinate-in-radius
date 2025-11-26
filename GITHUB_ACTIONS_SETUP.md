# GitHub Actions Setup for Vercel Deployment

This document explains how to configure GitHub Secrets for automatic deployment to Vercel.

## Required GitHub Secrets

You need to add three secrets to your GitHub repository:

### 1. VERCEL_TOKEN

**How to get it:**
1. Go to [Vercel Account Settings - Tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Give it a name (e.g., "GitHub Actions")
4. Set the scope to your account or team
5. Copy the generated token

### 2. VERCEL_ORG_ID

**How to get it:**
1. Open your terminal in the project directory
2. Run: `cat .vercel/project.json`
3. Copy the value of `"orgId"`

### 3. VERCEL_PROJECT_ID

**How to get it:**
1. Open your terminal in the project directory
2. Run: `cat .vercel/project.json`
3. Copy the value of `"projectId"`

## Adding Secrets to GitHub

1. Go to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each of the three secrets:
   - Name: `VERCEL_TOKEN`, Value: [your token]
   - Name: `VERCEL_ORG_ID`, Value: [your org ID]
   - Name: `VERCEL_PROJECT_ID`, Value: [your project ID]

## How It Works

Once the secrets are configured:
1. Push code to the `main` branch
2. GitHub Actions automatically triggers
3. The workflow builds and deploys to Vercel production
4. You'll see the deployment status in the **Actions** tab

## Checking Deployment Status

- Go to the **Actions** tab in your GitHub repository
- Click on the latest workflow run to see details
- Each step's logs are available for debugging
