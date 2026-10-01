# ✈️ SPOT — Sistema de Gerenciamento de Viagens

## 📌 Sobre o projeto

O **SPOT** é um sistema desenvolvido para o gerenciamento de uma agência de viagens, permitindo o cadastro, consulta, alteração e exclusão de informações relacionadas aos pacotes de viagem.

O projeto foi desenvolvido seguindo uma organização baseada no padrão **MVC (Model-View-Controller)**, utilizando **Node.js** e **Express** no backend, **PostgreSQL** para armazenamento dos dados e **HTML, CSS e JavaScript** no frontend.

## 🎯 Objetivo

O objetivo do projeto é desenvolver um sistema para auxiliar no gerenciamento de uma agência de viagens, organizando informações como:

- Pacotes de viagem;
- Destinos;
- Categorias;
- Clientes;
- Funcionários;
- Pessoas;
- Cargos.

## 🛠️ Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- PostgreSQL
- Multer
- Sharp
- dotenv
- CORS

## ⚙️ Funcionalidades

### 📦 Pacotes de viagem

O sistema permite:

- Cadastrar pacotes;
- Consultar pacotes pelo ID;
- Alterar dados dos pacotes;
- Excluir pacotes;
- Informar destino, descrição, categoria, preço e estoque;
- Adicionar imagens aos pacotes.

### 🏷️ Categorias

Permite o gerenciamento das categorias utilizadas para organizar os pacotes de viagem.

### 👥 Cadastros

O sistema possui módulos para gerenciamento de:

- Clientes;
- Funcionários;
- Pessoas;
- Cargos;
- Categorias;
- Pacotes de viagem.

## 🗄️ Banco de dados

O projeto utiliza **PostgreSQL** para armazenar os dados do sistema.

Entre as principais tabelas estão:

- `pacote`
- `categoria`
- `cliente`
- `funcionario`
- `pessoa`
- `cargo`

O projeto possui, na pasta `documentacao`, o arquivo SQL utilizado para a criação e configuração do banco de dados.

## 🖼️ Upload de imagens

O sistema utiliza **Multer** para receber as imagens enviadas pelo usuário e **Sharp** para realizar o processamento das imagens e convertê-las para o formato PNG.

As imagens dos pacotes são armazenadas utilizando o **ID do pacote** como identificação.

## 📁 Estrutura do projeto

```text
juliana_3bim_spot/
├── backend/
│   ├── controllers/
│   └── routes/
│
├── documentacao/
│
├── frontend/
│   ├── cargo/
│   │   ├── cargo.css
│   │   ├── cargo.html
│   │   └── cargo.js
│   │
│   ├── categoria/
│   │   ├── categoria.css
│   │   ├── categoria.html
│   │   └── categoria.js
│   │
│   ├── menu/
│   │   ├── menu.css
│   │   ├── menu.html
│   │   └── menu.js
│   │
│   ├── pacote/
│   │   ├── pacote.css
│   │   ├── pacote.html
│   │   └── pacote.js
│   │
│   └── pessoa/
│       ├── pessoa.css
│       ├── pessoa.html
│       └── pessoa.js
│
├── imagens/
└── README.md
```

## 🚀 Como executar o projeto

### 1. Instalar as dependências

No terminal, dentro da pasta do projeto, execute:

```bash
npm install
```

### 2. Configurar o banco de dados

É necessário possuir o **PostgreSQL** instalado e configurado.

O projeto possui um arquivo SQL na pasta `documentacao`:

```text
documentacao/spot_projeto_dw1.sql
```

Esse arquivo pode ser utilizado para criar e configurar o banco de dados do projeto.

Também é necessário configurar o arquivo `.env` dentro da pasta `backend`.

Exemplo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nome_do_banco
DB_USER=postgres
DB_PASSWORD=sua_senha
PORT=3001
```

### 3. Executar o servidor

Entre na pasta `backend`:

```bash
cd backend
```

Depois, execute:

```bash
node server.js
```

O servidor será executado na porta **3001**:

```text
http://localhost:3001
```

## 📚 Documentação

A pasta `documentacao` contém arquivos utilizados durante o desenvolvimento do projeto, incluindo:

- Instruções para criação de novos CRUDs;
- Script SQL do banco de dados;
- Esquema do banco de dados;
- Materiais utilizados durante o desenvolvimento.

## 👩‍💻 Desenvolvido por

**Juliana Coga — M32 | 2026**