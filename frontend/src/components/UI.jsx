import { useEffect, useId, useRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

export function PageHeader({ eyebrow = 'ACOMPANHAMENTO', title, description, action }) {
  return <header className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="page-description">{description}</p>}</div>{action}</header>;
}

export function Alert({ children, success = false }) {
  return children ? <div className={`alert ${success ? 'success' : ''}`} role={success ? 'status' : 'alert'}>{children}</div> : null;
}

export function ResourceState({ resource, children }) {
  if (resource.loading) return <div className="loading-state" role="status"><span className="spinner" />Carregando informações…</div>;
  if (resource.error) return <div className="error-state"><Alert>{resource.error}</Alert><button className="button secondary" onClick={resource.reload}>Tentar novamente</button></div>;
  return children;
}

export function EmptyState({ title = 'Nenhum registro encontrado', description = 'Os registros aparecerão aqui assim que forem cadastrados.', action }) {
  return <div className="empty-state"><span className="empty-icon"><Icon name="file" /></span><h3>{title}</h3><p>{description}</p>{action}</div>;
}

export function StatusBadge({ judged }) {
  return <span className={`badge ${judged ? 'green' : 'amber'}`}><span className="status-dot" />{judged ? 'Julgado' : 'Pendente'}</span>;
}

export function SearchInput({ value, onChange, placeholder = 'Buscar…' }) {
  return <label className="search-input"><Icon name="search" /><span className="sr-only">{placeholder}</span><input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

export function BackLink({ to, children }) {
  return <Link className="back-link" to={to}><Icon name="back" />{children}</Link>;
}

export function Modal({ title, description, onClose, children }) {
  const ref = useRef(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    dialog.showModal();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = originalOverflow;
      previous?.focus();
    };
  }, []);
  return <dialog ref={ref} className="modal" aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="modal-content"><div className="modal-heading"><div><p className="eyebrow">FATOS OBSERVADOS</p><h2 id={titleId}>{title}</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Fechar"><Icon name="close" /></button></div>{description && <p className="muted">{description}</p>}{children}</div></dialog>;
}
