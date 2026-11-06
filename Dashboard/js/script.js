// Inicializa o mapa centralizado na região das lixeiras
const map = L.map('map').setView([-23.550520, -46.633308], 14);

const apiKey = "cb1_53kd_1_64d5f5156f721f4711de66e8";

// Mapeamento usando o estilo Voyager/Dark do CartoDB
L.tileLayer(`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${apiKey}`, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// Lista de canais cadastrados
const lixeirasCanais = [
    { 
        id: 3569124, 
        nome: "Lixeira Praça da Sé 1", 
        readApiKey: "S3S8LMW0Q7H4L34C" 
    }
];

let marcadores = {};

async function atualizarMapaECards() {
    const container = document.getElementById('cards-container');
    container.innerHTML = ""; // Limpa os cards para atualizar os dados

    for (let lixeira of lixeirasCanais) {
        const url = `https://api.thingspeak.com/channels/${lixeira.id}/feeds/last.json?api_key=${lixeira.readApiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            // Ordem dos fields: field1 = nível | field2 = latitude | field3 = longitude
            const nivel = data.field1 !== undefined ? parseInt(data.field1) : 0;
            const lat = parseFloat(data.field2);
            const lon = parseFloat(data.field3);

            const isCheia = nivel >= 80;
            const statusTexto = isCheia ? "🔴 CHEIA" : "🟢 Normal";

            // Cria ou atualiza o marcador no mapa
            if (!isNaN(lat) && !isNaN(lon)) {
                const popupContent = `<b>${lixeira.nome}</b><br>Status: ${statusTexto}<br>Ocupação: ${nivel}%`;

                if (marcadores[lixeira.id]) {
                    marcadores[lixeira.id].setLatLng([lat, lon]);
                    marcadores[lixeira.id].setPopupContent(popupContent);
                } else {
                    const marker = L.marker([lat, lon]).addTo(map)
                        .bindPopup(popupContent);
                    marcadores[lixeira.id] = marker;
                }
            }

            // Cria o card dentro do container escuro
            const cardDiv = document.createElement('div');
            cardDiv.className = `card ${isCheia ? 'cheia' : ''}`;
            cardDiv.innerHTML = `
                <div class="card-info">
                    <h3>${lixeira.nome}</h3>
                    <p><strong>Nível:</strong> ${nivel}%</p>
                    <p><strong>Lat:</strong> ${!isNaN(lat) ? lat.toFixed(5) : 'N/A'}</p>
                    <p><strong>Lon:</strong> ${!isNaN(lon) ? lon.toFixed(5) : 'N/A'}</p>
                </div>
                <div class="card-status">
                    ${statusTexto}
                </div>
            `;
            container.appendChild(cardDiv);

        } catch (error) {
            console.error(`Erro ao buscar dados da lixeira ${lixeira.id}:`, error);
        }
    }
}

// Atualização automática a cada 20 segundos
setInterval(atualizarMapaECards, 20000);
atualizarMapaECards(); // Chamada inicial