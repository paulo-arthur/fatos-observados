import { useParams } from 'react-router-dom';
import useResource from '../hooks/useResource.js';
import { formatDate, initials, rankName } from '../utils/format.js';
import { BackLink, EmptyState, PageHeader, ResourceState, StatusBadge } from '../components/UI.jsx';

export default function StudentDetail() {
  const { id } = useParams();
  return <Detail key={id} id={id} />;
}

function Detail({ id }) {
  const student = useResource(`/students/${encodeURIComponent(id)}`);
  const history = useResource(`/fos/student/${encodeURIComponent(id)}`);
  const entries = [...(history.data || [])].sort((a, b) => new Date(b.data) - new Date(a.data));
  const person = student.data;
  return <><BackLink to="/students">Todos os alunos</BackLink><PageHeader eyebrow="ACOMPANHAMENTO INDIVIDUAL" title="Histórico do aluno" description="Consulte os fatos observados registrados para este aluno." /><ResourceState resource={student}>{person && <><div className="panel profile-panel"><span className="avatar large">{initials(person.nome)}</span><div><h2>{person.nome}</h2><p className="muted">Nº {person.numero}<span className="separator">·</span>{person.email}</p></div><div className="profile-count"><strong>{history.data?.length ?? '—'}</strong><span>fatos observados</span></div></div><div className="section-heading"><h2>Registros do aluno</h2></div><ResourceState resource={history}>{entries.length ? <div className="history-list">{entries.map((fo, index) => <article className="panel history-card" key={`${fo.data}-${index}`}><div className="fo-card-top"><span className="muted">{formatDate(fo.data, true)}</span><StatusBadge judged={fo.foi_julgado} /></div><p className="full-description">{fo.descricao}</p><p className="muted">Registrado por {rankName(fo.posto)} {fo.nome}</p></article>)}</div> : <div className="panel"><EmptyState title="Nenhum fato observado" description="Este aluno ainda não possui registros no sistema." /></div>}</ResourceState></>}</ResourceState></>;
}
