import React, { useEffect, useRef, useState } from 'react';
import s from './Achievements.module.css';
import TrophyRoomBg from '../components/TrophyRoomBg';

/* ════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */

interface Hackathon {
  name: string;
  organizer: string;
  date: string;
  result: 'win' | 'runner' | 'part';
  resultLabel: string;
  desc: string;
  tech: string[];
  accent: string;
}

const HACKATHONS: Hackathon[] = [
  {
    name: 'IEEE Research Publication',
    organizer: 'IEEE · Vellore Institute of Technology',
    date: 'Published',
    result: 'win',
    resultLabel: '📄 IEEE Published',
    desc: 'Authored research paper titled "Securing LLM-Generated Code with Iterative Static Analysis and LLM Review" demonstrating a hybrid vulnerability detection framework achieving 0.871 F1 score across 6 languages.',
    tech: ['LLM Security', 'Gemma-3', 'Static Analysis', 'Bandit', 'Semgrep', 'Python'],
    accent: '#00e5a0',
  },
  {
    name: 'Tomato Disease AI Classifier',
    organizer: 'Google TensorFlow Capstone',
    date: 'Completed',
    result: 'win',
    resultLabel: '🏆 98% Accuracy',
    desc: 'Designed and deployed a 98% accurate ResNet152V2 CNN model classifying 10+ tomato leaf diseases on 2,500+ images with a Flask web dashboard.',
    tech: ['TensorFlow', 'ResNet152V2', 'Flask', 'Kaggle', 'OpenCV'],
    accent: '#3b9eff',
  },
  {
    name: 'Indian Food RAG Assistant',
    organizer: 'LangChain & Gemma Project',
    date: 'Deployed',
    result: 'win',
    resultLabel: '⚡ RAG System',
    desc: 'Built a specialized nutrition & recipe chatbot using Gemma 2-9b with ChromaDB RAG, voice-to-text integration, and personalized dietary memory.',
    tech: ['LangChain', 'Gemma 2-9b', 'ChromaDB', 'Python', 'Embeddings'],
    accent: '#a78bfa',
  },
  {
    name: 'IIT Guwahati Data Science Challenge',
    organizer: 'IIT Guwahati',
    date: 'Completed',
    result: 'runner',
    resultLabel: '🎖️ Top Analyst',
    desc: 'Completed intensive hands-on coursework in Deep Machine Learning and Data Analysis with competitive weekly data analytics challenges.',
    tech: ['Machine Learning', 'Data Analysis', 'Python', 'Pandas', 'Scikit-Learn'],
    accent: '#f59e0b',
  },
];

interface Cert {
  name: string;
  issuer: string;
  year: string;
  icon: string;
  color: string;
}

const CERTS: Cert[] = [
  { name: 'Artificial Intelligence using Google Tensorflow', issuer: 'Google / TensorFlow (18+ GCP Practice Labs)', year: '2024', icon: '🤖', color: '#f59e0b' },
  { name: 'Summer Data Analyst Program', issuer: 'IIT Guwahati', year: '2024', icon: '📊', color: '#3b9eff' },
  { name: 'Bachelor of Technology (Computer Science & Engineering)', issuer: 'Vellore Institute of Technology (VIT)', year: '2022 - 2026', icon: '🎓', color: '#00e5a0' },
];

/* ── Animated counter hook ── */
function useCounter(target: number, duration = 1400) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      let start: number;
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        setVal(Math.round(p * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { val, ref };
}

/* ── LeetCode Ring ── */
function LcRing({ solved, total, label }: { solved: number; total: number; label: string }) {
  const R = 38;
  const circ = 2 * Math.PI * R;
  const pct = solved / total;
  const [dash, setDash] = useState(0);
  const ref = useRef<SVGCircleElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      setTimeout(() => setDash(circ * pct), 100);
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [pct, circ]);

  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
      <circle
        ref={ref}
        cx="50" cy="50" r={R}
        fill="none"
        stroke={label === 'EASY' ? '#00e5a0' : label === 'MED' ? '#f59e0b' : '#f87171'}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  );
}

