//LINK DO PROJETO NO WOKWI: https://wokwi.com/projects/479947292049257473

#include <WiFi.h>
#include <ThingSpeak.h>

const char* ssid = "Wokwi-GUEST";
const char* password = "";

WiFiClient client;

// CONFIGURAÇÃO ESPECÍFICA DA LIXEIRA 01
unsigned long myChannelNumber = 3569124; 
const char* myWriteAPIKey = "6DJG1JK4JIH8XPVM"; 

const int trigPin = 5;
const int echoPin = 18;
const int buttonPin = 4; // Pino onde o botão está conectado (GPIO 4)
const int alturaTotal = 100;

// Coordenadas fixas desta lixeira específica (Lixeira 01)
const float latitudeEcoBin = -23.550520;
const float longitudeEcoBin = -46.633308;

void setup_wifi() {
  delay(10);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado ao WiFi!");
}

// Função responsável por fazer a leitura do sensor e enviar os dados
void enviarDados() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  long duration = pulseIn(echoPin, HIGH);
  int distancia = duration * 0.034 / 2;
  int nivelOcupacao = constrain(map(distancia, alturaTotal, 5, 0, 100), 0, 100);

  ThingSpeak.setField(1, nivelOcupacao);
  ThingSpeak.setField(2, latitudeEcoBin);
  ThingSpeak.setField(3, longitudeEcoBin);
  
  Serial.print("Enviando nível: ");
  Serial.print(nivelOcupacao);
  Serial.println("%");

  int statusEnvio = ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
  
  if(statusEnvio == 200) {
    Serial.println("Dados enviados com sucesso!");
  } else {
    Serial.print("Erro ao enviar. HTTP error code: ");
    Serial.println(statusEnvio);
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buttonPin, INPUT_PULLUP); // Botão configurado com resistor pull-up interno
  
  setup_wifi();
  ThingSpeak.begin(client);
}

void loop() {
  // Verifica se o botão foi pressionado (nível LOW por causa do PULLUP)
  if (digitalRead(buttonPin) == LOW) {
    Serial.println("\nBotão pressionado! Enviando dados manualmente...");
    enviarDados();
    delay(1000); // Debounce simples para evitar múltiplos envios seguidos
  }

  // Faz o envio automático a cada 20 segundos, mas checa o botão frequentemente
  for (int i = 0; i < 200; i++) {
    if (digitalRead(buttonPin) == LOW) {
      Serial.println("\nBotão pressionado! Enviando dados manualmente...");
      enviarDados();
      delay(1000);
      break; // Sai do loop de espera e reinicia a contagem
    }
    delay(100); // Espera totalizando 20 segundos (200 x 100ms)
  }
}
