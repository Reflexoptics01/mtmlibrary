'use client';

import Layout from '../../components/layout/Layout';

export default function Help() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">Help & Support</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Get support</h2>
            <div className="bg-green-50 p-6 rounded-lg mb-6">
              <p className="text-gray-700 mb-2">
                For assistance, bug reports, or questions about Maktaba, open an issue on the project repository or contact your institute administrator.
              </p>
              <p className="text-gray-600 italic mt-2">
                We aim to respond to community issues promptly, in sha Allah.
              </p>
            </div>
            
            <h3 className="text-xl font-semibold text-green-700 mb-4">Reporting Issues</h3>
            <p className="text-gray-700 mb-4">
              If you encounter any technical issues while using the system, please include the following details in your report:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-700 space-y-2">
              <li>Detailed description of the issue</li>
              <li>Steps to reproduce the problem</li>
              <li>Which page or feature you were using</li>
              <li>Screenshots of the issue (if possible)</li>
              <li>Browser and device information</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-green-700 mb-4">Feature Requests</h3>
            <p className="text-gray-700 mb-4">
              We welcome suggestions for new features or improvements! When submitting a feature request, please provide:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-700 space-y-2">
              <li>Clear description of the proposed feature</li>
              <li>How this feature would benefit your library operations</li>
              <li>Any specific requirements or preferences for implementation</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">How do I add a new book to the system?</h3>
                <p className="text-gray-700">
                  Navigate to the Books section and click on the "Add New Book" button. Fill in all the required details about the book and submit the form.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">How do I register a new student?</h3>
                <p className="text-gray-700">
                  Go to the Students section and click on "Register New Student." Complete the registration form with the student's information and submit.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">How does the borrowing system work?</h3>
                <p className="text-gray-700">
                  The system tracks all book loans and returns. To record a new borrowing, go to the Borrowings section and click "New Borrowing." Select the student, book, and duration. When the book is returned, find the record in the Borrowings section and click "Return."
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Is this system available in other languages?</h3>
                <p className="text-gray-700">
                  Currently the interface is English. Urdu and Arabic would help many madrasas — contributions are welcome.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">Can I use this system for my Islamic institution?</h3>
                <p className="text-gray-700">
                  Yes. Maktaba is free and open source (MIT). Any masjid, school, or madrasa can run its own copy. See the README and DEPLOYMENT.md to get started.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 