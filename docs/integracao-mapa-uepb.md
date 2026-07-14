# Handoff tecnico - Mapa interativo IBS-CRFS para site institucional UEPB

## Objetivo
Integrar o mapa interativo da colecao IBS-CRFS em uma pagina do site institucional da UEPB, com atualizacao simples de dados.

## Arquivos necessarios
- `js/map.js`
- `data/collection-data.js`
- `css/style.css` (somente os blocos de estilo do mapa, se nao forem importar o CSS inteiro)
- `map.html` (apenas como referencia de estrutura)

## Dependencias externas
- Leaflet CSS: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css`
- Leaflet JS: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js`

## Estrutura HTML minima
Inserir na pagina de destino um bloco equivalente a:

```html
<section class="map-section">
  <div class="map-info">
    <p>Este mapa mostra os pontos de coleta da colecao.</p>
    <p id="map-status" class="table-meta" aria-live="polite"></p>
  </div>
  <div id="map"></div>
</section>
```

## Ordem de carregamento dos scripts
Recomendacao de ordem (mais segura):

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script src="/caminho/data/collection-data.js"></script>
<script src="/caminho/js/map.js"></script>
```

Observacao: o `map.js` agora consegue carregar `collection-data.js` automaticamente quando `window.COLLECTION_DATA` ainda nao estiver definido.

## Configuracao de caminho dos dados (importante para portal institucional)
Caso o arquivo de dados esteja em outro caminho no site da UEPB, definir antes de carregar `map.js`:

```html
<script>
  window.IBS_MAP_DATA_URL = "/assets/ibs/data/collection-data.js";
</script>
<script src="/assets/ibs/js/map.js"></script>
```

Sem essa configuracao, o caminho padrao usado e `data/collection-data.js`.

## Estilos minimos recomendados
Se nao importarem todo o `style.css`, incluir ao menos:

```css
.map-section {
  padding: 2rem 0;
}

.map-info {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

#map {
  height: 500px;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  #map {
    height: 400px;
  }
}
```

## Como os dados sao atualizados
1. O arquivo fonte da colecao (`data/colecao.csv`) fica apenas local.
2. Gerar o bundle publicado com:

```bash
python scripts/build_collection.py
```

3. O comando atualiza `data/collection-data.js`.
4. Para publicar dados novos no site institucional, basta substituir o arquivo `collection-data.js` no servidor.

## Campos esperados no bundle
Cada registro em `window.COLLECTION_DATA` deve conter:
- `catalogNumber`
- `order`
- `family`
- `genus`
- `scientificName`
- `specificEpithet`
- `stateProvince`
- `municipality`
- `locality`
- `eventDate`
- `preparations`
- `decimalLatitude`
- `decimalLongitude`

## Comportamento do mapa
- Centro inicial: Brasil.
- Base cartografica: OpenStreetMap.
- Marker: `circleMarker` por registro com coordenadas validas.
- Popup: codigo da colecao, nome cientifico, ordem/familia, localidade, data e preparacao.
- Auto enquadramento: ajusta zoom para caber todos os pontos validos.

## Checklist de validacao para TI
- [ ] A pagina carrega Leaflet sem erro no console.
- [ ] O elemento `#map` existe na pagina.
- [ ] `window.COLLECTION_DATA` esta definido ou `window.IBS_MAP_DATA_URL` aponta para um arquivo valido.
- [ ] O mapa exibe pontos e popups ao clique.
- [ ] O texto de status informa a quantidade de pontos validos.
- [ ] Em mobile, a altura do mapa fica adequada.

## Troubleshooting rapido
- Mapa em branco: verificar se o elemento `#map` existe na pagina final renderizada pelo CMS.
- Erro de dados nao carregados: definir `window.IBS_MAP_DATA_URL` com o caminho real do `collection-data.js` no portal.
- Sem pontos: conferir se `collection-data.js` tem registros e coordenadas numericas.
- Erro de CORS/CDN: validar politica de carregamento externo do portal.
- Popup quebrado: conferir codificacao UTF-8 dos arquivos.

## Contato tecnico
Repositorio de referencia: `nathanufpb/IBS-CRFS.github.io`
Arquivos de referencia principal:
- `map.html`
- `js/map.js`
- `scripts/build_collection.py`
- `data/collection-data.js`
