import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usersAPI } from '../lib/api';
import { Trophy, Medal, Flame, Code2, Target, Loader2 } from 'lucide-react';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('ALL_TIME');

  useEffect(() => { loadLeaderboard(); }, [period]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const { data } = await usersAPI.getLeaderboard(period);
      if (data.data?.length > 0) {
        setLeaders(data.data);
      } else {
        setLeaders(getDemoLeaderboard());
      }
    } catch {
      setLeaders(getDemoLeaderboard());
    } finally {
      setLoading(false);
    }
  };

  function getDemoLeaderboard() {
    return [
      { id: 1, fullName: 'Alex Chen', experienceLevel: 'Senior', totalProblemsSolved: 342, totalInterviews: 15, streakCount: 42, score: 3420 },
      { id: 2, fullName: 'Sarah Jenkins', experienceLevel: 'Mid-Level', totalProblemsSolved: 285, totalInterviews: 12, streakCount: 28, score: 2850 },
      { id: 3, fullName: 'David Kumar', experienceLevel: 'Senior', totalProblemsSolved: 256, totalInterviews: 18, streakCount: 15, score: 2560 },
      { id: 4, fullName: 'Emily Wang', experienceLevel: 'Junior', totalProblemsSolved: 198, totalInterviews: 8, streakCount: 12, score: 1980 },
      { id: 5, fullName: 'Michael Ross', experienceLevel: 'Mid-Level', totalProblemsSolved: 175, totalInterviews: 10, streakCount: 5, score: 1750 },
    ];
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-surface-50 dark:bg-surface-900">
      <div className="page-container max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-orange-500/20 mb-6 rotate-3">
             <Trophy className="w-8 h-8 text-white -rotate-3" />
          </div>
          <h1 className="text-4xl font-extrabold font-display">Global <span className="gradient-text">Leaderboard</span></h1>
          <p className="text-zinc-500 mt-2">See how you rank against other developers on IntelliView.</p>
        </motion.div>

        {/* Filters */}
        <div className="flex justify-center mb-8">
           <div className="bg-white dark:bg-surface-800 p-1 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 inline-flex">
             {['ALL_TIME', 'WEEKLY', 'MONTHLY'].map(p => (
               <button key={p} onClick={() => setPeriod(p)}
                 className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${period === p ? 'bg-brand-600 text-white shadow-md' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}>
                 {p.replace('_', ' ')}
               </button>
             ))}
           </div>
        </div>

        {/* Top 3 Podiums */}
        {!loading && leaders.length >= 3 && (
           <div className="flex items-end justify-center gap-4 sm:gap-8 mt-16 mb-12">
              {/* Second Place */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col items-center">
                 <div className="w-14 h-14 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xl font-bold mb-2 shadow-lg">{leaders[1]?.fullName?.charAt(0) || '2'}</div>
                 <span className="font-semibold text-sm max-w-[100px] truncate">{leaders[1]?.fullName}</span>
                 <div className="w-24 h-32 bg-gradient-to-t from-zinc-300/50 to-zinc-200/50 dark:from-zinc-800 dark:to-zinc-700 rounded-t-xl mt-4 flex justify-center pt-4">
                    <span className="text-3xl font-black text-zinc-400">2</span>
                 </div>
              </motion.div>
              {/* First Place */}
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col items-center">
                 <Medal className="w-8 h-8 text-amber-500 mb-2 drop-shadow-md" />
                 <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 p-1 mb-2 shadow-xl shadow-amber-500/20">
                    <div className="w-full h-full bg-white dark:bg-surface-800 rounded-full flex items-center justify-center text-2xl font-bold">
                       {leaders[0]?.fullName?.charAt(0) || '1'}
                    </div>
                 </div>
                 <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">{leaders[0]?.fullName}</span>
                 <span className="text-xs font-semibold text-amber-600 mt-1">{leaders[0]?.score || leaders[0]?.totalProblemsSolved} pts</span>
                 <div className="w-28 h-40 bg-gradient-to-t from-amber-500/20 to-amber-400/20 border border-amber-200/50 dark:border-amber-500/30 rounded-t-2xl mt-4 flex justify-center pt-4 shadow-[inset_0_4px_20px_rgba(251,191,36,0.3)]">
                    <span className="text-5xl font-black text-amber-500 drop-shadow-sm">1</span>
                 </div>
              </motion.div>
              {/* Third Place */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col items-center">
                 <div className="w-14 h-14 rounded-full bg-orange-200 dark:bg-orange-900/50 flex items-center justify-center text-xl font-bold text-orange-700 dark:text-orange-400 mb-2 shadow-lg">{leaders[2]?.fullName?.charAt(0) || '3'}</div>
                 <span className="font-semibold text-sm max-w-[100px] truncate">{leaders[2]?.fullName}</span>
                 <div className="w-24 h-24 bg-gradient-to-t from-orange-300/30 to-orange-200/30 dark:from-orange-900/40 dark:to-orange-800/40 rounded-t-xl mt-4 flex justify-center pt-4">
                    <span className="text-3xl font-black text-orange-600/50 dark:text-orange-500/50">3</span>
                 </div>
              </motion.div>
           </div>
        )}

        {/* List */}
        <div className="card overflow-hidden !p-0 mt-8">
          {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
          ) : (
             <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {leaders.length === 0 ? <p className="text-center py-10 text-zinc-500">No leaders found for this period.</p> : leaders.map((user, idx) => (
                  <motion.div key={user.id || idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 * idx }}
                     className="flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                     <div className="w-8 text-center font-bold text-zinc-400">{idx + 1}</div>
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                        {user.fullName?.charAt(0) || 'U'}
                     </div>
                     <div className="flex-1">
                        <p className="font-semibold">{user.fullName || user.username}</p>
                        <p className="text-xs text-zinc-500">{user.experienceLevel || 'Intermediate'}</p>
                     </div>
                     
                     <div className="hidden sm:flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
                        <div className="flex items-center gap-1.5 w-20 justify-end"><Code2 className="w-4 h-4" /> {user.totalProblemsSolved || 0}</div>
                        <div className="flex items-center gap-1.5 w-20 justify-end"><Target className="w-4 h-4" /> {user.totalInterviews || 0}</div>
                        <div className="flex items-center gap-1.5 w-20 justify-end text-orange-500 font-semibold"><Flame className="w-4 h-4" /> {user.streakCount || 0}</div>
                     </div>
                     <div className="text-right sm:ml-6">
                        <p className="font-bold text-lg">{user.score || (user.totalProblemsSolved * 10)}</p>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500">Score</p>
                     </div>
                  </motion.div>
                ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
