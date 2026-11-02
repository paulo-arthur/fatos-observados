import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useResource from '../hooks/useResource.js';
import { initials, matches, rankName } from '../utils/format.js';
import RecordForm from '../components/RecordForm.jsx';
import Icon from '../components/Icon.jsx';
import { Alert, EmptyState, PageHeader, ResourceState, SearchInput } from '../components/UI.jsx';

export default function Instructors() {
  const { isCaptain } = useAuth();
  const resource = useResource('/instructors');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState(false);
  const [notice, setNotice] = useState('');
  const instructors = (resource.data || []).filter((instructor) => matches(search, instructor.nome, instructor.email, rankName(instructor.posto)) && (filter === 'all' || instructor.ativo === (filter === 'active')));
  return <><PageHeader eyebrow="CORPO DE INSTRUTORES" title="Instrutores" description="Consulte a equipe e gerencie os acessos à instituição." action={isCaptain && <button className="button" onClick={() => setModal(true)}><Icon name="plus" />Novo instrutor</button>} /><Alert success>{notice}</Alert>{!isCaptain && <p className="permission-note"><Icon name="lock" />O cadastro e a alteração de acesso são exclusivos de capitães.</p>}<section className="panel"><div className="toolbar"><SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome, posto ou e-mail…" /><label className="filter-label">Acesso<select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">Todos</option><option value="active">Ativos</option><option value="inactive">Inativos</option></select></label></div><ResourceState resource={resource}>{instructors.length ? <div className="table-scroll"><table><thead><tr><th>Instrutor</th><th>Posto</th><th>E-mail</th><th>Acesso</th><th><span className="sr-only">Ações</span></th></tr></thead><tbody>{instructors.map((instructor) => <tr key={instructor.id}><td><Link className="person-cell" to={`/instructors/${instructor.id}`}><span className="avatar pale">{initials(instructor.nome)}</span><strong>{instructor.nome}</strong></Link></td><td>{rankName(instructor.posto)}</td><td className="muted">{instructor.email}</td><td><span className={`badge ${instructor.ativo ? 'green' : 'gray'}`}><span className="status-dot" />{instructor.ativo ? 'Ativo' : 'Inativo'}</span></td><td><Link className="text-link" to={`/instructors/${instructor.id}`}>Detalhes<Icon name="arrow" /></Link></td></tr>)}</tbody></table></div> : <EmptyState title="Nenhum instrutor encontrado" description="Tente outra busca ou outro filtro de acesso." />}</ResourceState></section>{modal && isCaptain && <RecordForm type="instructor" onClose={() => setModal(false)} onSuccess={(message) => { setModal(false); setNotice(message); resource.reload(); }} />}</>;
}
