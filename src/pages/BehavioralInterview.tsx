import { useState } from 'react';
import { motion } from 'framer-motion';
import { interviewsAPI } from '../lib/api';
import {
  MessageSquare, Send, Loader2, Sparkles, CheckCircle2,
  Brain, Star, BarChart3, RefreshCcw, ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function BehavioralInterview() {
  const [question, setQuestion] = useState<any>(null);
  const [response, setResponse] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState('');
  const [company, setCompany] = useState('');

  const getQuestion = async () => {
    setLoading(true);
    setFeedback(null);
    setResponse('');
    try {
      const { data } = await interviewsAPI.getBehavioralQuestions({ company, category, count: 1 });
      if (data.data?.length > 0) setQuestion(data.data[0]);
      else throw new Error('No questions');
    } catch {
      toast.error('Could not load question.');
    } finally {
      setLoading(false);
    }
  };

  const generateAIQuestion = async () => {
    setLoading(true);
    setFeedback(null);
    setResponse('');
    try {
      const { data } = await interviewsAPI.generateQuestion({ company, category });
      setQuestion({ id: 'ai', question: data.data, category: category || 'General', companies: [company || 'General'] });
    } catch {
      toast.error('Failed to generate question with AI.');
    } finally {
      setLoading(false);
    }
  };

  const submitResponse = async () => {
    if (!response.trim() || !question) return toast.error('Write your response first!');
    setSubmitting(true);
    try {
      const { data } = await interviewsAPI.submitBehavioral({
        questionId: question.id,
        response: response,
      });
      setFeedback(data.data);
      toast.success('Response analyzed!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit response.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="page-container max-w-5xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold font-display">
            Behavioral <span className="gradient-text">Interview Prep</span>
          </h1>
          <p className="text-zinc-500 mt-1">Practice answering behavioral questions with AI-powered STAR analysis</p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-6">
          <select value={company} onChange={(e) => setCompany(e.target.value)} className="input-field !w-auto min-w-[160px]">
            <option value="">Any Company</option>
            {['Amazon', 'Google', 'Microsoft', 'Meta', 'TCS'].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field !w-auto min-w-[180px]">
            <option value="">Any Category</option>
            {['Teamwork & Conflict', 'Decision Making', 'Problem Solving', 'Leadership', 'Growth Mindset', 'Time Management', 'Communication'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button onClick={getQuestion} disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
            Get Question
          </button>
          <button onClick={generateAIQuestion} disabled={loading} className="btn-accent flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
            AI Generate
          </button>
        </motion.div>

        {/* Question */}
        {question && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="card mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950/30 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-brand-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/20 px-2 py-0.5 rounded-full">
                    {question.category || 'General'}
                  </span>
                  {question.companies?.map((c: string) => (
                    <span key={c} className="text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>
                <p className="text-lg font-medium leading-relaxed">{question.question}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Response area */}
        {question && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card mb-6">
            <label className="text-sm font-semibold mb-3 block">Your Response (use STAR method)</label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {['Situation', 'Task', 'Action', 'Result'].map((s) => (
                <div key={s} className="text-center p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                  <p className="text-xs font-semibold text-brand-600">{s.charAt(0)}</p>
                  <p className="text-[10px] text-zinc-500">{s}</p>
                </div>
              ))}
            </div>
            <textarea value={response} onChange={(e) => setResponse(e.target.value)}
              className="input-field min-h-[200px] resize-y font-mono text-sm"
              placeholder="Describe the Situation, your Task, the Action you took, and the Result you achieved..." />
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-zinc-500">{response.length} characters</p>
              <button onClick={submitResponse} disabled={submitting || !response.trim()}
                className="btn-primary flex items-center gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? 'Analyzing...' : 'Submit for AI Review'}
              </button>
            </div>
          </motion.div>
        )}

        {/* AI Feedback */}
        {feedback && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-6">
            {/* Scores */}
            <div className="card">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> AI Analysis Scores
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'STAR Method', score: feedback.starScore || 75, color: 'brand' },
                  { label: 'Clarity', score: feedback.clarityScore || 80, color: 'blue' },
                  { label: 'Relevance', score: feedback.relevanceScore || 85, color: 'emerald' },
                  { label: 'Overall', score: feedback.overallScore || 80, color: 'amber' },
                ].map(({ label, score, color }) => (
                  <div key={label} className="text-center p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="#27272a33" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'}
                          strokeWidth="3" strokeDasharray={`${score}, 100`} strokeLinecap="round" />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{score}</span>
                    </div>
                    <p className="text-xs font-medium text-zinc-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed feedback */}
            {feedback.detailedFeedback && (
              <div className="card">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-brand-500" /> Detailed Feedback
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">{feedback.detailedFeedback}</p>
              </div>
            )}

            {/* Strengths and Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {feedback.strengths?.length > 0 && (
                <div className="card border-l-4 border-l-emerald-500">
                  <h3 className="font-semibold mb-3 text-emerald-600 dark:text-emerald-400">✅ Strengths</h3>
                  <ul className="space-y-2">
                    {feedback.strengths.map((s: string, i: number) => (
                      <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {feedback.improvements?.length > 0 && (
                <div className="card border-l-4 border-l-amber-500">
                  <h3 className="font-semibold mb-3 text-amber-600 dark:text-amber-400">💡 Improvements</h3>
                  <ul className="space-y-2">
                    {feedback.improvements.map((s: string, i: number) => (
                      <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Try again */}
            <div className="text-center">
              <button onClick={() => { setFeedback(null); setResponse(''); setQuestion(null); }}
                className="btn-secondary flex items-center gap-2 mx-auto">
                <RefreshCcw className="w-4 h-4" /> Practice Another Question
              </button>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!question && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="card text-center py-16">
            <Brain className="w-16 h-16 mx-auto mb-4 text-zinc-300 dark:text-zinc-600" />
            <h3 className="text-xl font-semibold mb-2">Ready to practice?</h3>
            <p className="text-zinc-500 max-w-md mx-auto mb-6">
              Select a company and category, then click "Get Question" to start practicing behavioral interview questions with AI feedback.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
