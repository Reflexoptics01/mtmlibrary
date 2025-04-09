# Madersatul Madina Library Management System - Deployment Guide

This guide will help you deploy the Madersatul Madina Library Management System to make it accessible online.

## Prerequisites

1. A Firebase account (free tier is sufficient)
2. A hosting service that supports Next.js applications (Vercel, Netlify, or similar)
3. Basic knowledge of web deployment

## Step 1: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project named "madersatul-madina-library"
3. Enable Authentication with Email/Password sign-in method
4. Create a Firestore database in production mode
5. Enable Storage for file uploads
6. Register a web app in your Firebase project
7. Copy the Firebase configuration values (you'll need these in Step 3)

## Step 2: Create Admin Account

1. In the Firebase Authentication section, add a new user:
   - Email: madersatulmadinagvt@gmail.com
   - Password: dawateislami@786
2. In Firestore Database, create a collection named "users"
3. Add a document with the same ID as the user you created in Authentication
4. Add the following fields to the document:
   - name: "Madersatul Madina Admin"
   - email: "madersatulmadinagvt@gmail.com"
   - role: "admin"
   - contactNumber: "" (or add your contact number)

## Step 3: Configure Environment Variables

1. Open the `.env.local` file in this package
2. Replace the placeholder values with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

## Step 4: Deploy to Hosting Service

### Option 1: Vercel (Recommended)

1. Create an account on [Vercel](https://vercel.com/)
2. Install Vercel CLI: `npm install -g vercel`
3. Navigate to the project directory
4. Run: `vercel login`
5. Deploy with: `vercel`
6. Follow the prompts and add your environment variables
7. Once deployed, Vercel will provide you with a URL to access your application

### Option 2: Netlify

1. Create an account on [Netlify](https://www.netlify.com/)
2. Install Netlify CLI: `npm install -g netlify-cli`
3. Navigate to the project directory
4. Run: `netlify login`
5. Deploy with: `netlify deploy`
6. Follow the prompts and add your environment variables
7. Once deployed, Netlify will provide you with a URL to access your application

### Option 3: Manual Deployment

1. Build the application: `npm run build`
2. Start the application: `npm start`
3. The application will be available at http://localhost:3000

## Step 5: Access Your Application

1. Open the URL provided by your hosting service
2. Log in with the admin credentials:
   - Email: madersatulmadinagvt@gmail.com
   - Password: dawateislami@786
3. You can now start using the library management system

## Features Available After Deployment

1. **Library Management**
   - Add, edit, and delete books
   - Register students
   - Track book borrowings and returns
   - Calculate fines for late returns

2. **Farameen-e-Attar Management**
   - Upload monthly Risala in audio and booklet formats
   - Browse and download publications
   - Filter by year, month, or language

## Troubleshooting

- If you encounter issues with Firebase authentication, check your Firebase project settings
- If file uploads fail, verify your Firebase Storage rules
- For database issues, check your Firestore rules and indexes

## Need Help?

If you need assistance with deployment or using the application, please refer to the README.md file for more detailed information about the application's features and functionality.
