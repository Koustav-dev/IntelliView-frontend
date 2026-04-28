import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { problemsAPI, submissionsAPI } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { getDifficultyBadge, cn, LANGUAGES } from '../lib/utils';
import {
  Play, Send, Lightbulb, RotateCcw, CheckCircle2, XCircle,
  Clock, Cpu, Loader2, ChevronDown, Sparkles, BookOpen,
  AlertTriangle, Terminal, Eye, EyeOff, Maximize2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProblemEditor() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [problem, setProblem] = useState<any>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [hint, setHint] = useState('');
  const [hintLevel, setHintLevel] = useState(1);
  const [tab, setTab] = useState<'description' | 'submissions' | 'ai-review'>('description');
  const [showDesc, setShowDesc] = useState(true);
  const [explainLoading, setExplainLoading] = useState(false);
  const [explanation, setExplanation] = useState('');

  useEffect(() => { loadProblem(); }, [slug]);

  const loadProblem = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const { data } = await problemsAPI.get(slug);
      setProblem(data.data);
      if (data.data?.solutionTemplate?.[language]) {
        setCode(data.data.solutionTemplate[language]);
      }
    } catch (err) {
      toast.error('Problem not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (problem?.solutionTemplate?.[language]) {
      setCode(problem.solutionTemplate[language]);
    } else {
      setCode(getDefaultTemplate(language));
    }
  }, [language]);

  const handleSubmit = async () => {
    if (!code.trim()) return toast.error('Write some code first!');
    if (!accessToken) {
      toast.error('Please log in to submit code');
      navigate('/login');
      return;
    }
    setSubmitting(true);
    setTab('ai-review');
    try {
      const { data } = await submissionsAPI.submit({
        problemId: problem.id,
        language,
        code,
      });
      setResult(data.data);
      if (data.data.status === 'ACCEPTED') toast.success('All test cases passed! 🎉');
      else toast.error(`${data.data.status.replace(/_/g, ' ')}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Submission failed — check your code and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHint = async () => {
    setHintLoading(true);
    try {
      const { data } = await submissionsAPI.getHint({
        problemId: problem.id,
        code,
        language,
        hintLevel,
      });
      setHint(data.data);
      setHintLevel(Math.min(3, hintLevel + 1));
    } catch {
      setHint('Hint generation failed. Please try again.');
    } finally {
      setHintLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!code.trim()) return;
    setExplainLoading(true);
    try {
      const { data } = await submissionsAPI.explainSolution({
        problemId: problem.id,
        code,
        language,
      });
      setExplanation(data.data);
    } catch {
      setExplanation('Failed to generate explanation.');
    } finally {
      setExplainLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center pt-16"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>;
  }

  if (!problem) {
      return (
          <div className="min-h-screen flex items-center justify-center pt-16 flex-col text-center">
              <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Problem Not Found</h2>
              <p className="text-zinc-500">The problem you are looking for does not exist or could not be loaded.</p>
          </div>
      );
  }

  const p = problem;

  return (
    <div className="min-h-screen pt-16">
      <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
        {/* Left Panel — Description */}
        <div className={cn('lg:w-[45%] flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface-900 overflow-hidden',
          !showDesc && 'hidden lg:flex lg:w-0')}>
          {/* Tabs */}
          <div className="flex items-center gap-0 border-b border-zinc-200 dark:border-zinc-800 px-4 bg-zinc-50 dark:bg-surface-850">
            {(['description', 'submissions', 'ai-review'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={cn('px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize',
                  tab === t ? 'border-brand-500 text-brand-600' : 'border-transparent text-zinc-500 hover:text-zinc-700')}>
                {t === 'ai-review' ? 'AI Review' : t}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {tab === 'description' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-xl font-bold">{p.title}</h1>
                  <span className={getDifficultyBadge(p.difficulty)}>{p.difficulty}</span>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
                  <div className="whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{p.description}</div>
                </div>
                {/* Examples */}
                {p.examples?.map((ex: any, i: number) => (
                  <div key={i} className="mb-4 p-4 rounded-xl bg-zinc-50 dark:bg-surface-800 border border-zinc-100 dark:border-zinc-700">
                    <p className="text-xs font-semibold text-zinc-500 mb-2">Example {i + 1}</p>
                    <p className="text-sm font-mono"><strong>Input:</strong> {ex.input}</p>
                    <p className="text-sm font-mono"><strong>Output:</strong> {ex.output}</p>
                    {ex.explanation && <p className="text-sm text-zinc-500 mt-1"><strong>Explanation:</strong> {ex.explanation}</p>}
                  </div>
                ))}
                {/* Constraints */}
                {p.constraints && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold mb-2">Constraints:</h3>
                    <pre className="text-xs text-zinc-500 whitespace-pre-wrap">{p.constraints}</pre>
                  </div>
                )}
                {/* Tags */}
                {p.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {p.tags.map((tag: string) => (
                      <span key={tag} className="px-2.5 py-1 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">{tag}</span>
                    ))}
                  </div>
                )}
                {/* Hint */}
                {hint && (
                  <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30">
                    <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4" /> Hint (Level {hintLevel - 1})
                    </p>
                    <p className="text-sm text-amber-800 dark:text-amber-300">{hint}</p>
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'ai-review' && result && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {/* Status */}
                <div className={cn('p-4 rounded-xl border flex items-center gap-3',
                  result.status === 'ACCEPTED' ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/30' : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/30')}>
                  {result.status === 'ACCEPTED' ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-rose-500" />}
                  <div>
                    <p className="font-semibold">{result.status?.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-zinc-500">{result.testCasesPassed}/{result.totalTestCases} test cases passed</p>
                  </div>
                </div>
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                    <Clock className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                    <p className="text-sm font-semibold">{result.runtimeMs}ms</p>
                    <p className="text-xs text-zinc-500">Runtime</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                    <Cpu className="w-4 h-4 mx-auto mb-1 text-purple-500" />
                    <p className="text-sm font-semibold">{result.timeComplexityDetected || 'O(n)'}</p>
                    <p className="text-xs text-zinc-500">Time</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                    <Sparkles className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                    <p className="text-sm font-semibold">{result.codeQualityScore || 85}/100</p>
                    <p className="text-xs text-zinc-500">Quality</p>
                  </div>
                </div>
                {/* AI Review Content */}
                {result.aiCodeReview && (
                  <div className="space-y-3">
                    {Object.entries(result.aiCodeReview).map(([key, val]) => {
                      if (key === 'codeQualityScore' || key === 'timeComplexity' || key === 'spaceComplexity') return null;
                      return (
                        <div key={key} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                          <p className="text-xs font-semibold text-zinc-500 uppercase mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300">
                            {Array.isArray(val) ? (val as string[]).join(', ') : String(val)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* Explanation */}
                {explanation && (
                  <div className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-800/30">
                    <p className="text-sm font-semibold text-brand-700 dark:text-brand-400 mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Solution Explanation
                    </p>
                    <p className="text-sm text-brand-800 dark:text-brand-300 whitespace-pre-wrap">{explanation}</p>
                  </div>
                )}
              </motion.div>
            )}

            {tab === 'ai-review' && !result && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Terminal className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mb-4" />
                <p className="text-zinc-500">Submit your code to see AI review</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel — Editor */}
        <div className="flex-1 flex flex-col bg-surface-50 dark:bg-surface-900">
          {/* Editor toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface-850">
            <div className="flex items-center gap-3">
              <select value={language} onChange={(e) => setLanguage(e.target.value)}
                className="text-sm font-medium bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-brand-500/40">
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>{l.icon} {l.label}</option>
                ))}
              </select>
              <button onClick={() => { if (problem?.solutionTemplate?.[language]) setCode(problem.solutionTemplate[language]); }}
                className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600" title="Reset code">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleHint} disabled={hintLoading}
                className="btn-ghost text-xs flex items-center gap-1.5 text-amber-600">
                {hintLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lightbulb className="w-3.5 h-3.5" />}
                Hint
              </button>
              <button onClick={handleExplain} disabled={explainLoading}
                className="btn-ghost text-xs flex items-center gap-1.5 text-brand-600">
                {explainLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <BookOpen className="w-3.5 h-3.5" />}
                Explain
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                className="btn-primary text-xs !px-4 !py-2 flex items-center gap-1.5">
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                {submitting ? 'Running...' : 'Submit'}
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={(val) => setCode(val || '')}
              theme={document.documentElement.classList.contains('dark') ? 'vs-dark' : 'light'}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                smoothScrolling: true,
                cursorBlinking: 'smooth',
                bracketPairColorization: { enabled: true },
                formatOnPaste: true,
                wordWrap: 'on',
              }}
            />
          </div>

          {/* Output bar */}
          {result?.output && (
            <div className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-surface-850 p-4 max-h-40 overflow-y-auto">
              <p className="text-xs font-semibold text-zinc-500 mb-2 flex items-center gap-1"><Terminal className="w-3 h-3" /> Output</p>
              <pre className="text-xs font-mono text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{result.output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getDefaultTemplate(lang: string) {
  const templates: Record<string, string> = {
    java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        \n    }\n}',
    python: 'class Solution:\n    def twoSum(self, nums, target):\n        # Write your solution here\n        pass',
    javascript: 'var twoSum = function(nums, target) {\n    // Write your solution here\n    \n};',
    cpp: 'class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        \n    }\n};',
    typescript: 'function twoSum(nums: number[], target: number): number[] {\n    // Write your solution here\n    \n}',
  };
  return templates[lang] || '// Write your solution here\n';
}
