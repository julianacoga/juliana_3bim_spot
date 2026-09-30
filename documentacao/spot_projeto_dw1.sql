DROP TABLE IF EXISTS public.pacote CASCADE;
DROP TABLE IF EXISTS public.categoria CASCADE;
DROP TABLE IF EXISTS public.funcionario CASCADE;
DROP TABLE IF EXISTS public.cliente CASCADE;
DROP TABLE IF EXISTS public.cargo CASCADE;
DROP TABLE IF EXISTS public.pessoa CASCADE;

-- =========================================================
-- PESSOA
-- =========================================================

CREATE TABLE public.pessoa (
    cpf_pessoa varchar(14) NOT NULL,
    nome_pessoa varchar(100),
    data_nascimento_pessoa date,
    email_pessoa varchar(100),
    telefone_pessoa varchar(20)
);

-- =========================================================
-- CARGO
-- =========================================================

CREATE TABLE public.cargo (
    id_cargo integer NOT NULL,
    nome_cargo varchar(50)
);

-- =========================================================
-- CLIENTE
-- =========================================================

CREATE TABLE public.cliente (
    cpf_pessoa varchar(14) NOT NULL,
    data_cadastro date
);

-- =========================================================
-- FUNCIONARIO
-- =========================================================

CREATE TABLE public.funcionario (
    cpf_pessoa varchar(14) NOT NULL,
    id_cargo integer,
    salario double precision,
    comissao double precision
);

-- =========================================================
-- CATEGORIA
-- =========================================================

CREATE TABLE public.categoria (
    id_categoria integer NOT NULL,
    nome varchar(50),
    descricao text
);

-- =========================================================
-- PACOTE
-- =========================================================

CREATE TABLE public.pacote (
    id_pacote integer NOT NULL,
    destino varchar(100),
    foto varchar(255),
    descricao text,
    id_categoria integer,
    preco numeric(10,2),
    estoque integer
);

-- =========================================================
-- SEQUÊNCIAS
-- =========================================================

CREATE SEQUENCE public.cargo_id_cargo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.categoria_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE SEQUENCE public.pacote_id_pacote_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- =========================================================
-- DEFAULTS
-- =========================================================

ALTER TABLE ONLY public.cargo
    ALTER COLUMN id_cargo
    SET DEFAULT nextval('public.cargo_id_cargo_seq'::regclass);

ALTER TABLE ONLY public.categoria
    ALTER COLUMN id_categoria
    SET DEFAULT nextval('public.categoria_id_categoria_seq'::regclass);

ALTER TABLE ONLY public.pacote
    ALTER COLUMN id_pacote
    SET DEFAULT nextval('public.pacote_id_pacote_seq'::regclass);

-- =========================================================
-- CHAVES PRIMÁRIAS
-- =========================================================

ALTER TABLE ONLY public.pessoa
    ADD CONSTRAINT pessoa_pkey PRIMARY KEY (cpf_pessoa);

ALTER TABLE ONLY public.cargo
    ADD CONSTRAINT cargo_pkey PRIMARY KEY (id_cargo);

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (cpf_pessoa);

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_pkey PRIMARY KEY (cpf_pessoa);

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id_categoria);

ALTER TABLE ONLY public.pacote
    ADD CONSTRAINT pacote_pkey PRIMARY KEY (id_pacote);

-- =========================================================
-- CHAVES ESTRANGEIRAS
-- =========================================================

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pessoa_fkey
    FOREIGN KEY (cpf_pessoa)
    REFERENCES public.pessoa(cpf_pessoa);

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_pessoa_fkey
    FOREIGN KEY (cpf_pessoa)
    REFERENCES public.pessoa(cpf_pessoa);

ALTER TABLE ONLY public.funcionario
    ADD CONSTRAINT funcionario_cargo_fkey
    FOREIGN KEY (id_cargo)
    REFERENCES public.cargo(id_cargo);

