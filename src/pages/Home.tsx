import React from 'react';
import { Link } from 'react-router-dom';
import s from './Home.module.css';
import DataScienceBg from '../components/DataScienceBg';

/* ── Stat card ── */
const Stat = ({ num, label }: { num: string; label: string }) => (
  <div className={`card ${s.statCard}`}>
    <div className={s.statNum}>{num}</div>
    <div className={s.statLabel}>{label}</div>
  </div>
);

export default function Home() {
  return (
    <main>
      {/* Global physics background — fixed behind everything */}
      <DataScienceBg />

      {/* HERO */}
      <section className={s.hero}>
        <div className={s.heroContent}>
          <p className={s.label}>AI/ML ENGINEER &amp; DATA SCIENTIST<span className={s.cursor} /></p>
          <h1 className={s.name}>ANSHUL JAIN</h1>
          <p className={s.title}>Building intelligent systems — from deep learning pipelines to LLMs &amp; RAG.</p>
          <p className={s.tagline}>
            Specialising in <span className={s.highlight}>LLMs &amp; RAG</span> · <span className={s.highlight}>Computer Vision</span> · <span className={s.highlight}>Deep Learning</span> · <span className={s.highlight}>Data Analytics</span>
          </p>
          <div className={s.ctas}>
            <Link to="/projects" className="btn btn-cyan">VIEW MY WORK</Link>
            <Link to="/contact" className="btn btn-ghost">CONTACT ME</Link>
          </div>
        </div>
        <div className={s.scrollIndicator}>
          <span className={s.scrollText}>SCROLL</span>
          <div className={s.scrollLine} />
        </div>
      </section>

      {/* ABOUT */}
      <section>
        <div className="section-wrap">
          <h2 className="section-heading">// 01 ABOUT ME</h2>
          <div className={s.aboutGrid}>
            {/* Avatar */}
            <div className={s.avatarWrap}>
              <div className={s.avatar}>
                <span className={s.initials}>AJ</span>
              </div>
              <div className={s.status}>
                <span className="dot-online" />
                SYSTEM ONLINE
              </div>
            </div>
            {/* Text */}
            <div>
              <p className={s.aboutP}>
                I'm a B.Tech Computer Science &amp; Engineering graduate from <strong>Vellore Institute of Technology (VIT)</strong> (CGPA: 8.57). 
                I operate at the intersection of Artificial Intelligence, Data Science, and Machine Learning — crafting end-to-end solutions ranging from custom CNN models to advanced RAG chatbots.
              </p>
              <p className={s.aboutP}>
                My background includes interning as an ML Engineer at <strong>C-DAC (Center for Development of Advanced Computing)</strong> where I engineered spatio-temporal ConvLSTM models for climate forecasting, and publishing an IEEE research paper on securing LLM-generated code through iterative static analysis.
              </p>

              <div className={s.statsRow}>
                <Stat num="8.57" label="CGPA @ VIT" />
                <Stat num="1" label="IEEE Publication" />
                <Stat num="98%" label="CNN Accuracy" />
                <Stat num="3+" label="Major ML Systems" />
              </div>

              <p className={s.badgesLabel}>CURRENTLY WORKING WITH</p>
              <div className={s.badges}>
                {['Python', 'PyTorch', 'TensorFlow', 'LangChain', 'RAG', 'ChromaDB', 'FastAPI', 'Docker'].map(b => (
                  <span key={b} className="badge">{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
