#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>
#include <ArduinoJson.h>

const char* ssid1 = "NEW UIN LAMPUNG";
const char* password1 = "sbsn2021";
const char* ssid2 = "ARR KOST 2";
const char* password2 = "arrkost54321";
// const char* ssid2 = "Squizy";
// const char* password2 = "28638127";
const char* apiEndpoint1 = "https://automatic-lamp-api.vercel.app/status";
const char* apiEndpoint2 = "https://automatic-lamp-api.vercel.app/power-usage";
// const char* apiEndpoint3 = "https://automatic-lamp-api.vercel.app/daily-power-usage";

const int relayPin = 16; // (D0) NodeMCU
const int currentSensorPin = A0; //  A0 NodeMCU

unsigned long lastResetTime = 0;
float dailyPowerUsage = 0;
float tenMinutePowerUsage = 0; 
unsigned long previousMillis = 0;
unsigned long previousStatusCheckMillis = 0;
const long statusCheckInterval = 10000; // 5 detik
const long powerUsageInterval = 600000; // 10 menit

String previousLampStatus = ""; 

void setup() {
  Serial.begin(9600);
  Serial.println("run the code");
  pinMode(relayPin, OUTPUT);
  pinMode(currentSensorPin, INPUT); 

  if (!connectToWiFi(ssid1, password1)) {
    Serial.println("Failed to connect to ssid1, trying ssid2...");
    connectToWiFi(ssid2, password2);
  }

  lastResetTime = millis(); // Set waktu reset 
}

void loop() {
  unsigned long currentMillis = millis();

  // if (currentMillis - lastResetTime >= 86400000) { // Reset total konsumsi daya 
  //   lastResetTime = currentMillis;
  //   dailyPowerUsage = 0;
  // }

  String currentLampStatus = getLampStatusFromServer();
  if(previousLampStatus != currentLampStatus){
    previousLampStatus = currentLampStatus;
    Serial.println("ini hasil : " + currentLampStatus);
    if (currentLampStatus == "on") {
      digitalWrite(relayPin, LOW); // Hidupkan lampu
      Serial.println("Lampu menyala");
    } else if (currentLampStatus == "off") {
      digitalWrite(relayPin, HIGH); // Matikan lampu
      Serial.println("Lampu mati");
    } else {
      Serial.println("Status lampu tidak diketahui");
    }
  }

  if (currentMillis - previousMillis >= powerUsageInterval) {
    previousMillis = currentMillis;
    sendPowerUsageData();
  }

  // Baca penggunaan daya 10 menit
  int currentReading = analogRead(currentSensorPin);
  float current_mA = currentReading * (5.0 / 1023.0) * 1000.0;
  tenMinutePowerUsage += current_mA / 1000.0; 

  delay(1000); 
}

bool connectToWiFi(const char* ssid, const char* password) {
  WiFi.begin(ssid, password);
  unsigned long startAttemptTime = millis();
  
  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 10000) { // 10 detik timeout
    delay(1000);
    Serial.print("Connecting to WiFi: ");
    Serial.println(ssid);
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("Connected to WiFi: ");
    Serial.println(ssid);
    return true;
  } else {
    Serial.print("Failed to connect to WiFi: ");
    Serial.println(ssid);
    return false;
  }
}

String getLampStatusFromServer() {
  BearSSL::WiFiClientSecure client;
  client.setInsecure(); 
  HTTPClient http;
  
  if (http.begin(client, apiEndpoint1)) {
    int httpResponseCode = http.GET(); 
    
    if (httpResponseCode > 0) {
      String payload = http.getString(); 
      Serial.println("Response: " + payload);
      
      StaticJsonDocument<200> doc;
      DeserializationError error = deserializeJson(doc, payload);
      
      if (!error) {
        const char* status = doc["status"];
        http.end(); 
        return String(status); 
      } else {
        Serial.println("Deserialization failed");
      }
    } else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end(); 
  } else {
    Serial.println("Failed to connect to server");
  }
  return ""; 
}

void sendPowerUsageData() {
  BearSSL::WiFiClientSecure client;
  client.setInsecure(); 
  HTTPClient http2;
  http2.begin(client, apiEndpoint2); 
  http2.addHeader("Content-Type", "application/json");

  String data = "{\"current_mA\": " + String(tenMinutePowerUsage, 2) + ", \"status\": \"" + previousLampStatus + "\"}";
  Serial.println(data);
  int httpCode2 = http2.POST(data);

  if (httpCode2 == HTTP_CODE_CREATED) {
    Serial.println("Data penggunaan daya selama 10 menit berhasil dikirim");
    dailyPowerUsage += tenMinutePowerUsage;
    tenMinutePowerUsage = 0.0; 
  } else {
    Serial.println("Gagal mengirimkan data ke API");
  }
  
  http2.end();
}

// void sendDailyPowerUsage() {
//   BearSSL::WiFiClientSecure client;
//   client.setInsecure(); 
//   HTTPClient http3;
//   http3.begin(client, apiEndpoint3); 
//   http3.addHeader("Content-Type", "application/json");

//   String data = "{\"totalPowerUsage\": " + String(dailyPowerUsage, 2) + "}";
  
//   int httpCode3 = http3.POST(data);
  
//   if (httpCode3 == HTTP_CODE_CREATED) {
//     Serial.println("Total konsumsi daya harian berhasil dikirim");
//   } else {
//     Serial.println("Gagal mengirimkan total konsumsi daya harian ke API");
//   }
  
//   http3.end();
// }