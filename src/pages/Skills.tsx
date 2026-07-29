import React from 'react';
import s from './Skills.module.css';
import AttentionHeatmapBg from '../components/AttentionHeatmapBg';

interface Group { title: string; skills: string[] }

const GROUPS: Group[] = [
  { title: 'PROGRAMMING & CORE ML', skills: ['Python', 'Java', 'R', 'PyTorch', 'TensorFlow', 'Keras', 'Scikit-learn', 'OpenCV'] },
  { title: 'LLMs, RAG & NLP', skills: ['LangChain', 'RAG', 'ChromaDB', 'HuggingFace Gemma 2-9b', 'Embeddings', 'GANs', 'ConvLSTM', 'BERT'] },
  { title: 'DATA SCIENCE & ANALYTICS', skills: ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Power BI', 'Data Analysis', 'Feature Engineering'] },
  { title: 'TOOLS, INFRA & DATABASES', skills: ['Git', 'GitLab', 'Docker', 'DVC', 'FastAPI', 'Flask', 'Cloudflare', 'MongoDB', 'MySQL', 'Jupyter'] },
];

export default function Skills() {
  return (
    <main>
      <AttentionHeatmapBg />
      <div className="section-wrap">
        <h1 className="section-heading">// 03 SKILLS</h1>
        <p className="section-sub">Systems online. Capabilities verified.</p>
        <div className={s.grid}>
          {GROUPS.map(g => (
            <div key={g.title} className={`card ${s.group}`}>
              <div className={s.groupHeader}>
                <span className={s.onlineDot} />
                <span className={s.onlineLabel}>ONLINE</span>
                <h2 className={s.groupTitle}>{g.title}</h2>
              </div>
              <div className={s.skillList}>
                {g.skills.map(sk => (
                  <span key={sk} className={s.skillTag}>{sk}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
