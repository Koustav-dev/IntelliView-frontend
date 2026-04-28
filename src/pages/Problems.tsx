import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { problemsAPI } from '../lib/api';
import { getDifficultyBadge, cn } from '../lib/utils';
import {
  Search, Code2, CheckCircle2, ChevronLeft, ChevronRight,
  Tag, Loader2, AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Demo problems shown when backend is unavailable
const DEMO_PROBLEMS = [
  { id: '1', title: 'Two Sum', slug: 'two-sum', difficulty: 'EASY', category: 'Arrays & Hashing', acceptanceRate: 49.5, solved: false },
  { id: '2', title: 'Valid Parentheses', slug: 'valid-parentheses', difficulty: 'EASY', category: 'Stack', acceptanceRate: 40.2, solved: false },
  { id: '3', title: 'Reverse Linked List', slug: 'reverse-linked-list', difficulty: 'EASY', category: 'Linked List', acceptanceRate: 73.5, solved: false },
  { id: '4', title: 'Binary Search', slug: 'binary-search', difficulty: 'EASY', category: 'Binary Search', acceptanceRate: 56.2, solved: false },
  { id: '5', title: 'Longest Common Subsequence', slug: 'longest-common-subsequence', difficulty: 'MEDIUM', category: 'Dynamic Programming', acceptanceRate: 57.1, solved: false },
  { id: '6', title: 'LRU Cache', slug: 'lru-cache', difficulty: 'MEDIUM', category: 'Design', acceptanceRate: 41.5, solved: false },
  { id: '7', title: 'Median of Two Sorted Arrays', slug: 'median-of-two-sorted-arrays', difficulty: 'HARD', category: 'Binary Search', acceptanceRate: 36.8, solved: false },
];

export default function Problems() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [apiError, setApiError] = useState(false);

  useEffect(() => { loadProblems(); }, [page, difficulty]);

  const loadProblems = async () => {
    setLoading(true);
    setApiError(false);
    try {
      const params: any = { page, size: 20 };
      if (difficulty) params.difficulty = difficulty;
      if (search) params.search = search;
      const { data } = await problemsAPI.list(params);
      const content = data.data?.content || data.data || [];
      setProblems(Array.isArray(content) ? content : []);
      setTotalPages(data.data?.totalPages || 1);
    } catch (err: any) {
      console.error('Problems API error:', err);
      setApiError(true);
      // Show demo data so page is never completely empty
      let filtered = DEMO_PROBLEMS;
      if (difficulty) filtered = DEMO_PROBLEMS.filter(p => p.difficulty === difficulty);
      setProblems(filtered);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    loadProblems();
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="page-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold font-display">
            Coding <span className="gradient-text">Problems</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Practice and master your DSA skills</p>
        </motion.div>

        {/* API error banner */}
        {apiError && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Backend is offline — showing demo problems. Start the backend to see live data.
          </motion.div>
        )}

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input type="text" placeholder="Search problems..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-11" />
          </form>
          <div className="flex gap-2 flex-wrap">
            {['', 'EASY', 'MEDIUM', 'HARD'].map((d) => (
              <button key={d} onClick={() => { setDifficulty(d); setPage(0); }}
                className={cn(
                  'px-4 py-2.5 rounded-xl text-sm font-medium transition-all border',
                  difficulty === d
                    ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-600/20'
                    : 'bg-white dark:bg-surface-800 border-zinc-200 dark:border-zinc-700 hover:border-brand-300'
                )}>
                {d || 'All'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Problem List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="space-y-2">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <div className="col-span-1">Status</div>
              <div className="col-span-5">Title</div>
              <div className="col-span-2">Difficulty</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Acceptance</div>
            </div>

            {problems.length === 0 ? (
              <div className="text-center py-16 text-zinc-500">
                <Code2 className="w-12 h-12 mx-auto mb-3 text-zinc-300 dark:text-zinc-700" />
                <p>No problems found. Try a different filter.</p>
              </div>
            ) : problems.map((problem, i) => (
              <motion.div key={problem.id || i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}>
                <Link to={`/problems/${problem.slug || problem.id}`}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 rounded-xl hover:bg-white dark:hover:bg-surface-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 hover:shadow-sm transition-all items-center group">
                  <div className="col-span-1 hidden md:flex">
                    {problem.solved
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      : <div className="w-5 h-5 rounded-full border-2 border-zinc-300 dark:border-zinc-600" />
                    }
                  </div>
                  <div className="col-span-5 flex items-center gap-3">
                    <Code2 className="w-4 h-4 text-zinc-400 hidden sm:block" />
                    <span className="font-medium group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {problem.title}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className={getDifficultyBadge(problem.difficulty)}>{problem.difficulty}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {problem.category || 'General'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-zinc-500">{problem.acceptanceRate?.toFixed?.(1) || problem.acceptanceRate || '50.0'}%</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}
              className="btn-ghost flex items-center gap-1 disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <span className="text-sm text-zinc-500">Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}
              className="btn-ghost flex items-center gap-1 disabled:opacity-30">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
