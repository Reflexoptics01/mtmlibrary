// Next.js Configuration
// This file is needed for deployment

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: "AIzaSyDIckSPK9o0hzcQN7XBiBQDLXI_w0ogi0c",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "madersatul-madina-library.firebaseapp.com",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: "madersatul-madina-library",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "madersatul-madina-library.firebasestorage.app",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "704837468739",
    NEXT_PUBLIC_FIREBASE_APP_ID: "1:704837468739:web:01a7119b8520c6834a0af6",
  },
}
