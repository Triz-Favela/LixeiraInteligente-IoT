# Sistema de Monitoramento para Lixeira Inteligente

Este projeto consiste em um sistema completo de Internet das Coisas (IoT) para o monitoramento em tempo real do nível de preenchimento e da localização geográfica de pontos de entrega voluntária (PEVs) de resíduos.

---

## 🏗️ Arquitetura do Projeto

O sistema divide-se em duas frentes principais:
1. **Hardware (Firmware embarcado):** Dispositivo baseado em **ESP32**, equipado com um sensor ultrassônico (HC-SR04) para medir a distância do lixo em relação à borda da lixeira, convertido percentualmente para o nível de ocupação. Conta também com um botão físico (push-button) para forçar o envio imediato de dados sob demanda.
2. **Dashboard Web (Front-end):** Interface visual desenvolvida em **HTML5, CSS3 (Tema Escuro) e JavaScript**, utilizando a biblioteca **Leaflet.js** para renderização de mapas interativos e integração direta com a API do **ThingSpeak**.

---

## 📊 Estrutura de Dados (ThingSpeak)

O envio dos dados pelo ESP32 utiliza canais específicos mapeados da seguinte forma:
* **Field 1:** Nível de Ocupação da lixeira (0% a 100%).
* **Field 2:** Latitude da lixeira inteligente.
* **Field 3:** Longitude da lixeira inteligente.

---

## 🛠️ Tecnologias Utilizadas

* **Microcontrolador:** ESP32 (DevKit v1)
* **Sensores:** HC-SR04 (Ultrassom) e Botão Push-button
* **Linguagem (Firmware):** C++ / Arduino IDE
* **Armazenamento e Nuvem:** ThingSpeak API
* **Front-end:** HTML5, CSS3 (Custom Dark Mode) e JavaScript (ES Modules)
* **Mapas:** Leaflet.js com camadas CartoDB

---

## 📁 Organização de Arquivos

* `index.html` — Estrutura principal da página web e importação de dependências.
* `style.css` — Folha de estilos customizada para o layout lado a lado, barra de rolagem customizada e tema escuro.
* `script.js` — Lógica de requisições assíncronas à API do ThingSpeak, tratamento de coordenadas e manipulação dos marcadores no mapa.

---

## 🚀 Como Executar o Projeto

1. **Firmware:** Carregue o código C++ no seu ESP32 (ou simulador Wokwi), configurando a rede Wi-Fi, o número do canal do ThingSpeak e a sua Write API Key.
2. **Web Dashboard:** Abra a pasta do projeto num editor de código (como o VSCodium ou VS Code) e utilize a extensão **Live Server** para rodar o arquivo `index.html` em um servidor local.
