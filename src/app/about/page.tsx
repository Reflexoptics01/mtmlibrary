'use client';

import Layout from '../../components/layout/Layout';
import Image from 'next/image';

export default function About() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">About</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">Dawat-e-Islami</h2>
            
            <div className="flex flex-col md:flex-row items-center mb-6">
              <div className="w-full md:w-1/3 mb-4 md:mb-0 flex justify-center">
                <div className="rounded-full bg-white p-2 shadow-md">
                  <Image
                    src="/assets/dawateislami_logo.png"
                    alt="Dawat-e-Islami Logo"
                    width={150}
                    height={150}
                    className="rounded-full"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-2/3 md:pl-6">
                <p className="text-gray-700 mb-4">
                  Dawat-e-Islami is a global non-political Islamic organization dedicated to spreading the teachings of the Quran and Sunnah. Founded by Shaykh-e-Tareeqat Ameer-e-Ahl-e-Sunnat Muhammad Ilyas Qadri, it has become one of the largest Islamic movements focused on self-reformation and spreading the message of love, peace, and knowledge.
                </p>
                <p className="text-gray-700">
                  With centers established in over 100 countries worldwide, Dawat-e-Islami conducts regular programs, courses, and educational initiatives to promote Islamic teachings and values in accordance with the Hanafi school of thought and the Ahle Sunnat wal Jamaat tradition.
                </p>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-green-700 mb-4">Dawat-e-Islami India Branch</h2>
            <p className="text-gray-700 mb-4">
              The India branch of Dawat-e-Islami has been actively serving the community through numerous religious, educational, and welfare initiatives. Present in most states across India, it operates several Madaris, educational institutions, and welfare programs.
            </p>
            
            <h2 className="text-xl font-semibold text-green-700 mb-4">Madersatul Madina Faizane Gareeb Nawaz Gangavathi</h2>
            <p className="text-gray-700 mb-4">
              Madersatul Madina Faizane Gareeb Nawaz in Gangavathi is a prominent educational institution dedicated to Islamic education. The institution focuses on creating Huffaz (those who memorize the entire Quran) through a structured curriculum that combines traditional Islamic education with modern teaching methodologies.
            </p>
            <p className="text-gray-700 mb-4">
              Students at Madersatul Madina receive comprehensive education in Quranic recitation, memorization, Tajweed (rules of recitation), and Islamic studies, all in a nurturing environment that promotes spiritual and personal growth.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">About This Software</h2>
            <p className="text-gray-700 mb-4">
              This library management system was created by a dedicated member of Dawat-e-Islami for the Ishale Sawab (reward in the hereafter) of their grandparents. It was developed with love and devotion to support Islamic educational institutions in managing their libraries efficiently.
            </p>
            <p className="text-gray-700 mb-4">
              The system provides comprehensive tools for managing books, student records, borrowings, and Farameen-e-Attar publications, making it easier for Islamic institutions to organize their resources and better serve their communities.
            </p>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Open Source</h3>
              <p className="text-gray-700">
                This software is open-sourced and available for use by any Islamic institution worldwide. It can be freely adopted, modified, and implemented by madrassas, Islamic schools, and libraries to enhance their operations and better serve their communities. For integration assistance or customization, please reach out via the contact information in the Help section.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 