ALTER TABLE ONLY public.pacote
    ADD CONSTRAINT pacote_categoria_fkey
    FOREIGN KEY (id_categoria)
    REFERENCES public.categoria(id_categoria);

-- =========================================================
-- UNIQUE
-- =========================================================

ALTER TABLE ONLY public.pessoa
    ADD CONSTRAINT pessoa_email_unique UNIQUE (email_pessoa);

-- =========================================================
-- PESSOA
-- =========================================================

INSERT INTO public.pessoa
    (cpf_pessoa, nome_pessoa, data_nascimento_pessoa, email_pessoa, telefone_pessoa)
VALUES
    ('52984731605', 'Mariana Oliveira', '1998-03-17', 'mariana.oliveira@email.com', '(44) 99821-4736'),
    ('71426389502', 'Gabriel Martins', '1995-07-29', 'gabriel.martins@email.com', '(45) 99174-2853'),
    ('38695142780', 'Beatriz Almeida', '2001-11-08', 'beatriz.almeida@email.com', '(41) 99732-6148'),
    ('84271563904', 'Rafael Carvalho', '1990-02-24', 'rafael.carvalho@email.com', '(44) 99918-5264'),
    ('67139482507', 'Camila Rodrigues', '1997-09-12', 'camila.rodrigues@email.com', '(43) 99845-7312'),
    ('29563847106', 'Lucas Ferreira', '1993-05-31', 'lucas.ferreira@email.com', '(44) 99126-8047'),
    ('45381729604', 'Isabela Mendes', '2000-01-19', 'isabela.mendes@email.com', '(42) 99638-1574'),
    ('91852463701', 'Thiago Moreira', '1988-12-05', 'thiago.moreira@email.com', '(44) 99751-3628'),
    ('63729154803', 'Letícia Barbosa', '1996-06-23', 'leticia.barbosa@email.com', '(45) 99284-6137'),
    ('28574631908', 'Eduardo Nascimento', '1991-10-14', 'eduardo.nascimento@email.com', '(44) 99863-4251');

-- =========================================================
-- CLIENTE
-- =========================================================

INSERT INTO public.cliente
    (cpf_pessoa, data_cadastro)
VALUES
    ('52984731605', '2026-01-12'),
    ('71426389502', '2026-01-18'),
    ('38695142780', '2026-02-03'),
    ('84271563904', '2026-02-21'),
    ('67139482507', '2026-03-07'),
    ('29563847106', '2026-03-19'),
    ('45381729604', '2026-04-02'),
    ('91852463701', '2026-04-16'),
    ('63729154803', '2026-05-11'),
    ('28574631908', '2026-06-04');

-- =========================================================
-- CARGO
-- =========================================================

INSERT INTO public.cargo
    (id_cargo, nome_cargo)
VALUES
    (1, 'Consultor de Viagens'),
    (2, 'Agente de Viagens'),
    (3, 'Gerente Comercial'),
    (4, 'Atendente'),
    (5, 'Assistente Administrativo'),
    (6, 'Analista de Turismo'),
    (7, 'Coordenador de Viagens'),
    (8, 'Consultor de Intercâmbio'),
    (9, 'Especialista em Reservas'),
    (10, 'Supervisor Comercial');

-- =========================================================
-- FUNCIONARIO
-- =========================================================

INSERT INTO public.funcionario
    (cpf_pessoa, id_cargo, salario, comissao)
VALUES
    ('52984731605', 3, 5200.00, 8.00),
    ('71426389502', 1, 3200.00, 6.50),
    ('38695142780', 4, 2450.00, 3.00),
    ('84271563904', 2, 3500.00, 7.00),
    ('67139482507', 6, 4100.00, 5.00),
    ('29563847106', 5, 2850.00, 2.50),
    ('45381729604', 8, 3900.00, 6.00),
    ('91852463701', 7, 4700.00, 7.50),
    ('63729154803', 9, 3300.00, 5.50),
    ('28574631908', 10, 4500.00, 8.00);

-- =========================================================
-- CATEGORIA
-- =========================================================

