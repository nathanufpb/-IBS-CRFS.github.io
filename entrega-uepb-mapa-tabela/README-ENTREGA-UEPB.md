# Entrega UEPB - Mapa Interativo + Tabela da Colecao

## Conteudo desta pasta

### Arquivos PRINCIPAIS para a TI (use estes, nao os arquivos originais)
- `standalone-mapa.html`: pagina do mapa interativo, independente, pronta para integrar.
- `standalone-tabela.html`: pagina da tabela navegavel, independente, pronta para integrar.
- `standalone-video.html`: pagina do video institucional, independente, pronta para integrar.
- `css/ibs-components.css`: estilos isolados para mapa, tabela e video (sem conflitos com o portal).
- `js/map.js`: logica do mapa interativo.
- `data/collection-data.js`: dados da colecao (gerado localmente, sem expor o CSV original).
- `media/video-institucional.mp4`: video institucional (4.7 MB, MP4).
- `leaflet/leaflet.css` e `leaflet/leaflet.js`: Leaflet embutido localmente (sem dependencia de CDN).

### Arquivos de referencia (nao necessarios para integracao)
- `map.html`, `collection.html`, `index.html`: paginas originais do site IBS-CRFS.
- `css/style.css`: CSS completo do site original.
- `js/main.js`: JS geral do site original.
- `scripts/build_collection.py`: script Python para atualizar os dados.
- `docs/integracao-mapa-uepb.md`: guia tecnico detalhado.

## Video institucional
O arquivo `media/video-institucional.mp4` (4.7 MB, formato MP4) é exibido na pagina principal (`index.html`) como video HTML5 nativo, sem dependencias externas.

Titulo do video:
> Predatory behavior of pseudoscorpion over Troglobius brasiliensis at the species Type Locality

Descricao:
> Registro de predacao: adulto de Troglobius brasiliensis (Collembola: Paronellidae) sendo predado por ninfa de Spelaeochernes altamirae (Pseudoscorpiones: Chernetidae), na Gruta do Limoeiro, Para, Brasil (localidade tipo de Troglobius brasiliensis).

Para inserir no portal da UEPB, basta copiar o arquivo MP4 para o servidor e referenciar com a tag HTML:

```html
<video controls style="width:100%; max-width:800px;">
  <source src="/caminho/no/servidor/video-institucional.mp4" type="video/mp4">
  Seu navegador nao suporta o elemento de video.
</video>
```

## Confirmacao importante
Sim, existe tabela navegavel da colecao.
Ela esta em `collection.html` e usa os elementos:
- `#collection-search`
- `#collection-table`
- `#collection-meta`
- `#collection-status`

## Dependencias externas
- Leaflet CSS: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css`
- Leaflet JS: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js`

## Integracao rapida no portal institucional

### Mapa interativo
1. Copiar para o servidor: `js/map.js`, `data/collection-data.js`, `leaflet/`, `css/ibs-components.css`.
2. No HTML do portal, incluir:

```html
<link rel="stylesheet" href="/caminho/leaflet/leaflet.css" />
<link rel="stylesheet" href="/caminho/css/ibs-components.css" />

<div class="ibs-root">
  <div class="ibs-map-info">
    <p>Este mapa mostra os pontos de coleta da colecao IBS-CRFS.</p>
    <p id="map-status" class="ibs-map-status" aria-live="polite"></p>
  </div>
  <div id="map" style="height:500px; width:100%;"></div>
</div>

<script src="/caminho/leaflet/leaflet.js"></script>
<script src="/caminho/data/collection-data.js"></script>
<script src="/caminho/js/map.js"></script>
```

### Tabela navegavel
Usar o arquivo `standalone-tabela.html` como referencia ou copiar o bloco indicado dentro do HTML.

### Video institucional
Usar o arquivo `standalone-video.html` como referencia ou copiar o bloco indicado dentro do HTML.
Ajustar o caminho `src` do video para o local correto no servidor.

### Se o portal nao aceitar scripts externos (CDN bloqueado)
O Leaflet ja esta incluido localmente na pasta `leaflet/`. Use os caminhos relativos acima.

### Se o caminho do arquivo de dados for diferente no portal
Antes de carregar `map.js`, adicionar:

```html
<script>window.IBS_MAP_DATA_URL = "/novo/caminho/collection-data.js";</script>
```

## Atualizacao de dados (sem publicar CSV)
1. Atualizar localmente o CSV da colecao.
2. Rodar:

```bash
python scripts/build_collection.py
```

3. Entregar para a TI apenas o novo arquivo `data/collection-data.js`.

## Repositorio de Dados no Zenodo

**Instituto de Biologia do Solo e Colecao de Referencia da Fauna de Solos - Repositorio de Dados**

DOI: https://doi.org/10.5281/zenodo.19055009

Este repositorio publico no Zenodo contem dados e arquivos provenientes dos ultimos artigos publicados pelo Instituto de Biologia do Solo (IBS-CRFS), incluindo:
- Dados taxonomicos e de coleta associados aos trabalhos publicados.
- Arquivos suplementares dos artigos recentes do grupo de pesquisa.
- Informacoes de acesso aberto para reproducibilidade cientifica.

O repositorio pode ser citado e referenciado pela equipe de TI ao inserir as informaçẽos sobre publicações do instituto no portal institucional da UEPB, garantindo rastreabilidade da origem dos dados exibidos.

## Teste local antes de enviar para o servidor da UEPB
Na raiz desta pasta, rodar:

```bash
python3 -m http.server 8000
```

Abrir no navegador:
- `http://127.0.0.1:8000/standalone-mapa.html`
- `http://127.0.0.1:8000/standalone-tabela.html`
- `http://127.0.0.1:8000/standalone-video.html`
