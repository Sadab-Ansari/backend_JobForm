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

const API_BASE_URL = 'http://localhost:5063/api/job';

export default function ListView({ isOpen, onClose }: ListViewProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingJob, setViewingJob] = useState<Job | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [deletingJob, setDeletingJob] = useState<Job | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormErrors, setEditFormErrors] = useState<Partial<Record<keyof Job, string>>>({});
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
      const response = await fetch(API_BASE_URL);
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

  // Open view modal
  const handleViewClick = (job: Job) => {
    setViewingJob(job);
    setIsViewModalOpen(true);
  };

  // Close view modal
  const closeViewModal = () => {
    setViewingJob(null);
    setIsViewModalOpen(false);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (job: Job) => {
    setDeletingJob(job);
    setIsDeleteModalOpen(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeletingJob(null);
    setIsDeleteModalOpen(false);
  };

  // Confirm delete job by ID
  const confirmDelete = async () => {
    if (!deletingJob || !deletingJob.id) return;

    try {
      const response = await fetch(`${API_BASE_URL}/${deletingJob.id}`, {
        method: 'DELETE',
      });

      if (response.status === 204) {
        // Success - remove from local state
        setJobs(jobs.filter(job => job.id !== deletingJob.id));
        closeDeleteModal();
      } else if (response.status === 404) {
        alert('Job not found');
        closeDeleteModal();
      } else {
        alert('Failed to delete job');
      }
    } catch (err) {
      alert('Error deleting job');
    }
  };

  // Open edit modal
  const handleEditClick = (job: Job) => {
    setEditingJob({ ...job });
    setEditFormErrors({});
    setIsEditModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditingJob(null);
    setIsEditModalOpen(false);
    setEditFormErrors({});
  };

  // Validate edit form
  const validateEditForm = (job: Job) => {
    const errors: Partial<Record<keyof Job, string>> = {};
    if (!job.name.trim()) errors.name = 'Name is required';
    if (!job.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(job.email)) errors.email = 'Invalid email format';
    if (!job.phone.trim()) errors.phone = 'Phone is required';
    if (!job.designation.trim()) errors.designation = 'Designation is required';
    if (!job.state.trim()) errors.state = 'State is required';
    if (!job.district.trim()) errors.district = 'District is required';
    if (!job.address.trim()) errors.address = 'Address is required';
    if (!job.skills.trim()) errors.skills = 'Skills is required';
    return errors;
  };

  // Handle edit form input change
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingJob(prev => prev ? { ...prev, [name]: value } : null);
    // Clear error for this field
    if (editFormErrors[name as keyof Job]) {
      setEditFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Submit updated job
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob || !editingJob.id) return;

    const errors = validateEditForm(editingJob);
    if (Object.keys(errors).length > 0) {
      setEditFormErrors(errors);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${editingJob.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingJob),
      });

      if (response.status === 200) {
        const updatedJob = await response.json();
        // Update local state with the updated job
        setJobs(jobs.map(job => job.id === updatedJob.id ? updatedJob : job));
        closeEditModal();
      } else if (response.status === 404) {
        alert('Job not found');
      } else {
        alert('Failed to update job');
      }
    } catch (err) {
      alert('Error updating job');
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
        className="fixed inset-0 z-[50] bg-black/75 backdrop-blur-xl"
        style={{
          WebkitBackdropFilter: 'blur(12px)',
          backdropFilter: 'blur(12px)'
        }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[50] flex items-center justify-center p-4 pointer-events-none"
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
                              <button 
                                onClick={() => handleViewClick(job)}
                                className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                              >
                                View
                              </button>
                              <button 
                                onClick={() => handleEditClick(job)}
                                className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDeleteClick(job)}
                                className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
                              >
                                Delete
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

  // View Modal Content
  const viewModalContent = isViewModalOpen && viewingJob ? createPortal(
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-xl"
        style={{
          WebkitBackdropFilter: 'blur(12px)',
          backdropFilter: 'blur(12px)'
        }}
        onClick={closeViewModal}
      />
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
        onClick={closeViewModal}
      >
        <div
          className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8 border-b border-gray-200/50 bg-white/90 backdrop-blur-xl sticky top-0 z-10 flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Job Application Details
            </h2>
            <button
              onClick={closeViewModal}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200/50 hover:bg-gray-300 transition-all text-gray-700 hover:scale-105"
            >
              ✕
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Name</p>
                <p className="font-semibold text-gray-800">{viewingJob.name}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                <p className="font-semibold text-gray-800">{viewingJob.email}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                <p className="font-semibold text-gray-800">{viewingJob.phone}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Designation</p>
                <p className="font-semibold text-gray-800">{viewingJob.designation}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">State</p>
                <p className="font-semibold text-gray-800">{viewingJob.state}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">District</p>
                <p className="font-semibold text-gray-800">{viewingJob.district}</p>
              </div>
              <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Address</p>
                <p className="font-semibold text-gray-800">{viewingJob.address}</p>
              </div>
              <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Skills</p>
                <p className="font-semibold text-gray-800">{viewingJob.skills}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={closeViewModal}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => { closeViewModal(); handleEditClick(viewingJob); }}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  , document.body) : null;

  // Delete Confirmation Modal Content
  const deleteModalContent = isDeleteModalOpen && deletingJob ? createPortal(
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-xl"
        style={{
          WebkitBackdropFilter: 'blur(12px)',
          backdropFilter: 'blur(12px)'
        }}
        onClick={closeDeleteModal}
      />
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
        onClick={closeDeleteModal}
      >
        <div
          className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 max-w-md w-full pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Job Application?</h3>
            <p className="text-center text-gray-500 mb-6">
              Are you sure you want to delete the application for <strong className="text-gray-800">{deletingJob.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  , document.body) : null;

  // Edit Modal Content
  const editModalContent = isEditModalOpen && editingJob ? createPortal(
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-xl"
        style={{
          WebkitBackdropFilter: 'blur(12px)',
          backdropFilter: 'blur(12px)'
        }}
        onClick={closeEditModal}
      />
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
        onClick={closeEditModal}
      >
        <div
          className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8 border-b border-gray-200/50 bg-white/90 backdrop-blur-xl sticky top-0 z-10 flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Edit Job Application
            </h2>
            <button
              onClick={closeEditModal}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200/50 hover:bg-gray-300 transition-all text-gray-700 hover:scale-105"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleEditSubmit} className="p-6 sm:p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingJob.name}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${editFormErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {editFormErrors.name && <p className="text-red-500 text-xs mt-1">{editFormErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editingJob.email}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${editFormErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {editFormErrors.email && <p className="text-red-500 text-xs mt-1">{editFormErrors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={editingJob.phone}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${editFormErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                />
                {editFormErrors.phone && <p className="text-red-500 text-xs mt-1">{editFormErrors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={editingJob.designation}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${editFormErrors.designation ? 'border-red-500' : 'border-gray-300'}`}
                />
                {editFormErrors.designation && <p className="text-red-500 text-xs mt-1">{editFormErrors.designation}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={editingJob.state}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${editFormErrors.state ? 'border-red-500' : 'border-gray-300'}`}
                />
                {editFormErrors.state && <p className="text-red-500 text-xs mt-1">{editFormErrors.state}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input
                  type="text"
                  name="district"
                  value={editingJob.district}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${editFormErrors.district ? 'border-red-500' : 'border-gray-300'}`}
                />
                {editFormErrors.district && <p className="text-red-500 text-xs mt-1">{editFormErrors.district}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={editingJob.address}
                  onChange={handleEditInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${editFormErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                />
                {editFormErrors.address && <p className="text-red-500 text-xs mt-1">{editFormErrors.address}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={editingJob.skills}
                  onChange={handleEditInputChange}
                  placeholder="Comma separated skills"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${editFormErrors.skills ? 'border-red-500' : 'border-gray-300'}`}
                />
                {editFormErrors.skills && <p className="text-red-500 text-xs mt-1">{editFormErrors.skills}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={closeEditModal}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all"
              >
                Update Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  , document.body) : null;

  return (
    <>
      {createPortal(modalContent, document.body)}
      {viewModalContent}
      {deleteModalContent}
      {editModalContent}
    </>
  );
}
