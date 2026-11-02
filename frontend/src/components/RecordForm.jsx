import { useState } from 'react';
import { api } from '../api/axios.js';
import useAuth from '../hooks/useAuth.js';
import { errorMessage } from '../utils/format.js';
import { Alert, Modal } from './UI.jsx';

export default function RecordForm({ type, students = [], onClose, onSuccess }) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isFO = type === 'fo';
  const isInstructor = type === 'instructor';
  const title = isFO ? 'Novo fato observado' : isInstructor ? 'Novo instrutor' : 'Novo aluno';

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const payload = isFO ? {
      authorId: user.id,
      targetId: Number(form.get('targetId')),
      description: form.get('description').trim(),
    } : {
      name: form.get('name').trim(),
      email: form.get('email').trim().toLowerCase(),
      ...(isInstructor ? { rank: form.get('rank'), password: form.get('password').trim() } : { number: form.get('number').trim() }),
    };
    if (Object.values(payload).some((value) => !value)) {
      setError('Preencha todos os campos. Não são aceitos campos apenas com espaços.');
      return;
    }
    if (isInstructor && payload.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await api.post(isFO ? '/fos' : isInstructor ? '/instructors' : '/students', payload);
      onSuccess(`${isFO ? 'Fato observado registrado' : isInstructor ? 'Instrutor cadastrado' : 'Aluno cadastrado'} com sucesso.`);
    } catch (error) { setError(errorMessage(error)); }
    finally { setBusy(false); }
  }

  return <Modal title={title} description={isFO ? 'Descreva o ocorrido com clareza. Você será identificado como autor do registro.' : 'Preencha os dados para realizar o cadastro.'} onClose={() => { if (!busy) onClose(); }}><form onSubmit={submit} className="form-stack"><Alert>{error}</Alert><fieldset disabled={busy}>
    {isFO ? <><label>Aluno<select name="targetId" defaultValue="" required><option value="" disabled>Selecione um aluno</option>{students.map((student) => <option key={student.id} value={student.id}>{student.numero} · {student.nome}</option>)}</select></label><label>Descrição do fato<textarea name="description" rows={6} required placeholder="O que foi observado?" /></label><div className="form-note">Autor: {user.name} · O registro será criado como pendente de julgamento.</div></> : <><label>Nome completo<input name="name" autoComplete="name" maxLength={30} required placeholder={isInstructor ? 'Nome do instrutor' : 'Nome do aluno'} /></label><div className="form-row">{isInstructor ? <label>Posto<select name="rank" defaultValue="ten" required><option value="ten">Tenente</option><option value="cap">Capitão</option></select></label> : <label>Número do aluno<input name="number" maxLength={5} required placeholder="Ex.: 26001" /></label>}<label>E-mail<input type="email" name="email" autoComplete="email" maxLength={60} required placeholder="email@instituicao.br" /></label></div>{isInstructor && <label>Senha inicial<input name="password" type="password" autoComplete="new-password" minLength={6} required placeholder="No mínimo 6 caracteres" /></label>}</>}
    <div className="modal-actions"><button type="button" className="button secondary" onClick={onClose}>Cancelar</button><button className="button" disabled={busy}>{busy ? 'Salvando…' : isFO ? 'Registrar fato' : 'Cadastrar'}</button></div>
  </fieldset></form></Modal>;
}
