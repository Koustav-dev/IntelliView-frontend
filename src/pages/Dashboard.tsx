import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { usersAPI } from '../lib/api';
import { formatDate } from '../lib/utils';
import {
  BarChart3, Code2, Trophy, Flame, TrendingUp,
  Clock, Target, Brain, ChevronRight, Activity,
  Zap, BookOpen, ArrowUpRight, Loader2,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';

const COLORS = ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await usersAPI.getStats();
      setStats(data.data);
    } catch (err) {
      console.error("Failed to load stats", err);
      setStats({
        totalProblemsSolved: 0, totalInterviews: 0, streakCount: 0,
        avgInterviewScore: 0, avgCodeQuality: 0, avgBehavioralScore: 0,
        weeklyProgress: [], languageStats: {}, recentSubmissions: [], recentSessions: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  const s = stats || {};

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="page-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-display">
                Welcome back, <span className="gradient-text">{user?.fullName?.split(' ')[0] || 'Developer'}</span>
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">Here's your interview prep progress</p>
            </div>
            <div className="flex gap-3">
              <Link to="/problems" className="btn-primary text-sm flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Practice Now
              </Link>
              <Link to="/behavioral" className="btn-secondary text-sm flex items-center gap-2">
                <Brain className="w-4 h-4" /> Behavioral
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Problems Solved', value: s.totalProblemsSolved || 0, icon: Code2, color: 'from-brand-500 to-brand-600', change: 'Lifetime' },
            { label: 'Interviews Done', value: s.totalInterviews || 0, icon: Target, color: 'from-accent-500 to-accent-600', change: 'Lifetime' },
            { label: 'Day Streak', value: s.streakCount || 0, icon: Flame, color: 'from-orange-500 to-red-500', change: 'Keep it up!' },
            { label: 'Avg Score', value: `${Math.round(s.avgInterviewScore || 0)}%`, icon: TrendingUp, color: 'from-emerald-500 to-teal-500', change: 'Overall' },
          ].map((stat, i) => (
            <motion.div key={stat.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card group hover:-translate-y-1 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-brand-500 transition-colors" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{stat.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Progress Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="card lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold flex items-center gap-2"><Activity className="w-4 h-4 text-brand-500" /> Weekly Progress</h3>
              <span className="text-xs text-zinc-500">Last 7 days</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={s.weeklyProgress || []}>
                  <defs>
                    <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a33" />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #27272a', background: '#18181b', color: '#fff', fontSize: '13px' }} />
                  <Area type="monotone" dataKey="problemsSolved" stroke="#6366f1" fill="url(#colorProblems)" strokeWidth={2.5} name="Problems" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Language Distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="card">
            <h3 className="font-semibold mb-6 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-accent-500" /> Languages</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={Object.entries(s.languageStats || {}).map(([name, value]) => ({ name, value: value as number }))} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                    dataKey="value" paddingAngle={4} strokeWidth={0}>
                    {Object.entries(s.languageStats || {}).map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #27272a', background: '#18181b', color: '#fff', fontSize: '13px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.entries(s.languageStats || {}).map(([name, value], i) => (
                <span key={name} className="flex items-center gap-1.5 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Submissions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-brand-500" /> Recent Submissions</h3>
              <Link to="/problems" className="text-xs text-brand-600 hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {(s.recentSubmissions || []).slice(0, 5).map((sub: any, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${sub.status === 'ACCEPTED' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <div>
                      <p className="text-sm font-medium">{sub.problemTitle}</p>
                      <p className="text-xs text-zinc-500">{sub.language}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold ${sub.status === 'ACCEPTED' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {sub.status}
                  </span>
                </div>
              ))}
              {(!s.recentSubmissions || s.recentSubmissions.length === 0) && (
                  <p className="text-sm text-zinc-500 py-4 text-center">No recent submissions found.</p>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="card">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { to: '/problems', label: 'Solve Problems', icon: Code2, desc: 'Practice DSA', color: 'bg-brand-50 dark:bg-brand-950/20 text-brand-600' },
                { to: '/behavioral', label: 'Behavioral Prep', icon: Brain, desc: 'STAR practice', color: 'bg-accent-50 dark:bg-accent-950/20 text-accent-600' },
                { to: '/ai-chat', label: 'AI Coach', icon: BookOpen, desc: 'Ask anything', color: 'bg-purple-50 dark:bg-purple-950/20 text-purple-600' },
                { to: '/companies', label: 'Company Prep', icon: Target, desc: 'Specific guides', color: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600' },
              ].map((action) => (
                <Link key={action.to} to={action.to}
                  className={`p-4 rounded-xl ${action.color} hover:shadow-md hover:-translate-y-0.5 transition-all group`}>
                  <action.icon className="w-6 h-6 mb-2" />
                  <p className="text-sm font-semibold">{action.label}</p>
                  <p className="text-xs opacity-70">{action.desc}</p>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
