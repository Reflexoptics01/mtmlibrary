# Madersatul Madina Library Management System

This is a comprehensive library management system for Madersatul Madina Faizane Gareeb Nawaz Gangavathi Dawate Islami India branch. The system includes library management features and a section for uploading and viewing monthly Farameen-e-Attar publications.

## Features

- Book management (add, edit, delete, search)
- Student registration and management
- Borrowing and return tracking
- Fine calculation system
- Farameen-e-Attar publication management (audio and booklet formats)
- User authentication and authorization
- Responsive design for all devices

## Technologies Used

- Next.js with TypeScript
- Tailwind CSS for styling
- Firebase Authentication
- Firebase Firestore for database
- Firebase Storage for file storage

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/madina-library.git
cd madina-library
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Deployment

The application is deployed using Vercel. You can access it at the following URL:
[https://madersatul-madina-library.vercel.app](https://madersatul-madina-library.vercel.app)

## Initial Login Credentials

- Email: madersatulmadinagvt@gmail.com
- Password: (provided during setup)

## Usage

### Library Management

1. **Books Management**
   - Add new books with details like title, author, category, etc.
   - View all books in the library
   - Search and filter books
   - Edit or delete book information

2. **Student Management**
   - Register new students
   - View all registered students
   - Search students by name or contact
   - Edit or delete student information

3. **Borrowing Management**
   - Record book borrowings
   - Track due dates
   - Process returns
   - Calculate and collect fines for late returns

### Farameen-e-Attar Management

1. **Upload Publications**
   - Upload monthly Risala in both booklet (PDF) and audio formats
   - Add metadata like title, month, year, language, etc.

2. **View Publications**
   - Browse all uploaded publications
   - Filter by year, month, or language
   - Download booklets or listen to audio recordings

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Dawate Islami for providing the logo and organizational information
- All contributors to the open-source libraries used in this project