INSERT INTO public.categoria
    (id_categoria, nome, descricao)
VALUES
    (1, 'Praia',
     'Dias de descanso, mergulhos, pôr do sol e momentos inesquecíveis à beira-mar.'),

    (2, 'Montanha',
     'Paisagens impressionantes, clima agradável e contato com cenários de altitude.'),

    (3, 'Inverno',
     'Dias de neve, aventuras geladas, paisagens encantadoras e experiências típicas do inverno.'),

    (4, 'Aventura',
     'Viagens voltadas para trilhas, esportes e atividades ao ar livre.'),

    (5, 'Cultural',
     'Novos sabores, tradições, histórias e encontros que aproximam você de outras culturas.'),

    (6, 'Romântica',
     'Momentos especiais, experiências a dois e memórias para guardar para sempre.'),

    (7, 'Ecoturismo',
     'Contato com a natureza, novas descobertas e experiências que deixam boas lembranças.'),

    (8, 'Intercâmbio',
     'Novas amizades, descobertas, independência e uma verdadeira imersão em outra cultura.'),

    (9, 'Europa',
     'Cidades históricas, experiências gastronômicas, descobertas culturais e lugares que parecem saídos de um filme.'),

    (10, 'Cidade',
     'Passeios, compras, gastronomia, vida noturna e tudo o que uma grande cidade tem para oferecer.');

-- =========================================================
-- PACOTE
-- =========================================================

INSERT INTO public.pacote
    (destino, foto, descricao, id_categoria, preco, estoque)
VALUES
    (
        'Tóquio',
        '1.png',
        'Experiência pela capital japonesa, com templos, bairros tradicionais, tecnologia, gastronomia e atrações modernas.',
        10,
        8999.90,
        10
    ),
    (
        'Nova York',
        '2.png',
        'Experiência urbana pela cidade de Nova York, com atrações turísticas, cultura, gastronomia e compras.',
        10,
        7499.90,
        8
    ),
    (
        'Paris',
        '3.png',
        'Viagem pela capital francesa, com museus, monumentos históricos, gastronomia e atrações culturais.',
        9,
        6799.90,
        12
    ),
    (
        'Roma',
        '4.png',
        'Viagem cultural pela capital italiana, com monumentos históricos, museus, arquitetura e gastronomia.',
        9,
        5999.90,
        15
    ),
    (
        'Bariloche',
        '5.png',
        'Destino na Patagônia argentina com paisagens de montanha, lagos, neve e atividades de inverno.',
        3,
        4299.90,
        10
    ),
    (
        'Santiago',
        '6.png',
        'Viagem pela capital chilena, com atrações urbanas, gastronomia e paisagens da Cordilheira dos Andes.',
        2,
        3899.90,
        14
    ),
    (
        'Cartagena',
        '7.png',
        'Destino colombiano com praias, centro histórico, arquitetura colonial e cultura caribenha.',
        1,
        3499.90,
        9
    ),
    (
        'Seul',
        '8.png',
        'Experiência pela capital sul-coreana, combinando tradição, tecnologia, gastronomia e cultura contemporânea.',
        5,
        8299.90,
        7
    ),
    (
        'Lençóis Maranhenses',
        '9.png',
        'Destino de natureza com grandes dunas, lagoas de água cristalina e paisagens únicas.',
        7,
        2199.90,
        20
    ),
    (
        'Gramado',
        '10.png',
        'Destino de serra com arquitetura característica, gastronomia, atrações turísticas e clima ameno.',
        2,
        2499.90,
        18
    ),
    (
        'Rio de Janeiro',
        '11.png',
        'Destino brasileiro com praias, paisagens naturais, pontos turísticos e diversas opções de lazer.',
        1,
        2799.90,
        16
    ),
    (
        'Singapura',
        '12.png',
        'Experiência internacional em uma cidade moderna, com arquitetura, tecnologia, gastronomia e atrações culturais.',
        10,
        9199.90,
        6
    );
