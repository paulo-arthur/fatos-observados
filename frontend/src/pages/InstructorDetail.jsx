import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/axios.js';
import useAuth from '../hooks/useAuth.js';
import useResource from '../hooks/useResource.js';
import { errorMessage, initials, rankName } from '../utils/format.js';
import { Alert, BackLink, EmptyState, Modal, PageHeader, ResourceState } from '../components/UI.jsx';
import Icon from '../components/Icon.jsx';

export default function InstructorDetail() {
  const { id } = useParams();
  return <Detail key={id} id={id} />;
}

function Detail({ id }) {
  const resource = useResource(`/instructors/${encodeURIComponent(id)}`);
  const { isCaptain, user, logoutUser } = useAuth();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const instructor = resource.data?.[0];

  async function toggle() {
    if (busy) return;
    setError('');
    setBusy(true);
    try {
      const { data } = await api.patch(`/instructors/${encodeURIComponent(id)}`);
      if (String(user.id) === id && !data.instructor.ativo) { logoutUser(); return; }
      setConfirm(false);
      setNotice(`Acesso ${data.instructor.ativo ? 'ativado' : 'desativado'} com sucesso.`);
      resource.reload();
    } catch (error) { setError(errorMessage(error)); }
    finally { setBusy(false); }
  }

  return <><BackLink to="/instructors">Todos os instrutores</BackLink><PageHeader eyebrow="EQUIPE INSTITUCIONAL" title="Detalhes do instrutor" description="Informações de cadastro e acesso ao sistema." /><Alert success>{notice}</Alert><ResourceState resource={resource}>{instructor ? <div className="detail-grid"><section className="panel"><div className="profile-panel"><span className="avatar large">{initials(instructor.nome)}</span><div><h2>{instructor.nome}</h2><p className="muted">{rankName(instructor.posto)}</p></div></div><hr /><dl className="info-list"><div><dt>E-mail institucional</dt><dd>{instructor.email}</dd></div><div><dt>Posto</dt><dd>{rankName(instructor.posto)}</dd></div><div><dt>Acesso ao sistema</dt><dd><span className={`badge ${instructor.ativo ? 'green' : 'gray'}`}><span className="status-dot" />{instructor.ativo ? 'Ativo' : 'Inativo'}</span></dd></div></dl></section><aside className="panel access-panel"><Icon name="shield" /><h3>Gerenciamento de acesso</h3><p className="muted">{instructor.ativo ? 'O instrutor está autorizado a entrar no sistema.' : 'O instrutor está com o acesso ao sistema desativado.'}</p>{isCaptain ? <button className={`button ${instructor.ativo ? 'danger-outline' : ''}`} onClick={() => { setError(''); setConfirm(true); }}>{instructor.ativo ? 'Desativar acesso' : 'Ativar acesso'}</button> : <span className="permission-note"><Icon name="lock" />Ação exclusiva de capitães</span>}</aside></div> : <div className="panel"><EmptyState title="Instrutor não encontrado" description="O cadastro solicitado não está disponível." /></div>}</ResourceState>{confirm && <Modal title={instructor.ativo ? 'Desativar acesso?' : 'Ativar acesso?'} onClose={() => { if (!busy) setConfirm(false); }}><p className="muted">{instructor.ativo ? `${instructor.nome} não poderá realizar novos logins.` : `${instructor.nome} poderá entrar no sistema com suas credenciais.`}{String(user.id) === id && instructor.ativo ? ' Sua sessão será encerrada.' : ''}</p><Alert>{error}</Alert><div className="modal-actions"><button className="button secondary" disabled={busy} onClick={() => setConfirm(false)}>Cancelar</button><button className="button" disabled={busy} onClick={toggle}>{busy ? 'Salvando…' : 'Confirmar'}</button></div></Modal>}</>;
}
