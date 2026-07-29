import React from 'react';
import s from './Experience.module.css';
import LossCurveBg from '../components/LossCurveBg';

interface Job { company: string; role: string; period: string; bullets: string[]; tech: string[] }
interface Edu { degree: string; institution: string; year: string; courses: string }

const JOBS: Job[] = [
  {
    company: 'C-DAC: Center for Development of Advanced Computing', role: 'Machine Learning Engineer Intern', period: 'Internship',
    bullets: [
      'Built a multi-step temperature forecasting model using ConvLSTM and LSTM on NCMRWF reanalysis NetCDF datasets, predicting 3-hour ahead values for Pune region.',
      'Engineered spatio-temporal features from over 40 years of climate data, handled missing values, and evaluated model performance using MAE and RMSE; integrated Random Forest for benchmark comparison.',
      'Created comprehensive Software Requirements Specification (SRS) and Design Documents, detailing data flow, model architecture, and forecasting pipeline.',
    ],
    tech: ['Python', 'ConvLSTM', 'LSTM', 'NetCDF', 'Random Forest', 'Scikit-learn'],
  },
];

const EDU: Edu[] = [
  { 
    degree: 'B.Tech in Computer Science & Engineering (CGPA: 8.57)', 
    institution: 'Vellore Institute of Technology (VIT)', 
    year: 'Sep 2022 — Jul 2026', 
    courses: 'Artificial Intelligence, Machine Learning, Deep Learning, Data Structures & Algorithms, Database Systems, Natural Language Processing' 
  },
  { 
    degree: 'CBSE Board - 12th Grade (Percentage: 87.8%)', 
    institution: 'Ryan International School', 
    year: 'Apr 2020 — Jun 2022', 
    courses: 'Physics, Chemistry, Mathematics, Computer Science' 
  },
];

export default function Experience() {
  return (
    <main>
      <LossCurveBg />
      <div className="section-wrap">
        <h1 className="section-heading">// 04 EXPERIENCE</h1>
        <p className="section-sub">Mission log. Chronological.</p>

        {/* Timeline */}
        <div className={s.timeline}>
          {JOBS.map((j, i) => (
            <div key={i} className={s.entry}>
              <div className={s.timelineDot} />
              <div className={`card ${s.card}`}>
                <div className={s.cardHead}>
                  <div>
                    <h2 className={s.company}>{j.company}</h2>
                    <p className={s.role}>{j.role}</p>
                  </div>
                  <span className={s.period}>{j.period}</span>
                </div>
                <ul className={s.bullets}>
                  {j.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                </ul>
                <div className={s.techRow}>
                  {j.tech.map(t => <span key={t} className={s.techTag}>{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Education */}
        <h2 className={`section-heading ${s.eduHeading}`}>// EDUCATION</h2>
        <div className={s.eduGrid}>
          {EDU.map((e, i) => (
            <div key={i} className={`card ${s.eduCard}`}>
              <h3 className={s.degree}>{e.degree}</h3>
              <p className={s.institution}>{e.institution} · {e.year}</p>
              <p className={s.courses}><span className={s.coursesLabel}>Coursework:</span> {e.courses}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
