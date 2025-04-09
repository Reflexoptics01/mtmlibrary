# Library Management App Deployment Guide

This document provides instructions for deploying the Madersatul Madina Library Management System.

## Prerequisites

- Firebase account
- Vercel account (for deployment)
- Node.js and npm installed

## Deployment Steps

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "madersatul-madina-library"
3. Enable Authentication with Email/Password sign-in method
4. Create a Firestore database in production mode
5. Enable Storage for file uploads
6. Register a web app in your Firebase project
7. Copy the Firebase configuration values for the next step

### 2. Environment Configuration

Update the `.env.local` file with your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Vercel Deployment

1. Create an account on [Vercel](https://vercel.com/) if you don't have one
2. Install Vercel CLI: `npm i -g vercel`
3. Login to Vercel: `vercel login`
4. Navigate to the project directory
5. Run: `vercel`
6. Follow the prompts to link to your Vercel account
7. Add the environment variables from step 2
8. Deploy with: `vercel --prod`

### 4. Create Admin User

After deployment:

1. Access the Firebase console
2. Go to Authentication section
3. Add a new user with the provided credentials:
   - Email: madersatulmadinagvt@gmail.com
   - Password: dawateislami@786
4. Go to Firestore Database
5. Create a document in the "users" collection with the same UID as the created user
6. Add the following fields:
   - name: "Madersatul Madina Admin"
   - email: "madersatulmadinagvt@gmail.com"
   - role: "admin"
   - createdAt: (server timestamp)

### 5. Verify Deployment

1. Access your deployed application at the Vercel URL
2. Login with the admin credentials
3. Verify all functionality is working correctly

## Troubleshooting

- If authentication fails, check Firebase Authentication settings
- If file uploads fail, verify Storage rules in Firebase
- For database issues, check Firestore rules and indexes
