'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../../../components/layout/Layout';

interface Student {
  id: string;
  name: string;
  fatherName: string;
  rollNumber: string;
  grade: string;
  contactNumber: string;
  address: string;
}

type Props = {
  params: { id: string }
}

export default function EditStudent({ params }: Props) {
  const [student, setStudent] = useState<Student>({
    id: '',
    name: '',
    fatherName: '',
    rollNumber: '',
    grade: '',
    contactNumber: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    // This would normally fetch student data from Firebase
    // For now, use mock data
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockStudent: Student = {
        id,
        name: 'Ahmed Khan',
        fatherName: 'Imran Khan',
        rollNumber: 'STD001',
        grade: 'Class 10',
        contactNumber: '9876543210',
        address: 'Main Street, Gangavathi'
      };
      
      setStudent(mockStudent);
      setLoading(false);
    }, 500);
  }, [id]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!student.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!student.fatherName.trim()) {
      newErrors.fatherName = 'Father\'s name is required';
    }
    
    if (!student.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
    }
    
    if (!student.grade.trim()) {
      newErrors.grade = 'Grade/Class is required';
    }
    
    if (!student.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\d{10}$/.test(student.contactNumber.trim())) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
    }
    
    if (!student.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // This would normally update the student data in Firebase
      // For now, just simulate an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSuccess('Student updated successfully');
      
      // Redirect to student details page after a brief delay
      setTimeout(() => {
        router.push(`/students/${id}`);
      }, 1500);
    } catch (err) {
      setError('Failed to update student. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudent(prev => ({ ...prev, [name]: value }));
    
    // Clear the error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-gray-600">Loading student details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-800">Edit Student</h1>
          <button 
            onClick={() => router.push(`/students/${id}`)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={student.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-600`}
                  placeholder="Full name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              
              <div>
                <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700 mb-1">
                  Father's Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="fatherName"
                  name="fatherName"
                  value={student.fatherName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.fatherName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-600`}
                  placeholder="Father's name"
                />
                {errors.fatherName && <p className="mt-1 text-sm text-red-600">{errors.fatherName}</p>}
              </div>
              
              <div>
                <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Roll Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="rollNumber"
                  name="rollNumber"
                  value={student.rollNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.rollNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-600`}
                  placeholder="Roll number"
                />
                {errors.rollNumber && <p className="mt-1 text-sm text-red-600">{errors.rollNumber}</p>}
              </div>
              
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                  Grade/Class <span className="text-red-600">*</span>
                </label>
                <select
                  id="grade"
                  name="grade"
                  value={student.grade}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.grade ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-600`}
                >
                  <option value="">Select Grade/Class</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                  <option value="Class 4">Class 4</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Special">Special</option>
                </select>
                {errors.grade && <p className="mt-1 text-sm text-red-600">{errors.grade}</p>}
              </div>
              
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  value={student.contactNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-600`}
                  placeholder="Contact number"
                />
                {errors.contactNumber && <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={student.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-600`}
                  placeholder="Address"
                ></textarea>
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className={`bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-md ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {submitting ? 'Updating...' : 'Update Student'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
} 