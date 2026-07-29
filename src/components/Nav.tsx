import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import s from './Nav.module.css';

const links = [
  { to: '/', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
  { to: '/experience', label: 'Experience' },
  { to: '/achievements', label: 'Achievements' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav className={s.nav}>
        <NavLink to="/" className={s.logo}>ANSHUL.JAIN</NavLink>
        <ul className={s.links}>
          {links.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => isActive ? `${s.link} ${s.active}` : s.link}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <button className={s.hamburger} onClick={() => setOpen(true)} aria-label="Open menu">
          <span /><span /><span />
        </button>
      </nav>

      {open && (
        <div className={s.overlay}>
          <button className={s.close} onClick={() => setOpen(false)}>✕</button>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}
              className={({ isActive }) => isActive ? `${s.ovLink} ${s.active}` : s.ovLink}>
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </>
  );
}
