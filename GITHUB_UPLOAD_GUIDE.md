# How to Upload Meela Store to GitHub

Follow these steps to upload your project to GitHub repository.

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com)
2. Log in to your account (or create one if you don't have it)
3. Click the **"+"** icon in the top-right corner
4. Select **"New repository"**
5. Fill in the details:
   - **Repository name**: `meela-store`
   - **Description**: "E-commerce store for Meela Herbals with custom cart and Firebase integration"
   - **Visibility**: Choose "Public" or "Private"
   - **DON'T** initialize with README (we already have one)
6. Click **"Create repository"**

## Step 2: Configure Git (First Time Only)

If you haven't configured Git before, run these commands:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Step 3: Prepare Your Project

Open Command Prompt (cmd) and navigate to your project:

```cmd
cd C:\Users\rajar\OneDrive\Desktop\proj1\meela
```

Check Git status:

```cmd
git status
```

## Step 4: Stage Your Files

Add all files to staging:

```cmd
git add .
```

Check what will be committed:

```cmd
git status
```

## Step 5: Commit Your Changes

Commit with a message:

```cmd
git commit -m "Initial commit: Meela Herbals store with custom cart and Firebase integration"
```

## Step 6: Connect to GitHub

Add your GitHub repository as remote (replace YOUR_USERNAME):

```cmd
git remote add origin https://github.com/YOUR_USERNAME/meela-store.git
```

To check if remote was added:

```cmd
git remote -v
```

## Step 7: Push to GitHub

Push your code to GitHub:

```cmd
git branch -M main
git push -u origin main
```

### If You Get an Authentication Error:

GitHub requires a Personal Access Token (PAT) instead of password:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "meela-store-access"
4. Select scopes: **repo** (all checkboxes under repo)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
7. When Git asks for password, paste the token instead

## Step 8: Verify Upload

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/meela-store`
2. You should see all your files
3. Check if README.md is displayed on the homepage

## 🎉 Success!

Your project is now on GitHub!

---

## Common Issues and Solutions

### Issue 1: "Permission denied"
**Solution**: Make sure you have the correct GitHub username and you've set up authentication (PAT or SSH).

### Issue 2: "Remote origin already exists"
**Solution**: Remove and re-add the remote:
```cmd
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/meela-store.git
```

### Issue 3: Files not being tracked
**Solution**: Check `.gitignore` file. Make sure important files aren't ignored.

### Issue 4: "Failed to push"
**Solution**: Pull first, then push:
```cmd
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## Future Updates

When you make changes to your project:

```cmd
# Navigate to project directory
cd C:\Users\rajar\OneDrive\Desktop\proj1\meela

# Check what changed
git status

# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Description of what you changed"

# Push to GitHub
git push
```

---

## Quick Reference Commands

```cmd
# Check status
git status

# Add all files
git add .

# Add specific file
git add filename.html

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push

# Pull from GitHub
git pull

# View commit history
git log

# View remote URLs
git remote -v

# Create new branch
git checkout -b feature-name

# Switch branch
git checkout main
```

---

## GitHub Repository Settings

### Enable GitHub Pages (Optional)

To host your site on GitHub Pages:

1. Go to repository → Settings → Pages
2. Source: Select "main" branch
3. Folder: Select "/ (root)"
4. Click Save
5. Your site will be at: `https://YOUR_USERNAME.github.io/meela-store/`

**Note**: You'll need to update Firebase configuration for the GitHub Pages URL.

### Add Repository Description

1. Go to your repository homepage
2. Click the ⚙️ gear icon next to "About"
3. Add description: "E-commerce store for Meela Herbals"
4. Add topics: `ecommerce`, `firebase`, `javascript`, `html-css`, `shopping-cart`
5. Save changes

### Add Collaborators (Optional)

1. Go to Settings → Collaborators
2. Click "Add people"
3. Enter GitHub username or email
4. Send invitation

---

## Need Help?

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [GitHub Support](https://support.github.com/)

---

**Good luck with your project! 🚀**
