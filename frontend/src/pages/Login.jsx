import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import { errorMessage } from '../utils/format.js';
import { Brand } from '../components/Navbar.jsx';
import { Alert } from '../components/UI.jsx';
import Icon from '../components/Icon.jsx';

export default function Login() {
  const { signed, loginUser } = useAuth();
  const location = useLocation();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(false);
  const destination = location.state?.from;
  if (signed) return <Navigate to={destination?.startsWith('/') && !destination.startsWith('//') && !destination.startsWith('/login') ? destination : '/dashboard'} replace />;

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    setError('');
    setBusy(true);
    try { await loginUser(form.get('email'), form.get('password')); }
    catch (error) { setError(errorMessage(error)); }
    finally { setBusy(false); }
  }

  return <div className="login-page"><section className="login-story"><Brand /><div className="login-story-content"><span className="story-kicker"><span /> DISCIPLINA · RESPONSABILIDADE · FORMAÇÃO</span><h1>Um registro.<br />Mais clareza.<br /><em>Melhor formação.</em></h1><p>Registre, acompanhe e avalie os fatos observados na rotina acadêmica.</p><div className="story-rule" /><span className="story-caption">Instituto Militar de Engenharia<br />Sistema de acompanhamento disciplinar</span></div><div className="story-footer">COMPROMISSO COM A EXCELÊNCIA</div></section><main className="login-main"><div className="login-form-wrap"><div className="login-mobile-brand"><Brand /></div><span className="login-icon"><Icon name="lock" /></span><p className="eyebrow">ACESSO INSTITUCIONAL</p><h2>Bem-vindo de volta.</h2><p className="muted">Entre com suas credenciais de instrutor para continuar.</p><form onSubmit={submit} className="form-stack"><Alert>{error}</Alert><label>E-mail institucional<input autoFocus type="email" name="email" autoComplete="username" placeholder="seu.email@instituicao.br" maxLength={60} required disabled={busy} /></label><label>Senha<div className="password-field"><input type={visible ? 'text' : 'password'} name="password" autoComplete="current-password" placeholder="Digite sua senha" required disabled={busy} /><button className="icon-button" type="button" onClick={() => setVisible(!visible)} aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'} aria-pressed={visible}><Icon name="eye" /></button></div></label><button className="button login-submit" disabled={busy}>{busy ? <><span className="spinner" />Entrando…</> : <>Entrar no sistema<Icon name="arrow" /></>}</button></form><p className="login-help"><Icon name="shield" />Acesso restrito a instrutores autorizados.<br />Para obter acesso, procure o capitão responsável.</p></div><footer>Instituto Militar de Engenharia · Fatos Observados</footer></main></div>;
}
