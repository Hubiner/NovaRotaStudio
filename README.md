# Nova Rota Studio

Landing page conceitual para uma agência de branding e desenvolvimento digital, criada como peça de portfólio com foco em apresentação premium, responsividade, clareza comercial e deploy estático simples.

![Preview do projeto](./src/assets/readme/site-preview.svg)

## Sobre o projeto

O objetivo deste site é demonstrar a construção de uma interface institucional sofisticada usando apenas HTML, CSS e JavaScript puros, sem depender de framework ou bundler. A proposta prioriza:

- hierarquia visual forte;
- leitura clara em desktop, tablet e mobile;
- microinterações sutis;
- front-end estático;

## Funcionalidades

- Hero com atmosfera visual premium, CTAs e resumo da proposta.
- Navegação sticky com destaque da seção ativa.
- Menu responsivo com comportamento acessível em telas menores.
- Seções de cases, métricas, serviços, método, depoimentos e contato.
- Contadores animados com respeito a `prefers-reduced-motion`.
- Carrossel de depoimentos com suporte a teclado.
- Estrutura estática pronta para deploy.

## Tecnologias utilizadas

- HTML5 semântico
- CSS3 com variáveis, Grid, Flexbox e media queries
- JavaScript ES Modules
- Google Fonts: Manrope e Syne
- Vercel para hospedagem estática

## Estrutura de pastas

```text
.
|-- index.html
|-- README.md
|-- tests
|   `-- main.test.mjs
|-- vercel.json
`-- src
    |-- assets
    |   `-- readme
    |       `-- site-preview.svg
    |-- scripts
    |   `-- main.mjs
    `-- styles
        `-- main.css
```

## Como clonar o repositório

```bash
git clone URL_DO_REPOSITORIO
cd site-1-agencia
```

## Como rodar localmente

Você pode abrir o arquivo `index.html` diretamente no navegador, mas o ideal é usar um servidor estático local.

Exemplo com Python:

```bash
python -m http.server 4173
```

Depois acesse:

```text
http://127.0.0.1:4173
```

## Como validar o projeto

Verificação de sintaxe do JavaScript:

```bash
node --check src/scripts/main.mjs
```

Verificação das funções utilitárias:

```bash
node tests/main.test.mjs
```

## Build de produção

Este projeto não possui etapa de build. Como é um site estático, a publicação em produção pode ser feita diretamente a partir dos arquivos versionados.

## Autor / créditos

Projeto preparado para apresentação pública de portfólio.

## Licença

~~
