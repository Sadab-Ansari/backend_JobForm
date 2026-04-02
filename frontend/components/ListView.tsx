"use client"

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Job {
  id?: number;
  name: string;
  email: string;
  phone: string;
  designation: string;
  state: string;
  district: string;
  address: string;
  skills: string;
}

interface ListViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ListView({ isOpen, onClose }: ListViewProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.documentElement.classList.add('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
    };
  }, [isOpen]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5063/api/job');
      if (response.ok) {
        const data = await response.json();
        setJobs(Array.isArray(data) ? data : []);
      } else {
        throw new Error('Failed to fetch');
      }
    } catch (err) {
      setError('Using mock data');
      setJobs([
        {name: 'John Doe', email: 'john@example.com', phone: '1234567890', designation: 'Software Engineer', state: 'Karnataka', district: 'Bangalore', address: '123 Main St', skills: 'React, Node'},
        {name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', designation: 'Frontend Developer', state: 'Maharashtra', district: 'Pune', address: '456 Elm St', skills: 'Vue, Tailwind'},
        {name: 'Bob Johnson', email: 'bob@example.com', phone: '1112223334', designation: 'Backend Developer', state: 'Tamil Nadu', district: 'Chennai', address: '789 Oak St', skills: 'Python, Django'},
        {name: 'Alice Brown', email: 'alice@example.com', phone: '4445556667', designation: 'DevOps Engineer', state: 'Delhi', district: 'New Delhi', address: '101 Pine St', skills: 'Docker, AWS'},
        {name: 'Charlie Davis', email: 'charlie@example.com', phone: '7778889990', designation: 'Full Stack', state: 'Kerala', district: 'Kochi', address: '202 Birch St', skills: 'Next.js, MongoDB'},
        {name: 'Eva Wilson', email: 'eva@example.com', phone: '1239874560', designation: 'UI/UX Designer', state: 'Gujarat', district: 'Ahmedabad', address: '303 Cedar St', skills: 'Figma, XD'}
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchJobs();
      setCurrentPage(1);
    }
  }, [isOpen]);

  const indexOfLastJob = currentPage * itemsPerPage;
  const indexOfFirstJob = indexOfLastJob - itemsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onClose();
    setCurrentPage(1);
  };

  if (!isOpen) return null;

  const modalContent = (
    <>
      {/* Full Viewport Overlay */}
      <div
        className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-xl"
        style={{
          WebkitBackdropFilter: 'blur(12px)',
          backdropFilter: 'blur(12px)'
        }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[100000] flex items-center justify-center p-4 pointer-events-none"
        onClick={handleClose}
      >
        <div
          className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 max-w-6xl max-h-[90vh] w-full max-w-4xl flex flex-col overflow-hidden pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-gray-200/50 bg-white/90 backdrop-blur-xl sticky top-0 z-10 flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Job Applications ({jobs.length})
            </h2>
            <button
  onClick={handleClose}
  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200/50 hover:bg-gray-300 transition-all text-gray-700 hover:scale-105"
>
  ✕
</button>
            {error && (
              <p className="absolute top-2 right-12 bg-orange-100 text-orange-800 px-3 py-1 rounded-xl text-sm font-medium">
                {error}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
                <p>Loading...</p>
              </div>
            ) : currentJobs.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <div className="text-6xl mb-4 opacity-25">📋</div>
                <p className="text-xl font-medium mb-2">No applications</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-2xl border border-gray-200/30 bg-white/80 backdrop-blur-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50/50">
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Phone</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Location</th>
                        <th className="px-4 py-3 text-center text-sm font-bold text-gray-800">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {currentJobs.map((job, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 font-medium">{job.name}</td>
                          <td className="px-4 py-4">{job.email}</td>
                          <td className="px-4 py-4">{job.phone}</td>
                          <td className="px-4 py-4 font-medium">{job.designation}</td>
                          <td className="px-4 py-4">{job.state}, {job.district}</td>
                          <td className="px-4 py-4 text-center">
                            <div className="flex gap-2 justify-center">
                              <button className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all">
                                View
                              </button>
                              <button className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all">
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 pt-4 border-t border-gray-200 bg-white/70 rounded-xl p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 bg-white border rounded-xl disabled:opacity-50"
                        >
                          Prev
                        </button>
                        <span className="px-4 py-2 font-medium">{currentPage}</span>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 bg-white border rounded-xl disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}

