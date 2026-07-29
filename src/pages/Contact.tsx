import React, { useState } from 'react';
import s from './Contact.module.css';
import PromptBg from '../components/PromptBg';

const EmailIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const GHIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>;
const LIIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const PinIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;

const INFO = [
  { icon: <EmailIcon />, label: 'Email', value: 'jainanshul222004@gmail.com', href: 'mailto:jainanshul222004@gmail.com' },
  { icon: <GHIcon />, label: 'GitHub', value: 'github.com/Anshuljain22', href: 'https://github.com/Anshuljain22' },
  { icon: <LIIcon />, label: 'LinkedIn', value: 'linkedin.com/in/anshul-jain', href: 'https://www.linkedin.com/in/anshul-jain-7b780a270/' },
  { icon: <PinIcon />, label: 'Status', value: 'Open for Remote & Relocation', href: null },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: 'Collaboration', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => setSent(true), 400);
  };

  return (
    <main>
      <PromptBg />
      <div className="section-wrap">
        <h1 className="section-heading">// 05 CONTACT</h1>
        <p className="section-sub">Open to new missions. Let's talk.</p>

        <div className={s.grid}>
          {/* Form */}
          <div className={`card ${s.formCard}`}>
            {sent ? (
              <div className={s.success}>
                <p className={s.successTitle}>TRANSMISSION SENT.</p>
                <p className={s.successSub}>I'll respond within 48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={s.form}>
                <div className={s.field}>
                  <label className={s.label} htmlFor="name">NAME</label>
                  <input id="name" className={s.input} type="text" required placeholder="Your name"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className={s.field}>
                  <label className={s.label} htmlFor="email">EMAIL</label>
                  <input id="email" className={s.input} type="email" required placeholder="your@email.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className={s.field}>
                  <label className={s.label} htmlFor="subject">SUBJECT</label>
                  <select id="subject" className={s.input}
                    value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                    <option>Collaboration</option>
                    <option>Job Opportunity</option>
                    <option>Research</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className={s.field}>
                  <label className={s.label} htmlFor="message">MESSAGE</label>
                  <textarea id="message" className={`${s.input} ${s.textarea}`} required placeholder="Your message..."
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
                <button type="submit" className={`btn btn-cyan ${s.sendBtn}`}>SEND MESSAGE</button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className={s.infoCol}>
            {INFO.map(item => (
              <div key={item.label} className={`card ${s.infoCard}`}>
                <span className={s.infoIcon}>{item.icon}</span>
                <div>
                  <p className={s.infoLabel}>{item.label}</p>
                  {item.href
                    ? <a href={item.href} className={s.infoValue}>{item.value}</a>
                    : <p className={s.infoValue}>{item.value}</p>}
                </div>
              </div>
            ))}
            <p className={s.openNote}>Currently open to full-time roles and research collaborations.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
