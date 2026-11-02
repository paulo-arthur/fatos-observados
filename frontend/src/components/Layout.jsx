import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function Layout() {
  return <div className="app-shell"><a className="skip-link" href="#main">Ir para o conteúdo</a><Navbar /><div className="workspace"><header className="topbar"><span>SISTEMA DE ACOMPANHAMENTO DISCIPLINAR</span><span><span className="status-dot" /> Acesso institucional</span></header><main id="main" className="main-content"><Outlet /></main><footer className="app-footer"><span>Instituto Militar de Engenharia</span><span>Fatos Observados · Uso institucional</span></footer></div></div>;
}
