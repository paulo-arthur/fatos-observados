import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/axios.js';
import useAuth from '../hooks/useAuth.js';
import useRecords from '../hooks/useRecords.js';
import useResource from '../hooks/useResource.js';
import { errorMessage, formatDate, rankName } from '../utils/format.js';
import { Alert, BackLink, EmptyState, Modal, PageHeader, ResourceState, StatusBadge } from '../components/UI.jsx';
import Icon from '../components/Icon.jsx';

export default function FODetail() {
  const { id } = useParams();
  return <Detail key={id} id={id} />;
}

function Detail({ id }) {
  const records = useRecords();
  const detail = useResource(`/fos/${encodeURIComponent(id)}`);
  const { isCaptain } = useAuth();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const fo = records.fos.find((item) => String(item.id) === id);
  const student = records.students.find((item) => item.id === fo?.alvo_id);
  const instructor = records.instructors.find((item) => item.id === fo?.autor_id);
  const resource = { loading: records.loading || detail.loading, error: records.error || detail.error, reload() { records.reload(); detail.reload(); } };

  async function judge() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await api.patch(`/fos/${encodeURIComponent(id)}`);
      setConfirm(false);
      setNotice('Fato observado marcado como julgado.');
      resource.reload();
    } catch (error) { setError(errorMessage(error)); }
    finally { setBusy(false); }
  }

  return <><BackLink to="/fo">Todos os fatos observados</BackLink><PageHeader eyebrow="DETALHES DO REGISTRO" title={`Fato observado #${id}`} description="Informações do registro e acompanhamento do julgamento." /><Alert success>{notice}</Alert><ResourceState resource={resource}>{fo && detail.data?.length ? <div className="detail-grid"><article className="panel detail-main"><div className="section-heading"><h2>Descrição do fato</h2><StatusBadge judged={fo.foi_julgado} /></div><p className="full-description">{detail.data[0].descricao}</p><div className="detail-timestamp"><Icon name="clock" /> Registrado em {formatDate(fo.data, true)}</div></article><aside className="detail-sidebar"><div className="panel"><p className="eyebrow">ALUNO</p><h3>{student?.nome || `Aluno #${fo.alvo_id}`}</h3><p className="muted">Número {student?.numero || 'não informado'}</p><Link className="text-link" to={`/students/${fo.alvo_id}`}>Ver histórico do aluno<Icon name="arrow" /></Link><hr /><p className="eyebrow">REGISTRADO POR</p><h3>{instructor?.nome || `Instrutor #${fo.autor_id}`}</h3><p className="muted">{rankName(instructor?.posto)}</p></div><div className="panel"><h3>Julgamento</h3><p className="muted">{fo.foi_julgado ? 'Este registro já foi julgado pelo capitão responsável.' : 'Este registro aguarda avaliação do capitão responsável.'}</p>{!fo.foi_julgado && (isCaptain ? <button className="button full-width" onClick={() => { setError(''); setConfirm(true); }}><Icon name="check" />Marcar como julgado</button> : <span className="permission-note"><Icon name="lock" />Ação exclusiva de capitães</span>)}</div></aside></div> : <div className="panel"><EmptyState title="Fato observado não encontrado" description="O registro solicitado não está disponível." /></div>}</ResourceState>{confirm && <Modal title="Confirmar julgamento" onClose={() => { if (!busy) setConfirm(false); }}><p className="muted">Marcar o fato observado #{id} como julgado? Esta ação não pode ser desfeita pelo sistema.</p><Alert>{error}</Alert><div className="modal-actions"><button disabled={busy} className="button secondary" onClick={() => setConfirm(false)}>Cancelar</button><button disabled={busy} className="button" onClick={judge}>{busy ? 'Salvando…' : 'Confirmar julgamento'}</button></div></Modal>}</>;
}
