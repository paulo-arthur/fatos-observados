import { useState } from 'react';
import { Link } from 'react-router-dom';
import useResource from '../hooks/useResource.js';
import { initials, matches } from '../utils/format.js';
import RecordForm from '../components/RecordForm.jsx';
import { Alert, EmptyState, PageHeader, ResourceState, SearchInput } from '../components/UI.jsx';
import Icon from '../components/Icon.jsx';

export default function Student() {
  const resource = useResource('/students');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [notice, setNotice] = useState('');
  const students = (resource.data || []).filter((student) => matches(search, student.nome, student.numero, student.email));
  return <><PageHeader eyebrow="CORPO DISCENTE" title="Alunos" description="Consulte os alunos e acompanhe seus históricos individuais." action={<button className="button" onClick={() => setModal(true)}><Icon name="plus" />Novo aluno</button>} /><Alert success>{notice}</Alert><section className="panel"><div className="toolbar"><div><h2>Alunos cadastrados</h2><p className="muted">{resource.data?.length ?? '—'} alunos na instituição</p></div><SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome, número ou e-mail…" /></div><ResourceState resource={resource}>{students.length ? <div className="table-scroll"><table><thead><tr><th>Aluno</th><th>Número</th><th>E-mail</th><th><span className="sr-only">Ações</span></th></tr></thead><tbody>{students.map((student) => <tr key={student.id}><td><Link className="person-cell" to={`/students/${student.id}`}><span className="avatar pale">{initials(student.nome)}</span><strong>{student.nome}</strong></Link></td><td><span className="number-tag">{student.numero}</span></td><td className="muted">{student.email}</td><td><Link className="text-link" to={`/students/${student.id}`}>Ver histórico<Icon name="arrow" /></Link></td></tr>)}</tbody></table></div> : <EmptyState title={search ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado'} description={search ? 'Tente buscar por outro nome, número ou e-mail.' : 'Cadastre o primeiro aluno para começar a registrar fatos observados.'} />}</ResourceState></section>{modal && <RecordForm type="student" onClose={() => setModal(false)} onSuccess={(message) => { setModal(false); setNotice(message); resource.reload(); }} />}</>;
}