/* ════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════ */
export default function Achievements() {
  const total = useCounter(427);
  const streak = useCounter(68);
  const repos = useCounter(34);
  const stars = useCounter(290);
  const contributions = useCounter(1247);
  const prs = useCounter(58);

  return (
    <main>
      <TrophyRoomBg />
      <div className="section-wrap">
        <h1 className="section-heading">// 05 ACHIEVEMENTS</h1>
        <p className="section-sub">Milestones logged. Records verified.</p>

        <div className={s.pageGrid}>

          {/* ── LeetCode ──────────────────────────────── */}
          <section>
            <div className={s.blockHeading}>
              <span className={s.blockIcon}>💻</span>
              LEETCODE STATS
            </div>

            <div className={s.lcPanel}>
              {/* Left: ring + difficulty bars */}
              <div className={`card ${s.lcRing}`}>
                <div className={s.ringWrap}>
                  <LcRing solved={427} total={3200} label="TOTAL" />
                  <div className={s.ringCenter}>
                    <span className={s.ringNum} ref={total.ref}>{total.val}</span>
                    <span className={s.ringLabel}>SOLVED</span>
                  </div>
                </div>
                <div className={s.ringInfo}>
                  <div className={s.ringTitle}>DIFFICULTY BREAKDOWN</div>
                  <div className={s.diffGrid}>
                    {[
                      { label: 'EASY', solved: 198, total: 800, cls: s.easy },
                      { label: 'MED',  solved: 185, total: 1600, cls: s.med  },
                      { label: 'HARD', solved: 44,  total: 700,  cls: s.hard },
                    ].map(d => (
                      <div key={d.label} className={`${s.diffRow} ${d.cls}`}>
                        <span className={s.diffLabel}>{d.label}</span>
                        <div className={s.diffBar}>
                          <div className={s.diffFill} style={{ width: `${(d.solved / d.total) * 100}%` }} />
                        </div>
                        <span className={s.diffCount}>{d.solved}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: badges */}
              <div className={s.lcStats}>
                <div className={s.lcBadges}>
                  {[
                    { icon: '🔥', num: streak.ref, val: streak.val, label: 'DAY STREAK' },
                    { icon: '⭐', num: null, val: '1842', label: 'RATING' },
                    { icon: '🏅', num: null, val: 'Top 8%', label: 'GLOBAL RANK' },
                    { icon: '🎯', num: null, val: '12', label: 'CONTESTS' },
                  ].map((b, i) => (
                    <div key={i} className={`card ${s.lcBadge}`}>
                      <span className={s.lcBadgeIcon}>{b.icon}</span>
                      {b.num
                        ? <span className={s.lcBadgeNum} ref={b.num}>{b.val}</span>
                        : <span className={s.lcBadgeNum}>{b.val}</span>
                      }
                      <span className={s.lcBadgeLbl}>{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Hackathons ────────────────────────────── */}
          <section>
            <div className={s.blockHeading}>
              <span className={s.blockIcon}>🚀</span>
              HACKATHONS
            </div>
            <div className={s.hackGrid}>
              {HACKATHONS.map((h, i) => (
                <div key={i} className={`card ${s.hackCard}`}>
                  <div className={s.hackAccent} style={{ background: h.accent }} />
                  <div className={`${s.hackBadge} ${h.result === 'win' ? s.win : h.result === 'runner' ? s.runner : s.part}`}>
                    {h.resultLabel}
                  </div>
                  <div className={s.hackName}>{h.name}</div>
                  <div className={s.hackMeta}>{h.organizer} · {h.date}</div>
                  <div className={s.hackDesc}>{h.desc}</div>
                  <div className={s.hackTechRow}>
                    {h.tech.map(t => <span key={t} className={s.hackTech}>{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── GitHub Stats ──────────────────────────── */}
          <section>
            <div className={s.blockHeading}>
              <span className={s.blockIcon}>⚡</span>
              GITHUB ACTIVITY
            </div>
            <div className={s.ghGrid}>
              {[
                { icon: '📁', ref: repos.ref, val: repos.val, suffix: '', label: 'PUBLIC REPOS' },
                { icon: '⭐', ref: stars.ref, val: stars.val, suffix: '+', label: 'TOTAL STARS' },
                { icon: '🔀', ref: prs.ref,   val: prs.val,   suffix: '',  label: 'PULL REQUESTS' },
                { icon: '📈', ref: contributions.ref, val: contributions.val, suffix: '+', label: 'CONTRIBUTIONS' },
              ].map((g, i) => (
                <div key={i} className={`card ${s.ghStat}`}>
                  <span className={s.ghIcon}>{g.icon}</span>
                  <span className={s.ghNum} ref={g.ref}>{g.val}{g.suffix}</span>
                  <span className={s.ghLbl}>{g.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Certifications ────────────────────────── */}
          <section>
            <div className={s.blockHeading}>
              <span className={s.blockIcon}>🎖️</span>
              CERTIFICATIONS
            </div>
            <div className={s.certGrid}>
              {CERTS.map((c, i) => (
                <div key={i} className={`card ${s.certCard}`}>
                  <div className={s.certLogo} style={{ background: `${c.color}18`, border: `1px solid ${c.color}40` }}>
                    {c.icon}
                  </div>
                  <div className={s.certBody}>
                    <div className={s.certName}>{c.name}</div>
                    <div className={s.certIssuer}>{c.issuer}</div>
                    <div className={s.certYear}>{c.year}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Coding Profiles ───────────────────────── */}
          <section>
            <div className={s.blockHeading}>
              <span className={s.blockIcon}>🔗</span>
              CODING PROFILES
            </div>
            <div className={s.profilesGrid}>
              {[
                { emoji: '⚫', name: 'GitHub', handle: '@Anshuljain22', color: '#e8f4ff', href: 'https://github.com/Anshuljain22' },
                { emoji: '💼', name: 'LinkedIn', handle: 'Anshul Jain', color: '#3b9eff', href: 'https://www.linkedin.com/in/anshul-jain-7b780a270/' },
                { emoji: '📧', name: 'Email', handle: 'jainanshul222004@gmail.com', color: '#00e5a0', href: 'mailto:jainanshul222004@gmail.com' },
                { emoji: '🎓', name: 'VIT Vellore', handle: 'B.Tech CSE (2022 - 2026)', color: '#a78bfa', href: '#' },
              ].map((p, i) => (
                <a key={i} href={p.href} className={`card ${s.profileCard}`} style={{ ['--accent' as any]: p.color }}>
                  <span className={s.profileEmoji}>{p.emoji}</span>
                  <div className={s.profileInfo}>
                    <div className={s.profileName}>{p.name}</div>
                    <div className={s.profileHandle}>{p.handle}</div>
                  </div>
                </a>
              ))}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
