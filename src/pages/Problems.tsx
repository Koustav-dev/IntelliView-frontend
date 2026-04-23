import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { problemsAPI } from '../lib/api';
import { getDifficultyBadge, cn } from '../lib/utils';
import {
  Search, Filter, Code2, CheckCircle2, ChevronLeft, ChevronRight,
  Tag, Building2, Loader2,
} from 'lucide-react';

export default function Problems() {
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { loadProblems(); }, [page, difficulty]);

  const loadProblems = async () => {
    setLoading(true);
    try {
      const params: any = { page, size: 20 };
      if (difficulty) params.difficulty = difficulty;
      if (search) params.search = search;
      const { data } = await problemsAPI.list(params);
      setProblems(data.data.content || []);
      setTotalPages(data.data.totalPages || 1);
    } catch {
      setProblems([]);
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

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input type="text" placeholder="Search problems..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-11" />
          </form>
          <div className="flex gap-2">
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

            {problems.length === 0 ? <p className="text-center py-10 text-zinc-500">No problems found.</p> : problems.map((problem, i) => (
              <motion.div key={problem.id || i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}>
                <Link to={`/problems/${problem.slug || problem.id}`}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 rounded-xl hover:bg-white dark:hover:bg-surface-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 hover:shadow-sm transition-all items-center group">
                  <div className="col-span-1 hidden md:flex">
                    {problem.solved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-zinc-300 dark:border-zinc-600" />
                    )}
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
                    <span className="text-sm text-zinc-500">{problem.acceptanceRate?.toFixed(1) || '50.0'}%</span>
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
