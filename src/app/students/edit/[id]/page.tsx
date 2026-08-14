'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import StaffGate from '@/components/StaffGate';
import { getStudentById, updateStudent } from '@/lib/db';
import type { Student } from '@/lib/types';

export default function EditStudent() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getStudentById(id);
        if (!data) setError('Student not found');
        else setStudent(data);
      } catch {
        setError('Failed to load student data');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const validate = (): boolean => {
    if (!student) return false;
    const next: Record<string, string> = {};
    if (!student.name.trim()) next.name = 'Full name is required';
    if (!student.fatherName.trim()) next.fatherName = 'Father name is required';
    if (!student.rollNumber.trim()) next.rollNumber = 'Roll number is required';
    if (!student.grade.trim()) next.grade = 'Class is required';
    if (!student.contactNumber.trim()) next.contactNumber = 'Contact number is required';
    if (!student.address.trim()) next.address = 'Address is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !validate()) return;
    setSubmitting(true);
    setError('');
    try {
      await updateStudent(id, student);
      setSuccess('Student updated successfully');
      setTimeout(() => router.push(`/students/${id}`), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudent((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  if (loading || !student) {
    return (
      <StaffGate>
        <Layout>
          <p className="text-center text-gray-600 py-8">{error || 'Loading student details...'}</p>
        </Layout>
      </StaffGate>
    );
  }

  return (
    <StaffGate>
      <Layout>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-green-800">Edit Student</h1>
            <button onClick={() => router.push(`/students/${id}`)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Cancel</button>
          </div>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              ['name', 'Full Name'],
              ['fatherName', 'Father Name'],
              ['rollNumber', 'Roll Number'],
              ['grade', 'Class / Grade'],
              ['contactNumber', 'Contact Number'],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  name={name}
                  value={(student as unknown as Record<string, string>)[name]}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors[name] ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors[name] && <p className="mt-1 text-sm text-red-600">{errors[name]}</p>}
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea name="address" value={student.address} onChange={handleInputChange} rows={3} className={`w-full px-3 py-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`} />
            </div>
            <div className="md:col-span-2">
              <button type="submit" disabled={submitting} className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded">
                {submitting ? 'Updating...' : 'Update Student'}
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </StaffGate>
  );
}
