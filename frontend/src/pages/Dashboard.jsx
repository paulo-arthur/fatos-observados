import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import useRecords from '../hooks/useRecords.js';
import FOPannel from '../components/FOPannel.jsx';
import Icon from '../components/Icon.jsx';
import { EmptyState, PageHeader, ResourceState } from '../components/UI.jsx';

export default function Dashboard() {
  const { user, isCaptain } = useAuth();
  const records = useRecords();
  const pending = records.fos.filter((fo) => !fo.foi_julgado).length;
  const judged = records.fos.length - pending;
  const latest = [...records.fos].sort((a, b) => new Date(b.data) - new Date(a.data) || b.id - a.id).slice(0, 4);
  return <><PageHeader eyebrow="SEU PAINEL" title="Visão geral" description={`Olá, ${user.name}. Acompanhe os registros da instituição.`} action={<Link className="button" to="/fo?new=1"><Icon name="plus" />Novo fato observado</Link>} /><ResourceState resource={records}><section className="stats-grid" aria-label="Resumo dos registros">{[
    ['Total de registros', records.fos.length, 'file', 'Fatos observados cadastrados', ''],
    ['Aguardando julgamento', pending, 'clock', 'Registros para avaliação', 'amber'],
    ['Fatos julgados', judged, 'check', 'Registros já avaliados', 'green'],
    ['Alunos cadastrados', records.students.length, 'users', 'Alunos da instituição', ''],
  ].map(([label, value, icon, note, tone]) => <div className={`stat-card ${tone}`} key={label}><div><span>{label}</span><Icon name={icon} /></div><strong>{value.toString().padStart(2, '0')}</strong><p>{note}</p></div>)}</section><div className="dashboard-columns"><section><div className="section-heading"><div><h2>Últimos fatos observados</h2><p>Os registros mais recentes da instituição.</p></div><Link className="text-link" to="/fo">Ver todos<Icon name="arrow" /></Link></div>{latest.length ? <div className="fo-grid dashboard-records">{latest.map((fo) => <FOPannel key={fo.id} fo={fo} students={records.students} instructors={records.instructors} />)}</div> : <div className="panel"><EmptyState title="Tudo pronto para o primeiro registro" description="Cadastre um aluno e registre os fatos observados da rotina acadêmica." /></div>}</section><aside className="dashboard-aside"><div className="insight-card"><span className="insight-icon"><Icon name="shield" /></span><p className="eyebrow">ACOMPANHAMENTO CONTÍNUO</p><h2>Cada registro contribui para a formação.</h2><p>Mantenha os fatos atualizados e acompanhe o histórico de cada aluno.</p><Link to="/students">Consultar alunos<Icon name="arrow" /></Link></div><div className="panel workflow-panel"><h3>Fluxo de acompanhamento</h3><ol><li><span>01</span><div><strong>Registre o fato</strong><p>Identifique o aluno e descreva o ocorrido.</p></div></li><li><span>02</span><div><strong>Acompanhe o histórico</strong><p>Consulte os registros e seus status.</p></div></li><li><span>03</span><div><strong>Realize o julgamento</strong><p>{isCaptain ? 'Avalie o registro e marque como julgado.' : 'O capitão responsável avalia os registros.'}</p></div></li></ol></div></aside></div></ResourceState></>;
}
