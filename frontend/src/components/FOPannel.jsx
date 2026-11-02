import { Link } from 'react-router-dom';
import { formatDate, rankName } from '../utils/format.js';
import { StatusBadge } from './UI.jsx';
import Icon from './Icon.jsx';

export default function FOPannel({ fo, students = [], instructors = [] }) {
  const student = students.find((item) => item.id === fo.alvo_id);
  const instructor = instructors.find((item) => item.id === fo.autor_id);
  return <Link to={`/fo/${fo.id}`} className="fo-card"><div className="fo-card-top"><span className="record-id">FO #{String(fo.id).padStart(3, '0')}</span><StatusBadge judged={fo.foi_julgado} /></div><p className="fo-description">{fo.descricao}</p><div className="fo-student"><Icon name="users" /><strong>{student?.nome || `Aluno #${fo.alvo_id}`}</strong>{student && <span>nº {student.numero}</span>}</div><div className="fo-card-footer"><span>{formatDate(fo.data)}<span className="separator">·</span>{instructor ? `${rankName(instructor.posto)} ${instructor.nome}` : `Instrutor #${fo.autor_id}`}</span><Icon name="arrow" /></div></Link>;
}
