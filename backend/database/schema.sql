CREATE TYPE tipo_posto AS ENUM ('cap', 'ten');

CREATE TABLE instrutores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(30) NOT NULL,
    posto tipo_posto NOT NULL,
    email VARCHAR(60) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE
);

CREATE TABLE alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(30) NOT NULL,
    numero VARCHAR(5) UNIQUE NOT NULL,
    email VARCHAR(60) UNIQUE NOT NULL
);

CREATE TABLE fos (
    id SERIAL PRIMARY KEY,
    autor_id INT NOT NULL,
    alvo_id INT NOT NULL,
    descricao TEXT NOT NULL,
    foi_julgado BOOLEAN DEFAULT FALSE,
    data TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_autor FOREIGN KEY (autor_id) REFERENCES instrutores(id) ON DELETE RESTRICT,
    CONSTRAINT fk_militar FOREIGN KEY (alvo_id) REFERENCES alunos(id) ON DELETE RESTRICT
);