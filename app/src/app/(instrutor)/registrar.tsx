import { useSession } from '../../auth/SessionProvider';
import { RoleHome } from '../../components/RoleHome';

export default function InstrutorScreen() {
  const { session } = useSession();
  return (
    <RoleHome
      title="Área do instrutor"
      description="Seu acesso está ativo. O registro de Fatos Observados será disponibilizado aqui."
      showCaptainLink={session?.usuario.perfil === 'CAPITAO'}
    />
  );
}
