"use client"
import { useState, FormEvent, ChangeEvent } from 'react';
import ListView from '../components/ListView';

interface JobFormData {
  name: string;
  email: string;
  phone: string;
  designation: string;
  state: string;
  district: string;
  address: string;
  skills: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function Home() {
  const [formData, setFormData] = useState<JobFormData>({
    name: '',
    email: '',
    phone: '',
    designation: '',
    state: '',
    district: '',
    address: '',
    skills: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone must be 10 digits';
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.skills.trim()) newErrors.skills = 'Skills is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5063/api/job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Job application submitted successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          designation: '',
          state: '',
          district: '',
          address: '',
          skills: '',
        });
      } else {
        setMessage('Submission failed. Please try again.');
      }
    } catch (error) {
      setMessage('Network error. Please check backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as keyof JobFormData]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-3xl shadow-xl md:shadow-2xl p-6 md:p-12 transition-all duration-500 hover:shadow-2xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Job Application
            </h1>
            <p className="text-xl text-gray-700 max-w-lg mx-auto leading-relaxed">
              Join our team by filling out this form.excited to hear from talented individuals like you!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-end mb-8">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg flex items-center"
              >
                View List
              </button>
            </div>
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-blue-900 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 shadow-sm ${errors.name ? 'border-red-400 ring-red-200' : ''}`}
                  placeholder="Enter your full name"
                  disabled={loading}
                />
                {errors.name && <p className="mt-2 text-sm text-red-600 font-medium">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-blue-900 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 shadow-sm ${errors.email ? 'border-red-400 ring-red-200' : ''}`}
                  placeholder="your@email.com"
                  disabled={loading}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600 font-medium">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-blue-900 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 shadow-sm ${errors.phone ? 'border-red-400 ring-red-200' : ''}`}
                  placeholder="10-digit phone number"
                  
                />
                {errors.phone && <p className="mt-2 text-sm text-red-600 font-medium">{errors.phone}</p>}
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label htmlFor="designation" className="block text-sm font-semibold text-blue-900 mb-2">
                  Designation <span className="text-red-500">*</span>
                </label>
                <input
                  id="designation"
                  name="designation"
                  type="text"
                  value={formData.designation}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 shadow-sm ${errors.designation ? 'border-red-400 ring-red-200' : ''}`}
                  placeholder="e.g., Software Engineer"
                  disabled={loading}
                />
                {errors.designation && <p className="mt-2 text-sm text-red-600 font-medium">{errors.designation}</p>}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-semibold text-blue-900 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 shadow-sm ${errors.state ? 'border-red-400 ring-red-200' : ''}`}
                  placeholder="e.g., Karnataka"
                  disabled={loading}
                />
                {errors.state && <p className="mt-2 text-sm text-red-600 font-medium">{errors.state}</p>}
              </div>

              <div>
                <label htmlFor="district" className="block text-sm font-semibold text-blue-900 mb-2">
                  District <span className="text-red-500">*</span>
                </label>
                <input
                  id="district"
                  name="district"
                  type="text"  
                  value={formData.district}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 shadow-sm ${errors.district ? 'border-red-400 ring-red-200' : ''}`}
                  placeholder="e.g., Bangalore Urban"
                  disabled={loading}
                />
                {errors.district && <p className="mt-2 text-sm text-red-600 font-medium">{errors.district}</p>}
              </div>
            </div>

            {/* Address & Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-blue-900 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={4}
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 resize-vertical shadow-sm ${errors.address ? 'border-red-400 ring-red-200' : ''}`}
                  placeholder="Enter your complete address"
                  disabled={loading}
                />
                {errors.address && <p className="mt-2 text-sm text-red-600 font-medium">{errors.address}</p>}
              </div>

              <div>
                <label htmlFor="skills" className="block text-sm font-semibold text-blue-900 mb-2">
                  Skills <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="skills"
                  name="skills"
                  rows={4}
                  value={formData.skills}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 resize-vertical shadow-sm ${errors.skills ? 'border-red-400 ring-red-200' : ''}`}
                  placeholder="List your key skills (comma-separated)"
                  disabled={loading}
                />
                {errors.skills && <p className="mt-2 text-sm text-red-600 font-medium">{errors.skills}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-lg flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>

          {/* Message */}
          {message && (
            <div className={`mt-8 p-6 rounded-2xl text-center transition-all duration-500 transform shadow-lg ${message.includes('successfully') ? 'bg-green-100 border-4 border-green-200 text-green-800' : 'bg-red-100 border-4 border-red-200 text-red-800'}`}>
              <div className="text-2xl font-bold mb-2">{message.includes('successfully') ? '' : ''}</div>
              <p className="text-lg font-semibold">{message}</p>
            </div>
          )}
          {isModalOpen && (
            <ListView isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          )}
        </div>
      </div>
    </div>
  );
}

