import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { initials, rankName } from '../utils/format.js';
import Icon from './Icon.jsx';

export function Brand() {
  return <div className="brand"><span className="brand-mark"><Icon name="shield" /></span><div><strong>Fatos Observados</strong><span>INSTITUTO MILITAR DE ENGENHARIA</span></div></div>;
}

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  return (
    <aside className="sidebar">
      <NavLink to="/dashboard" className="brand-link" aria-label="Fatos Observados — início"><Brand /></NavLink>
      <div className="nav-label">ÁREA DO INSTRUTOR</div>
      <nav aria-label="Navegação principal">
        {[
          ['/dashboard', 'grid', 'Visão geral'],
          ['/fo', 'file', 'Fatos observados'],
          ['/students', 'users', 'Alunos'],
          ['/instructors', 'shield', 'Instrutores'],
        ].map(([path, icon, label]) => <NavLink key={path} to={path} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><Icon name={icon} />{label}<Icon name="chevron" /></NavLink>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note"><span className="status-dot" /> Ambiente institucional<span>Registro e acompanhamento de fatos observados.</span></div>
        <div className="user-block"><span className="avatar">{initials(user.name)}</span><div><strong>{user.name}</strong><span>{rankName(user.rank)}</span></div><button type="button" className="icon-button" onClick={logoutUser} aria-label="Sair da conta" title="Sair da conta"><Icon name="logout" /></button></div>
      </div>
    </aside>
  );
}
