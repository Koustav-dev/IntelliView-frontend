import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, Code2, MessageSquare, BarChart3, Building2, Trophy,
  Zap, Shield, Sparkles, ArrowRight, Star, ChevronRight,
  Users, BookOpen, Target, Rocket, CheckCircle2,
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function Landing() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[100vh] flex items-center pt-16 bg-hero-pattern dark:bg-hero-pattern">
        <div className="absolute inset-0 bg-grid opacity-50" />
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="page-container relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 dark:bg-brand-950/40 text-brand-700 dark:text-brand-400 text-sm font-medium mb-8 border border-brand-200 dark:border-brand-800/40">
                <Sparkles className="w-4 h-4" /> Powered by AI — Free to use
              </span>
            </motion.div>

            <motion.h1 {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight leading-[1.1] mb-6">
              Ace Your Next
              <br />
              <span className="gradient-text">Tech Interview</span>
            </motion.h1>

            <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
              Practice coding challenges, get instant AI feedback on your solutions, prepare for behavioral interviews, and track your improvement — all in one platform.
            </motion.p>

            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary text-base !px-8 !py-3.5 flex items-center gap-2 group">
                Start Practicing Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/problems" className="btn-secondary text-base !px-8 !py-3.5 flex items-center gap-2">
                <Code2 className="w-4 h-4" /> Browse Problems
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-8 sm:gap-16 mt-14">
              {[
                { value: '500+', label: 'Problems' },
                { value: 'AI', label: 'Code Review' },
                { value: '50+', label: 'Companies' },
                { value: 'Free', label: 'Forever' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-zinc-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Mock editor preview */}
          <motion.div {...fadeUp} transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 max-w-5xl mx-auto">
            <div className="glass-card p-1.5 rounded-2xl shadow-2xl shadow-brand-500/10">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200/50 dark:border-zinc-700/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-xs text-zinc-400 ml-3 font-mono">two-sum.java — IntelliView Editor</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200/50 dark:divide-zinc-700/50">
                <div className="p-6">
                  <pre className="text-sm font-mono text-zinc-700 dark:text-zinc-300 leading-relaxed">
{`class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`}</pre>
                </div>
                <div className="p-6 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">AI Analysis</span>
                  </div>
                  <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <p>⏱ <strong>Time:</strong> O(n) — Single pass hash map</p>
                    <p>💾 <strong>Space:</strong> O(n) — HashMap storage</p>
                    <p>⭐ <strong>Quality:</strong> 92/100</p>
                    <p className="mt-3 text-emerald-600 dark:text-emerald-400">✅ Excellent solution! Clean one-pass approach using complement lookup.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-surface-50 dark:bg-surface-900">
        <div className="page-container">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Features</span>
            <h2 className="section-heading mt-3">Everything You Need to <span className="gradient-text">Succeed</span></h2>
            <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
              From coding challenges to behavioral prep, our AI-powered platform covers every aspect of interview preparation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Code2, title: 'Live Code Editor', desc: 'Monaco-based editor with 8+ language support. Write, run, and test your code in real-time.', color: 'from-blue-500 to-cyan-500' },
              { icon: Brain, title: 'AI Code Review', desc: 'Instant AI analysis of your code — time/space complexity, quality score, and improvement tips.', color: 'from-brand-500 to-purple-500' },
              { icon: MessageSquare, title: 'Behavioral Prep', desc: 'Practice STAR-method responses. AI scores clarity, relevance, and structure of your answers.', color: 'from-amber-500 to-orange-500' },
              { icon: BarChart3, title: 'Progress Tracking', desc: 'Animated dashboard with charts. Track streaks, scores, and improvement across sessions.', color: 'from-emerald-500 to-teal-500' },
              { icon: Building2, title: 'Company Prep', desc: 'Detailed interview guides for Amazon, Google, Microsoft, Meta, TCS and more.', color: 'from-rose-500 to-pink-500' },
              { icon: Zap, title: 'AI Study Plans', desc: 'Personalized week-by-week study plans generated for your target company and level.', color: 'from-violet-500 to-fuchsia-500' },
            ].map((feature, i) => (
              <motion.div key={feature.title} {...stagger}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-7 group hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white dark:bg-surface-850">
        <div className="page-container">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-sm font-semibold text-accent-600 dark:text-accent-400 uppercase tracking-wider">How it works</span>
            <h2 className="section-heading mt-3">Three Steps to <span className="gradient-text">Interview Ready</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Choose Your Focus', desc: 'Pick a company, difficulty, or topic. Start a coding or behavioral session.', icon: Target },
              { step: '02', title: 'Practice with AI', desc: 'Solve problems, answer questions. Get real-time AI feedback and hints.', icon: Rocket },
              { step: '03', title: 'Track & Improve', desc: 'View your dashboard, track streaks, follow study plans, climb the leaderboard.', icon: Trophy },
            ].map((item, i) => (
              <motion.div key={item.step} {...stagger} transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-2xl bg-brand-100 dark:bg-brand-950/30 rotate-6" />
                  <div className="absolute inset-0 rounded-2xl bg-white dark:bg-surface-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                  </div>
                  <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-white text-sm font-bold flex items-center justify-center shadow-lg">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Companies */}
      <section className="py-24 bg-surface-50 dark:bg-surface-900">
        <div className="page-container">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="section-heading">Prepare for <span className="gradient-text">Top Companies</span></h2>
            <p className="mt-4 text-zinc-500 dark:text-zinc-400">Company-specific preparation guides and curated problem sets.</p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-6">
            {['Amazon', 'Google', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'TCS', 'Uber', 'Flipkart', 'Adobe'].map((company, i) => (
              <Link key={company} to={`/companies`}
                className="px-6 py-3 rounded-xl bg-white dark:bg-surface-800 border border-zinc-200 dark:border-zinc-700 text-sm font-semibold hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md hover:-translate-y-0.5 transition-all">
                {company}
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-surface-850">
        <div className="page-container">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="section-heading">Loved by <span className="gradient-text">Developers</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Priya Sharma', role: 'SDE at Amazon', text: 'IntelliView\'s AI feedback on my code was incredibly detailed. It helped me fix bad habits I didn\'t even know I had. Got my dream offer!' },
              { name: 'Rahul Verma', role: 'SWE at Google', text: 'The behavioral interview prep is phenomenal. The STAR analysis made me understand exactly what interviewers look for. 10/10 recommend.' },
              { name: 'Ananya Patel', role: 'Developer at Microsoft', text: 'The company-specific prep guides are gold. Knowing the round structure and focus areas gave me so much confidence going in.' },
            ].map((t, i) => (
              <motion.div key={t.name} {...stagger} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-7">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-accent-400 flex items-center justify-center text-white font-semibold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900" />
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="page-container relative z-10 text-center">
          <motion.div {...fadeUp}>
            <h2 className="text-4xl md:text-5xl font-black font-display text-white mb-6">
              Ready to Ace Your Interview?
            </h2>
            <p className="text-lg text-brand-200 max-w-xl mx-auto mb-10">
              Join thousands of developers who improved their interview performance with AI-powered feedback.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all group">
              Get Started — It's Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
