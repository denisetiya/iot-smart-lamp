#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>
#include <ArduinoJson.h> // Tambahkan pustaka ArduinoJson

const char* ssid = "Squizy";
const char* password = "";
const char* apiEndpoint1 = "https://automatic-lamp-api.vercel.app/status";
const char* apiEndpoint2 = "https://automatic-lamp-api.vercel.app/power-usage";
const char* apiEndpoint3 = "https://automatic-lamp-api.vercel.app/daily-power-usage";

const int relayPin = 5; // Hubungkan relay ke pin GPIO 5 (D1) pada NodeMCU
const int currentSensorPin = A0; // Hubungkan current sensor ke pin analog A0 pada NodeMCU

unsigned long lastResetTime = 0;
float dailyPowerUsage = 0;
unsigned long previousMillis = 0;
unsigned long previousStatusCheckMillis = 0;
const long statusCheckInterval = 5000; // Interval pengecekan status lampu: 5 detik (dalam milidetik)
const long powerUsageInterval = 600000; // Interval pengiriman data penggunaan daya: 10 menit (dalam milidetik)

String previousLampStatus = ""; // Status lampu sebelumnya

void setup() {
  Serial.begin(9600);
  Serial.println("run the code");
  pinMode(relayPin, OUTPUT);
  pinMode(currentSensorPin, INPUT); 
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");

  lastResetTime = millis(); // Set waktu reset terakhir pada saat setup
}

void loop() {
  
  unsigned long currentMillis = millis();
  
  if (currentMillis - lastResetTime >= 86400000) { // Reset total konsumsi daya harian pada awal hari baru
    lastResetTime = currentMillis;
    dailyPowerUsage = 0;
  }

  if (currentMillis - previousStatusCheckMillis >= statusCheckInterval) {
    previousStatusCheckMillis = currentMillis;
    
    // Lakukan pengecekan status lampu
    String currentLampStatus = getLampStatusFromServer();
    if (currentLampStatus != previousLampStatus) {
      previousLampStatus = currentLampStatus;
      
      if (currentLampStatus == "on") {
        digitalWrite(relayPin, HIGH); // Hidupkan lampu
        Serial.println("Lampu menyala");
      } else if (currentLampStatus == "off") {
        digitalWrite(relayPin, LOW); // Matikan lampu
        Serial.println("Lampu mati");
      } else {
        Serial.println("Status lampu tidak diketahui");
      }
    }
  }

  if (currentMillis - previousMillis >= powerUsageInterval) {
    previousMillis = currentMillis;
    
    // Lakukan proses pengiriman data ke server setiap 10 menit
    sendPowerUsageData();
  }

  delay(1000); // Tunda 1 detik sebelum melakukan iterasi berikutnya
}

String getLampStatusFromServer() {
  BearSSL::WiFiClientSecure client;
  client.setInsecure(); // Menggunakan setInsecure untuk sementara waktu jika tidak memiliki sertifikat
  HTTPClient http;
  
  if (http.begin(client, apiEndpoint1)) { // Mulai permintaan HTTP dengan klien WiFi dan URL server
    int httpResponseCode = http.GET(); // Kirim permintaan GET
    
    if (httpResponseCode > 0) {
      String payload = http.getString(); // Dapatkan respons payload sebagai string
      Serial.println("Response: " + payload);
      
      StaticJsonDocument<200> doc;
      DeserializationError error = deserializeJson(doc, payload);
      
      if (!error) {
        const char* status = doc["status"];
        http.end(); // Selesai koneksi
        return String(status); // Kembalikan status lampu sebagai string
      } else {
        Serial.println("Deserialization failed");
      }
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end(); // Selesai koneksi
  } else {
    Serial.println("Failed to connect to server");
  }
  return ""; // Kembalikan string kosong jika gagal mendapatkan status
}

void sendPowerUsageData() {
  BearSSL::WiFiClientSecure client;
  client.setInsecure(); // Menggunakan setInsecure untuk sementara waktu jika tidak memiliki sertifikat
  HTTPClient http2;
  http2.begin(client, apiEndpoint2); 
  http2.addHeader("Content-Type", "application/json");

  int currentReading = analogRead(currentSensorPin);
  float current_mA = currentReading * (5.0 / 1023.0) * 1000.0;

  String data = "{\"current_mA\": " + String(current_mA) + "}";

  int httpCode2 = http2.POST(data);

  if (httpCode2 == HTTP_CODE_CREATED) {
    Serial.println("Data penggunaan daya berhasil dikirim");
    dailyPowerUsage += current_mA / 1000.0; // Tambahkan ke total konsumsi daya harian
  } else {
    Serial.println("Gagal mengirimkan data ke API");
  }
  
  http2.end();
}

void sendDailyPowerUsage() {
  BearSSL::WiFiClientSecure client;
  client.setInsecure(); // Menggunakan setInsecure untuk sementara waktu jika tidak memiliki sertifikat
  HTTPClient http3;
  http3.begin(client, apiEndpoint3); 
  http3.addHeader("Content-Type", "application/json");

  String data = "{\"totalPowerUsage\": " + String(dailyPowerUsage, 2) + "}";
  
  int httpCode3 = http3.POST(data);
  
  if (httpCode3 == HTTP_CODE_CREATED) {
    Serial.println("Total konsumsi daya harian berhasil dikirim");
  } else {
    Serial.println("Gagal mengirimkan total konsumsi daya harian ke API");
  }
  
  http3.end();
}
