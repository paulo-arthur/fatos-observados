-- Limpa dados anteriores para permitir re-execução sem conflitos de UNIQUE
TRUNCATE TABLE fos, alunos, instrutores RESTART IDENTITY;

-- Inserindo Instrutores (senhas fictícias antes de aplicarmos hash no backend)
INSERT INTO instrutores (nome, posto, email, senha_hash) VALUES
('Carlos Oliveira', 'cap', 'cap.carlos@escolamilitar.br', 'hash_senha_123'),
('Roberto Souza', 'ten', 'ten.roberto@escolamilitar.br', 'hash_senha_456');

-- Inserindo Alunos
INSERT INTO alunos (nome, numero, email) VALUES
('Aluno Silva', '26001', 'aluno.silva@escolamilitar.br'),
('Aluno Santos', '26002', 'aluno.santos@escolamilitar.br'),
('Aluno Ferreira', '26003', 'aluno.ferreira@escolamilitar.br');

-- Inserindo FOs Negativos Iniciais
INSERT INTO fos (autor_id, alvo_id, descricao, foi_julgado) VALUES
(1, 1, 'Atraso de 15 minutos no alinhamento matutino.', FALSE),
(2, 2, 'Apresentação individual incorreta (farda desalinhada).', TRUE);