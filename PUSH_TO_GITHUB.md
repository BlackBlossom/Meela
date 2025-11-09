# Quick Setup Instructions

## You need to create your own GitHub repository first!

### Step 1: Create New Repository on GitHub

1. Go to: https://github.com/new
2. Login with your account (rajarshi498)
3. Repository name: **meela-store**
4. Description: "E-commerce store for Meela Herbals with custom cart and Firebase integration"
5. Choose: **Public** or **Private**
6. **IMPORTANT**: Do NOT check any boxes (no README, no .gitignore, no license)
7. Click **"Create repository"**

### Step 2: Update Remote URL

After creating the repository, run these commands:

```cmd
cd C:\Users\rajar\OneDrive\Desktop\proj1\meela

# Remove old remote
git remote remove origin

# Add your new remote (replace YOUR_USERNAME with rajarshi498 or your GitHub username)
git remote add origin https://github.com/rajarshi498/meela-store.git

# Verify remote was added
git remote -v

# Push to your repository
git push -u origin main
```

### Step 3: If Authentication is Required

When prompted for credentials:
- **Username**: rajarshi498 (or your GitHub username)
- **Password**: Use a Personal Access Token (NOT your GitHub password)

#### To create a Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: "meela-store-access"
4. Expiration: Choose 90 days or No expiration
5. Select scopes: Check **repo** (all options under repo)
6. Click "Generate token"
7. **COPY THE TOKEN** immediately (you won't see it again!)
8. Use this token as your password when Git asks

### Alternative: Using Git Credential Manager

If you have Git Credential Manager installed:

```cmd
# This will open a browser window for authentication
git push -u origin main
```

Then authenticate in the browser.

---

## Quick Commands Summary

```cmd
# Navigate to project
cd C:\Users\rajar\OneDrive\Desktop\proj1\meela

# Remove old remote
git remote remove origin

# Add new remote (UPDATE WITH YOUR USERNAME!)
git remote add origin https://github.com/rajarshi498/meela-store.git

# Push to GitHub
git push -u origin main
```

---

## After Successful Push

Your repository will be available at:
**https://github.com/rajarshi498/meela-store**

Share this URL with others to show your project!

---

## Need Help?

If you encounter any issues:
1. Check that you created the repository on GitHub
2. Make sure you're using the correct username
3. Use Personal Access Token instead of password
4. Check your internet connection
