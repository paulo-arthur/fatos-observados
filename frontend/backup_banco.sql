--
-- PostgreSQL database dump
--

\restrict H2fBj4JDUyQDiqQehU4iQXIUAOdRI8JRJ0VM2vXAMhUrJsZ96RSlxkXlj9Mek8q

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Perfil; Type: TYPE; Schema: public; Owner: fatos_user
--

CREATE TYPE public."Perfil" AS ENUM (
    'ALUNO',
    'TENENTE',
    'CAPITAO'
);


ALTER TYPE public."Perfil" OWNER TO fatos_user;

--
-- Name: StatusFato; Type: TYPE; Schema: public; Owner: fatos_user
--

CREATE TYPE public."StatusFato" AS ENUM (
    'PENDENTE',
    'JULGADO'
);


ALTER TYPE public."StatusFato" OWNER TO fatos_user;

--
-- Name: tipo_posto; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipo_posto AS ENUM (
    'cap',
    'ten'
);


ALTER TYPE public.tipo_posto OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alunos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alunos (
    id integer NOT NULL,
    nome character varying(30) NOT NULL,
    numero character varying(5) NOT NULL,
    email character varying(60) NOT NULL
);


ALTER TABLE public.alunos OWNER TO postgres;

--
-- Name: alunos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alunos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alunos_id_seq OWNER TO postgres;

--
-- Name: alunos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alunos_id_seq OWNED BY public.alunos.id;


