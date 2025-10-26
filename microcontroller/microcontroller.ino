#include <Arduino_MKRIoTCarrier.h>
#include <algorithm>
#include <iostream>
using namespace std;

MKRIoTCarrier carrier;

char byte_stream[2];
int byte_read;

int col_r;
int col_g;
int col_b;

void setup() {
  Serial.begin(9600);
  while (!Serial);

  carrier.withCase();
  carrier.begin();
}

void loop() {
  //await instruction
  if (Serial.available() > 0){
    // read the incoming byte:
    byte_read = Serial.readBytes(byte_stream, 1);

    if (byte_stream[0] == '\u0000'){
      delay(100);
      // read all the sensor values
      while (!carrier.Light.colorAvailable()){
        delay(5);
      }
      carrier.Light.readColor(col_r, col_g, col_b);
      
      float temperature = carrier.Env.readTemperature();
      float humidity = carrier.Env.readHumidity();
      float light = (col_r + col_g + col_b) / 122.91;

      // print each of the sensor values
      Serial.println(String(temperature) + "," + String(humidity) + ",0,"  + String(light));
    }
  }
}
