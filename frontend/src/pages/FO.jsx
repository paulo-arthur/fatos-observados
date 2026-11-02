import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useRecords from '../hooks/useRecords.js';
import { matches } from '../utils/format.js';
import FOPannel from '../components/FOPannel.jsx';
import RecordForm from '../components/RecordForm.jsx';
import Icon from '../components/Icon.jsx';
import { Alert, EmptyState, PageHeader, ResourceState, SearchInput } from '../components/UI.jsx';

export default function FO() {
  const records = useRecords();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [notice, setNotice] = useState('');
  const [sort, setSort] = useState('recent');
  const modal = params.get('new') === '1';
  function close() { setParams({}, { replace: true }); }
  const filtered = records.fos.filter((fo) => {
    const student = records.students.find((item) => item.id === fo.alvo_id);
    const instructor = records.instructors.find((item) => item.id === fo.autor_id);
    return (status === 'all' || fo.foi_julgado === (status === 'judged')) && matches(search, fo.descricao, fo.id, student?.nome, student?.numero, instructor?.nome);
  }).sort((a, b) => sort === 'recent' ? new Date(b.data) - new Date(a.data) || b.id - a.id : new Date(a.data) - new Date(b.data) || a.id - b.id);
  const pending = records.fos.filter((fo) => !fo.foi_julgado).length;
  return <><PageHeader title="Fatos observados" description="Registre ocorrências e acompanhe cada etapa do julgamento." action={<button className="button" onClick={() => setParams({ new: '1' })}><Icon name="plus" />Novo fato observado</button>} /><Alert success>{notice}</Alert><ResourceState resource={records}><section className="panel records-panel"><div className="toolbar"><div className="tabs" role="group" aria-label="Filtrar por status">{[['all', 'Todos', records.fos.length], ['pending', 'Pendentes', pending], ['judged', 'Julgados', records.fos.length - pending]].map(([value, label, count]) => <button key={value} className={status === value ? 'selected' : ''} onClick={() => setStatus(value)} aria-pressed={status === value}>{label}<span>{count}</span></button>)}</div><SearchInput value={search} onChange={setSearch} placeholder="Buscar aluno, autor ou descrição…" /></div><div className="list-meta"><span>{filtered.length} {filtered.length === 1 ? 'registro encontrado' : 'registros encontrados'}</span><label>Ordenar por<select aria-label="Ordenar fatos" value={sort} onChange={(event) => setSort(event.target.value)}><option value="recent">Mais recentes</option><option value="oldest">Mais antigos</option></select></label></div>{filtered.length ? <div className="fo-grid">{filtered.map((fo) => <FOPannel key={fo.id} fo={fo} students={records.students} instructors={records.instructors} />)}</div> : <EmptyState description={search || status !== 'all' ? 'Tente outra busca ou selecione outro status.' : 'Clique em “Novo fato observado” para criar o primeiro registro.'} />}</section></ResourceState>{modal && !records.loading && !records.error && (records.students.length ? <RecordForm type="fo" students={records.students} onClose={close} onSuccess={(message) => { close(); setNotice(message); records.reload(); }} /> : <div className="panel no-students"><p>Cadastre um aluno antes de registrar um fato observado.</p><Link className="button" to="/students">Cadastrar aluno<Icon name="arrow" /></Link><button className="button secondary" onClick={close}>Cancelar</button></div>)}</>;
}
