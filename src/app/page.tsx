'use client';

import { useState } from 'react';
import Layout from '../components/layout/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          Welcome to Madersatul Madina Library Management System
        </h1>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Madersatul Madina Faizane Gareeb Nawaz
          </h2>
          <p className="text-gray-700 mb-4">
            Gangavathi Dawate Islami India Branch
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-2">Library Management</h3>
              <p className="text-gray-600">Manage books, track borrowings, and handle returns</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-2">Student Records</h3>
              <p className="text-gray-600">Register students and manage their information</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-2">Fine Calculation</h3>
              <p className="text-gray-600">Automatically calculate and track fines for late returns</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-2">Farameen-e-Attar</h3>
              <p className="text-gray-600">Access monthly Risala publications in audio and text formats</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Quick Stats
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-200">
              <h3 className="text-xl font-semibold text-blue-800 mb-2">Total Books</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg shadow border border-purple-200">
              <h3 className="text-xl font-semibold text-purple-800 mb-2">Registered Students</h3>
              <p className="text-3xl font-bold text-purple-600">0</p>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg shadow border border-amber-200">
              <h3 className="text-xl font-semibold text-amber-800 mb-2">Active Borrowings</h3>
              <p className="text-3xl font-bold text-amber-600">0</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
