# Stardust ⭐

A simple React application to view your GitHub starred repositories.

## Features

- 🔐 GitHub authentication using Personal Access Token
- ⭐ View all your starred repositories
- 📊 Display repository information (name, description, language, stars)
- 🎨 Clean and responsive UI

## Setup

Install the dependencies:

```bash
npm install
```

## Get Started

Start the dev server:

```bash
npm start
```

Build the app for production:

```bash
npm build
```

Preview the Production build product:

```bash
npm preview
```

Clear persistent cache local files

```bash
npm clean
```

## Usage

1. Visit the application in your browser
2. Click "Login with GitHub Token"
3. Create a Personal Access Token at [GitHub Settings](https://github.com/settings/tokens) with `read:user` scope
4. Enter your token when prompted
5. View your starred repositories!

## Technology Stack

- React 18
- TypeScript
- Farm (Build tool)
- GitHub API

## Note on Authentication

This application uses GitHub Personal Access Tokens for authentication. In a production environment, you should implement proper OAuth flow with a backend server to handle token exchange securely.
