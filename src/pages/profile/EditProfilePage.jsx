import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Camera,
  Save,
  Globe,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    language: 'en',
  });

  /* ---------------- Fetch Profile ---------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        const data = res.data?.data;

        setFormData({
          full_name: data?.full_name || '',
          email: data?.email || '',
          phone: data?.phone || '',
          language: data?.language || 'en',
        });
      } catch (err) {
        console.error(err);
        toast.error('Failed to load profile');
      }
    };

    fetchProfile();
  }, []);

  /* ---------------- Handlers ---------------- */
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.patch('/auth/profile', {
        full_name: formData.full_name,
        phone: formData.phone,
        language: formData.language,
      });

      updateUser(res.data.data);
      toast.success('Profile updated successfully');

      setTimeout(() => navigate('/profile'), 1200);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Language Options ---------------- */
  const languages = [
    { code: 'en', label: '🇬🇧 English' },
    { code: 'ar', label: '🇸🇦 العربية' },
    { code: 'es', label: '🇪🇸 Español' },
    { code: 'it', label: '🇮🇹 Italiano' },
    { code: 'ru', label: '🇷🇺 Русский' },
  ];

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 mb-4 rounded-lg hover:bg-white/20"
          >
            <ArrowLeft />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <User />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Edit Profile</h1>
              <p className="text-sm text-white/80">
                Update your personal information
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
        {/* Profile Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow"
        >
          <h3 className="font-bold mb-4">Profile Picture</h3>

          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-indigo-500 flex items-center justify-center text-white text-3xl overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  (formData.full_name || user?.full_name || 'U')[0]
                )}
              </div>

              <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer">
                <Camera size={16} className="text-white" />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <p className="text-sm text-gray-500">
              JPG, PNG or GIF (max 5MB)
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <User size={16} /> Full Name
              </label>
              <input
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Mail size={16} /> Email
              </label>
              <input
                value={formData.email}
                disabled
                className="input bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Phone size={16} /> Phone
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input"
              />
            </div>

            {/* Language */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <Globe size={16} /> Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="input"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (
                <>
                  <Save size={18} /> Save Changes
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfilePage;