--
-- Name: fos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fos (
    id integer NOT NULL,
    autor_id integer NOT NULL,
    alvo_id integer NOT NULL,
    descricao text NOT NULL,
    foi_julgado boolean DEFAULT false,
    data timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.fos OWNER TO postgres;

--
-- Name: fos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fos_id_seq OWNER TO postgres;

--
-- Name: fos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fos_id_seq OWNED BY public.fos.id;


--
-- Name: instrutores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.instrutores (
    id integer NOT NULL,
    nome character varying(30) NOT NULL,
    posto public.tipo_posto NOT NULL,
    email character varying(60) NOT NULL,
    senha_hash character varying(255) NOT NULL,
    ativo boolean DEFAULT true
);


ALTER TABLE public.instrutores OWNER TO postgres;

--
-- Name: instrutores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.instrutores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.instrutores_id_seq OWNER TO postgres;

--
-- Name: instrutores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.instrutores_id_seq OWNED BY public.instrutores.id;


--
-- Name: alunos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alunos ALTER COLUMN id SET DEFAULT nextval('public.alunos_id_seq'::regclass);


--
-- Name: fos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fos ALTER COLUMN id SET DEFAULT nextval('public.fos_id_seq'::regclass);


--
-- Name: instrutores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instrutores ALTER COLUMN id SET DEFAULT nextval('public.instrutores_id_seq'::regclass);


--
-- Data for Name: alunos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alunos (id, nome, numero, email) FROM stdin;
7	Felipe Ávila Pifano Pontes	26005	aluno.pontes@escolamilitar.br
8	Vitor Duarte Kilim	26007	aluno.kilim@escolamilitar.br
9	Elias de Moura Paiva	26009	paiva.elias@instituicaomilitar.com
10	Vinicius Zanicotti C. Ramos	26059	zanicotti.vinicius@ime.eb.br
11	Gabriel Batista Szpigel	26016	szpigel.gabriel@ime.eb.br
12	Gustavo Holler de Andrade	26023	holler.gustavo@ime.eb.br
13	Ellan Vilanova	26011	vilanova.ellan@ime.eb.br
33	ALICE	26001	alice.lins@ime.eb.br
34	ÁLVARO	26002	alvaro.bonavides@ime.eb.br
35	ARAUJO	26003	Matheus.bruno.2005@gmail.com
36	ÁTILA	26004	atila.jesus@ime.eb.br
37	BORGES	26012	borges.adler@ime.eb.br
38	CHAGAS	26006	chagas.miguel@ime.eb.br
39	CLARA BREDA	26015	clara.breda@ime.eb.br
40	COHEN	26008	cohen.ravi@ime.eb.br
41	CRUZ	26027	cruz.carolina@ime.eb.br
42	ESTEPHAN	26010	estephan.felipe@ime.eb.br
43	GABRIEL DIAS	26032	gabriel.dias@ime.eb.br
44	HUDSON	26013	hudson.murillo@gmail.com
45	JULIA SILVEIRA	26014	julia.silveira@ime.eb.br
46	LIMA	26091	lima.antonio@ime.eb.br
47	LOPES	26017	lopes.joao@ime.eb.br
48	MARCUS MATHEUS	26018	marcus.matheus@ime.eb.br
49	MATHEUS OLIVEIRA	26019	matheus.oliveira@ime.eb.br
50	MENDES	26020	goncalvesmendesgustavo@gmail.com
51	PALHANO	26021	palhano.paulo@ime.eb.br
52	PLÁCIDO	26022	placido.henrique@ime.eb.br
53	RADEMAKER	26024	rademaker.gustavo@ime.eb.br
54	ROCHA	26025	luiz@ime.eb.br
55	RODRIGUES	26026	rodrigues.paulo@ime.eb.br
56	TINOCO	26028	tinoco.bruno@ime.eb.br
57	TOSTES	26029	tostes.felipe@ime.eb.br
58	TRINTA	26030	trinta.tomas@ime.eb.br
59	UEDA	26031	uedamatheus1203@gmail.com
60	ALMEIDA	26033	gustavopagg24@gmail.com
61	RAMOS	26034	apsr1512@gmail.com
62	COTTA	26035	pedrocottaviard@gmail.com
63	AGOSTINHO	26036	agostinho.gabriel@ime.eb.br
64	ALLAN	26037	allan.felipe@ime.eb.br
65	AMERICO	26038	americo.gustavo@ime.eb.br
66	AQUILES	26039	aquiles.souza@ime.eb.br
67	ARAGÃO	26040	aragao.gabriel@ime.eb.br
68	ARRUDA	26041	arruda.carlos@ime.eb.br
69	ASSUNÇÃO	26042	assuncao.miguel@ime.eb.br
70	BASTOS	26043	bastos.heitor@ime.eb.br
71	BECHTINGER	26044	bechtinger.raphael@ime.eb.br
72	BOEIRA	26045	boeira.pedro@ime.eb.br
73	BROCKES	26046	jgbp2506@gmail.com
74	CABRAL	26047	cabral.luiz@ime.eb.br
75	CAMILO	26048	camilo.miguel@ime.eb.br
76	DE MELO	26049	melo.andre@ime.eb.br
77	DEBASTIANI	26050	debastiani.joao@ime.eb.br
78	EDUARDO MIGUEL	26051	oprorioedu10@gmail.com
79	FERNANDES	26052	Nycolas.ferreira222@gmail.com
80	FILGUEIRA	26053	filgueira.guilherme@ime.eb.br
81	GLOVINSKY	26054	glovinsky.rafael@ime.eb.br
82	MAIA	26055	maia.guilherme@ime.eb.br
83	MARIANA	26056	mariana.socol@ime.eb.br
84	MAYRA	26057	mayra.batista@ime.eb.br
85	MENESES	26058	meneses.eduardo@ime.eb.br
86	MUROS	26098	muros.victor@ime.eb.br
87	NATAN	26060	natan.bento@ime.eb.br
88	NUNES	26061	nunes.marianna@ime.eb.br
89	PEDRO CAVALCANTI	26062	pedro.cavalcanti@ime.eb.br
90	RICARDO COELHO	26063	ricardo.coelho@ime.eb.br
91	SANTIAGO	26064	santiago.marcos@ime.eb.br
92	SMITH	26065	smith.heitor@ime.eb.br
93	TARSIS	26066	tarsis.elias@ime.eb.br
94	TSUMURAI	26067	tsumurai.diogo@ime.eb.br
95	ABRAÃO	26068	abraao.damasceno@ime.eb.br
96	ALTINO	26069	altino.nelio@ime.eb.br
97	ARMANDO	26070	armanbarba04@gmail.com
98	BARRETO	26071	barreto.pedro@ime.eb.br
99	BARROS	26072	barros.pedro@ime.eb.br
100	BEZERRA	26073	bezerra.pedro@ime.eb.br
101	CRUZ	26074	cruz.carlos@ime.eb.br
102	CAPRISTO	26075	capristo.guilherme@ime.eb.br
103	CARVALHO	26076	carvalho.mario@ime.eb.br
104	CASTRO	26077	hugocastro7401@gmail.com
105	DA MATTA	26078	matta.miguel@ime.eb.br
106	DANIEL	26079	danielggomes1810@gmail.com
107	FABRÍCIA	26080	fabricia.freitas@ime.eb.br
108	GUIMARAES	26081	guimaraes.cristiano@ime.eb.br
109	GUSTAVO DAVI	26082	gustavo.davi@ime.eb.br
110	JULIANO BEZERRA	26083	juliano.bezerra@ime.eb.br
111	LUCAS ROCHA	26084	lucas.rocha@ime.eb.br
112	MACIEL	26085	maciel.vitor@ime.eb.br
113	MARCUS	26086	marcus.cavalcante@ime.eb.br
114	MARINS	26087	marins.enzo@ime.eb.br
115	MARQUES	26088	lucasmsouza2004@gmail.com
116	MORAIS	26089	morais.jefferson@ime.eb.br
117	NOGUEIRA	26090	nogueira.gabriel@ime.eb.br
118	PIRES	26092	pires.felipe@ime.eb.br
119	PITOL	26093	pitol.joao@ime.eb.br
120	PURPER	26094	purper.yasmin@ime.eb.br
121	RAIHER	26095	raiher.pedro@ime.eb.br
122	SERRANO	26096	serrano.pedro@ime.eb.br
123	SGARBOSSA	26097	sgarbossa.matheus@ime.eb.br
124	WILLIAMS	26099	vjosew1826@gmail.com
\.


--
-- Data for Name: fos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fos (id, autor_id, alvo_id, descricao, foi_julgado, data) FROM stdin;
4	5	9	Por ocasião da passagem do CMT SU pela ala Cel Ricardo Franco, o Alu 1 ano devidamente prestou sua continência, e o CMT SU, por sua vez, prestou a sua continência. O referido aluno julgou a continência do CMT SU, chamando a mesma de 'Continência cachorra', desrespeitando a autoridade presente.	f	2026-10-28 18:23:24.392555-03
5	5	9	O aluno descumpriu a ordem do CMT SU quando o mesmo o ordenou a se dirigir ao Sgte do 5001 e o referido Alu 1 ano não cumpriu missão.	f	2026-10-28 18:26:02.627609-03
6	5	10	O aluno derramou resquícios alimentícios sobre o tablet do Cmt SU.	f	2026-10-28 19:47:03.00194-03
7	5	10	O aluno derramou resquícios alimentícios sobre o tablet do Cmt SU.	f	2026-10-28 23:03:28.043015-03
8	5	12	O aluno descumpriu a ordem do Cmt SU mantendo a música em situação inoportuna. Ademais, realizou gestos obscenos destinados ao Cmt SU	f	2026-10-29 13:55:51.729092-03
9	5	12	Respingou propositalmente água de boca amarela da escova dele no Cmt SU, no SCmt SU e no Sgte do 5001.	f	2026-10-29 13:56:59.706643-03
10	5	13	Por ocasião da presença do Cmt SU no quarto 5004, o aluno deixou de prestar a continência.	f	2026-10-29 17:56:29.617588-03
\.


--
-- Data for Name: instrutores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.instrutores (id, nome, posto, email, senha_hash, ativo) FROM stdin;
5	Felipe Estephan Manso	cap	estephan.felipe@instituicaomilitar.com	$2b$13$czWAzk2y51rCQNGGNsT.t.CmBXRkEwIsB/uFgqGXimcbK2e986kY2	t
6	Palhano	ten	palhano.paulo@ime.eb.br	$2b$13$6Eym5K1DGPojxDnrM9C81e2MjmMbXWg7knUHCzoYbGIgsEVKdiqmS	t
7	Gabriel Dias	ten	gabriel.dias@ime.eb.br	$2b$13$Gfq/LSI6JJ9DiOdfMr6KG.gatGe7mAepqrlmdmSiVi5RU/ArBgqzq	t
8	Tinoco	ten	tinoco.bruno@ime.eb.br	$2b$13$uGfXXqXvpjojncTu1p9eEu.fnOb6dRt82bmV2Z6cqwhpeseTNSjqG	t
9	Lopes	ten	lopes.joao@ime.eb.br	$2b$13$kf8owwH5CySEjwPZyn6lpuNVfvPM553GUVFcIEi8TUdokJI80zZ5y	t
10	Placido	ten	placido.gomes10@gmail.com	$2b$13$d7ooyEvkzUGlaQ/0zYWCRu3KPaOLdOazInzX2LE5oKI3nXPyewSWi	t
\.


--
-- Name: alunos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alunos_id_seq', 124, true);


--
-- Name: fos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fos_id_seq', 10, true);


--
-- Name: instrutores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.instrutores_id_seq', 10, true);


--
-- Name: alunos alunos_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alunos
    ADD CONSTRAINT alunos_email_key UNIQUE (email);


--
-- Name: alunos alunos_numero_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alunos
    ADD CONSTRAINT alunos_numero_key UNIQUE (numero);


--
-- Name: alunos alunos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alunos
    ADD CONSTRAINT alunos_pkey PRIMARY KEY (id);


--
-- Name: fos fos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fos
    ADD CONSTRAINT fos_pkey PRIMARY KEY (id);


--
-- Name: instrutores instrutores_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instrutores
    ADD CONSTRAINT instrutores_email_key UNIQUE (email);


--
-- Name: instrutores instrutores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instrutores
    ADD CONSTRAINT instrutores_pkey PRIMARY KEY (id);


--
-- Name: fos fk_autor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fos
    ADD CONSTRAINT fk_autor FOREIGN KEY (autor_id) REFERENCES public.instrutores(id) ON DELETE RESTRICT;


--
-- Name: fos fk_militar; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fos
    ADD CONSTRAINT fk_militar FOREIGN KEY (alvo_id) REFERENCES public.alunos(id) ON DELETE RESTRICT;


--
-- Name: TABLE alunos; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.alunos TO fatos_user;


--
-- Name: SEQUENCE alunos_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.alunos_id_seq TO fatos_user;


--
-- Name: TABLE fos; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.fos TO fatos_user;


--
-- Name: SEQUENCE fos_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.fos_id_seq TO fatos_user;


--
-- Name: TABLE instrutores; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.instrutores TO fatos_user;


--
-- Name: SEQUENCE instrutores_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.instrutores_id_seq TO fatos_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO fatos_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO fatos_user;


--
-- PostgreSQL database dump complete
--

\unrestrict H2fBj4JDUyQDiqQehU4iQXIUAOdRI8JRJ0VM2vXAMhUrJsZ96RSlxkXlj9Mek8q

