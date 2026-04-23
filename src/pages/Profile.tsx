import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { usersAPI } from '../lib/api';
import toast from 'react-hot-toast';
import { User, Mail, Shield, Briefcase, Zap, Settings, Save, Loader2, Key } from 'lucide-react';

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [profileForm, setProfileForm] = useState({ fullName: '', experienceLevel: '' });
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
     if(user) {
        setProfileForm({ fullName: user.fullName || '', experienceLevel: user.experienceLevel || 'INTERMEDIATE' });
     }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await usersAPI.updateProfile(profileForm);
      setUser({ ...user!, ...profileForm });
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
     if(pwForm.newPassword.length < 8) return toast.error('Password must be at least 8 characters');
    setPwLoading(true);
    try {
      await usersAPI.changePassword(pwForm);
      toast.success('Password changed successfully');
      setPwForm({ oldPassword: '', newPassword: '' });
    } catch(err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  if(!user) return null;

  return (
    <div className="min-h-screen pt-20 pb-12 bg-surface-50 dark:bg-surface-900">
      <div className="page-container max-w-4xl">
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold font-display">Account <span className="gradient-text">Settings</span></h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {/* Sidebar */}
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-1 space-y-4">
              <div className="card text-center p-6 bg-gradient-to-b from-brand-50 to-white dark:from-brand-950/20 dark:to-surface-800">
                 <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-400 to-accent-500 mx-auto flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-brand-500/20 mb-4">
                    {user.fullName?.charAt(0) || 'U'}
                 </div>
                 <h2 className="text-xl font-bold">{user.fullName}</h2>
                 <p className="text-sm text-zinc-500">@{user.username}</p>
                 <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-full text-xs font-semibold">
                    <Shield className="w-3.5 h-3.5" /> {user.role}
                 </div>
              </div>
           </motion.div>

           {/* Main Settings */}
           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="md:col-span-2 space-y-6">
              
              {/* Profile Details */}
              <div className="card">
                 <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><User className="w-5 h-5 text-brand-500" /> Public Profile</h3>
                 <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div>
                          <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">Full Name</label>
                          <div className="relative">
                             <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                             <input type="text" value={profileForm.fullName} onChange={e => setProfileForm({...profileForm, fullName: e.target.value})} className="input-field !pl-10" />
                          </div>
                       </div>
                       <div>
                          <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">Email Address</label>
                          <div className="relative">
                             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                             <input type="email" value={user.email} disabled className="input-field !pl-10 bg-zinc-50 dark:bg-zinc-800/50 opacity-70 cursor-not-allowed" />
                          </div>
                       </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">Experience Level</label>
                        <div className="relative">
                           <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                           <select value={profileForm.experienceLevel} onChange={e => setProfileForm({...profileForm, experienceLevel: e.target.value})} className="input-field !pl-10">
                              <option value="BEGINNER">Beginner (0-1 years)</option>
                              <option value="INTERMEDIATE">Intermediate (1-3 years)</option>
                              <option value="ADVANCED">Advanced (3-5 years)</option>
                              <option value="EXPERT">Expert (5+ years)</option>
                           </select>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end">
                       <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Save Changes
                       </button>
                    </div>
                 </form>
              </div>

              {/* Security */}
              <div className="card">
                 <h3 className="text-lg font-semibold mb-6 flex items-center gap-2"><Shield className="w-5 h-5 text-accent-500" /> Security</h3>
                 <form onSubmit={handleChangePassword} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">Current Password</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input type="password" value={pwForm.oldPassword} onChange={e => setPwForm({...pwForm, oldPassword: e.target.value})} className="input-field !pl-10" required />
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-medium mb-1.5 text-zinc-700 dark:text-zinc-300">New Password</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input type="password" value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} className="input-field !pl-10" required minLength={8} />
                        </div>
                     </div>
                     <div className="pt-4 flex justify-end">
                       <button type="submit" disabled={pwLoading} className="btn-secondary flex items-center gap-2 border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/30">
                          {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
                          Update Password
                       </button>
                    </div>
                 </form>
              </div>

           </motion.div>
        </div>
      </div>
    </div>
  );
}
