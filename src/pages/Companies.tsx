import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { companiesAPI, interviewsAPI } from '../lib/api';
import { Building2, Search, Target, BookOpen, ChevronRight, Loader2, Code2, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Companies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => { loadCompanies(); }, []);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const { data } = await companiesAPI.list();
      setCompanies(data.data || []);
      if (data.data?.length > 0) setSelectedCompany(data.data[0]);
    } catch {
      setCompanies([]);
      setSelectedCompany(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyClick = async (name: string) => {
    try {
      const { data } = await companiesAPI.get(name);
      setSelectedCompany(data.data);
    } catch {
       toast.error('Failed to load company details.');
    }
  };

  const filtered = companies.filter(c => c.companyName.toLowerCase().includes(search.toLowerCase()));

  const generateMockKit = async () => {
    if (!selectedCompany) return;
    setGenerating(true);
    try {
      await interviewsAPI.getMockKit({ company: selectedCompany.companyName, difficulty: 'MEDIUM', problemCount: 3 });
      alert('Mock Kit generated! (Check console or redirect to mock interview)');
    } catch(err) {
      console.log(err);
      alert('Failed to generate Mock Kit');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-surface-50 dark:bg-surface-900">
      <div className="page-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold font-display">
            Company <span className="gradient-text">Prep Guides</span>
          </h1>
          <p className="text-zinc-500 mt-1">Curated interview guides, focus areas, and problem sets for top tech companies.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-1">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input type="text" placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="input-field !pl-9 !py-2.5 text-sm" />
            </div>
            
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-brand-500" /></div>
            ) : (
              <div className="space-y-2">
                {filtered.length === 0 ? <p className="text-sm text-zinc-500 text-center py-4">No companies found.</p> : filtered.map((c) => (
                  <button key={c.id} onClick={() => handleCompanyClick(c.companyName)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                      selectedCompany?.companyName === c.companyName 
                        ? 'bg-brand-600 text-white shadow-md' 
                        : 'bg-white dark:bg-surface-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700'
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedCompany?.companyName === c.companyName ? 'bg-white/20' : 'bg-brand-100 dark:bg-brand-900/30'}`}>
                        <Building2 className={`w-4 h-4 ${selectedCompany?.companyName === c.companyName ? 'text-white' : 'text-brand-600 dark:text-brand-400'}`} />
                      </div>
                      <span className="font-semibold">{c.companyName}</span>
                    </div>
                    {selectedCompany?.companyName === c.companyName && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selectedCompany ? (
                <motion.div key={selectedCompany.companyName} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="card p-8 mb-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                       <div>
                         <h2 className="text-3xl font-bold mb-2">{selectedCompany.companyName}</h2>
                         <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">{selectedCompany.description}</p>
                       </div>
                       <button onClick={generateMockKit} disabled={generating} className="btn-primary whitespace-nowrap flex items-center gap-2">
                          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Code2 className="w-4 h-4" />}
                          Start Mock Interview
                       </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                       <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                           <h3 className="font-semibold flex items-center gap-2 mb-4"><Target className="w-4 h-4 text-brand-500" /> Focus Areas</h3>
                           <div className="flex flex-wrap gap-2">
                             {selectedCompany.focusAreas?.map((area: string) => (
                               <span key={area} className="px-3 py-1 bg-white dark:bg-surface-800 border border-zinc-200 dark:border-zinc-700 rounded-full text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                 {area}
                               </span>
                             ))}
                           </div>
                       </div>
                       <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                           <h3 className="font-semibold flex items-center gap-2 mb-4"><Globe className="w-4 h-4 text-accent-500" /> Difficulty Distribution</h3>
                           <div className="space-y-3">
                              {Object.entries(selectedCompany.difficultyDistribution || {}).map(([diff, pct]: [string, any]) => (
                                <div key={diff}>
                                  <div className="flex justify-between text-xs font-medium mb-1">
                                    <span className={
                                      diff === 'EASY' ? 'text-emerald-500' : diff === 'MEDIUM' ? 'text-amber-500' : 'text-rose-500'
                                    }>{diff}</span>
                                    <span>{pct}%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                     <div className={`h-full ${diff === 'EASY' ? 'bg-emerald-500' : diff === 'MEDIUM' ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${pct}%` }} />
                                  </div>
                                </div>
                              ))}
                           </div>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="card">
                        <h3 className="text-lg font-bold mb-4">Interview Process</h3>
                        <div className="space-y-4">
                           {selectedCompany.interviewRounds?.map((round: any, i: number) => (
                             <div key={i} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-sm z-10 shrink-0">
                                    {round.round || i+1}
                                  </div>
                                  {i !== selectedCompany.interviewRounds?.length - 1 && (
                                    <div className="w-0.5 h-full bg-zinc-200 dark:bg-zinc-700 mt-2" />
                                  )}
                                </div>
                                <div className="pb-4">
                                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{round.name}</h4>
                                  <p className="text-sm text-zinc-500 mt-1">{round.description}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="card">
                        <h3 className="text-lg font-bold mb-4">Preparation Tips</h3>
                        <ul className="space-y-3">
                          {selectedCompany.tips?.map((tip: string, i: number) => (
                            <li key={i} className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                              <BookOpen className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{tip}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-8">
                             <Link to="/problems" className="w-full btn-secondary flex items-center justify-center gap-2">
                                <Search className="w-4 h-4" /> Browse {selectedCompany.companyName} Problems
                             </Link>
                        </div>
                     </div>
                  </div>
                </motion.div>
              ) : (
                 <div className="card py-20 flex flex-col items-center justify-center text-zinc-500">
                    <Building2 className="w-16 h-16 mb-4 text-zinc-300 dark:text-zinc-700" />
                    <p>Select a company to view the prep guide.</p>
                 </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
