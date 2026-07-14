// Map initialization script for IBS-CRFS
document.addEventListener('DOMContentLoaded', function() {
    const mapElement = document.getElementById('map');
    const statusEl = document.getElementById('map-status');

    if (!mapElement) {
        console.warn('Map container #map was not found.');
        return;
    }

    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded. Map functionality will not be available.');
        if (mapElement) {
            mapElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; background-color: #f5f5f5; padding: 2rem; text-align: center;"><p style="color: #666;">Map is loading. If the map does not appear, please check your internet connection or try refreshing the page.</p></div>';
        }
        return;
    }

    // Initialize the map centered on Brazil
    const map = L.map('map').setView([-14.235, -51.9253], 4.5);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    const parseCoordinate = (value) => {
        if (value === null || value === undefined) return NaN;
        if (typeof value === 'number') return value;
        const cleaned = String(value).trim().replace(',', '.');
        return Number(cleaned);
    };

    const loadCollectionDataFromScript = (dataUrl) => {
        return new Promise((resolve, reject) => {
            const existing = document.querySelector(`script[data-collection-data="${dataUrl}"]`);
            if (existing) {
                if (Array.isArray(window.COLLECTION_DATA)) {
                    resolve(window.COLLECTION_DATA);
                } else {
                    existing.addEventListener('load', () => resolve(window.COLLECTION_DATA), { once: true });
                    existing.addEventListener('error', () => reject(new Error(`Falha ao carregar dados: ${dataUrl}`)), { once: true });
                }
                return;
            }

            const script = document.createElement('script');
            script.src = dataUrl;
            script.async = false;
            script.dataset.collectionData = dataUrl;
            script.onload = () => resolve(window.COLLECTION_DATA);
            script.onerror = () => reject(new Error(`Falha ao carregar dados: ${dataUrl}`));
            document.head.appendChild(script);
        });
    };

    const getCollectionData = async () => {
        if (Array.isArray(window.COLLECTION_DATA)) return window.COLLECTION_DATA;

        // Allows external sites to define a custom dataset path.
        const dataUrl = window.IBS_MAP_DATA_URL || 'data/collection-data.js';
        await loadCollectionDataFromScript(dataUrl);

        if (!Array.isArray(window.COLLECTION_DATA)) {
            throw new Error('Arquivo de dados carregado, mas COLLECTION_DATA não foi encontrado.');
        }

        return window.COLLECTION_DATA;
    };

    const addMarkersFromData = async () => {
        try {
            if (statusEl) statusEl.textContent = 'Carregando pontos da coleção...';

            const rows = await getCollectionData();
            const markers = [];
            const bounds = L.latLngBounds();

            rows.forEach(row => {
                const lat = parseCoordinate(row.decimalLatitude);
                const lon = parseCoordinate(row.decimalLongitude);
                if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

                const sci = row.scientificName || row.specificEpithet || '';
                const localityParts = [row.stateProvince, row.municipality, row.locality].filter(Boolean).join(' - ');
                const popupContent = `
                    <div class="popup-content">
                        <h3>${row.catalogNumber || 'Sem código'}</h3>
                        <p><strong>Scientific Name:</strong> ${sci || '-'}</p>
                        <p><strong>Order / Family:</strong> ${row.order || '-'} / ${row.family || '-'}</p>
                        <p><strong>Locality:</strong> ${localityParts || '-'}</p>
                        <p><strong>Date:</strong> ${row.eventDate || '-'}</p>
                        <p><strong>Preservação:</strong> ${row.preparations || '-'}</p>
                    </div>
                `;

                const marker = L.circleMarker([lat, lon], {
                    radius: 6,
                    fillColor: '#2c5f2d',
                    color: '#fff',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                }).bindPopup(popupContent);

                markers.push(marker);
                bounds.extend([lat, lon]);
            });

            if (!markers.length) {
                throw new Error('Nenhum ponto válido com coordenadas. Verifique se decimalLatitude e decimalLongitude estão preenchidos corretamente no arquivo de dados.');
            }

            L.layerGroup(markers).addTo(map);
            map.fitBounds(bounds.pad(0.1));

            if (statusEl) statusEl.textContent = `Exibindo ${markers.length} pontos com coordenadas válidas.`;
        } catch (err) {
            console.error(err);
            if (statusEl) statusEl.textContent = err.message || 'Erro ao carregar pontos da coleção.';
        }
    };

    addMarkersFromData();

    // Add scale control
    L.control.scale().addTo(map);
});
