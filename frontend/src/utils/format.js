export function errorMessage(error) {
  if (!error.response) return error.message && !error.isAxiosError
    ? error.message : 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
  const { status, data } = error.response;
  if (status === 401) return 'E-mail ou senha incorretos, ou conta inativa.';
  if (status === 403) return data?.error === 'Invalid or expired token.'
    ? 'Sua sessão expirou. Entre novamente.' : 'Você não tem permissão para realizar esta ação.';
  if (status >= 500) return 'O servidor não conseguiu concluir a operação. Tente novamente em instantes.';
  const message = data?.erro || data?.error || data?.status;
  const translations = {
    'This email is already registered.': 'Este e-mail já está cadastrado.',
    'This FO has already been judged.': 'Este fato observado já foi julgado.',
    'The password must be at least 6 characters long.': 'A senha deve ter pelo menos 6 caracteres.',
    'Invalid email format.': 'Informe um e-mail válido.',
    'This student was not found.': 'Aluno não encontrado.',
    'Instructor not found.': 'Instrutor não encontrado.',
    'FO not found.': 'Fato observado não encontrado.',
  };
  return translations[message] || message || 'Não foi possível concluir a operação.';
}

export function formatDate(value, withTime = false) {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return 'Data não informada';
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short', ...(withTime ? { timeStyle: 'short' } : {}),
  }).format(date);
}

export function rankName(rank) {
  return rank === 'cap' ? 'Capitão' : rank === 'ten' ? 'Tenente' : rank;
}

export function initials(name = '') {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

export function matches(search, ...values) {
  const normalize = (value) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  return normalize(values.join(' ')).includes(normalize(search));
}
