# websocket 和 nodejs串arduino練習

## 練習目的
了解websocket原理,做到從arduino接收資料後轉送給client端,並且在第2個人加入後,第2個人也能收到資料

## 使用套件
npm install express
npm install ws
npm install serialport

### arduino電路&程式
使用溫溼度感測模組(DHT22)
![](https://i.imgur.com/TGW4rNE.jpg)
 (DHT22) - Arduino
 `DAT - D2`
 `VCC - 5V`
 `GND - GND`

 - 將資料改成json格式
``` c=
#include "DHT.h"
#define dhtPin 8
#define dhtType DHT22 
//#define dhtType DHT11

DHT dht(dhtPin, dhtType);

void setup(){
  Serial.begin(9600);
  dht.begin();
}
void loop(){
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  if (isnan(h)||isnan(t)){
    Serial.print("無法讀取");
    return;
  }
    Serial.print("{\"Humidity\":"); 
    Serial.print(h, 1);
    Serial.print(",\"Temperature\":");
    Serial.print(t, 1);
    Serial.print("}\n");
  delay(1000);
}
```
### nodejs程式

#### websocket_server
``` node.js=
const express = require('express')  
var SerialPort = require('serialport');
var arduinoport = new SerialPort('COM5', {baudRate: 9600});
const SocketServer = require('ws').Server
const Readline = require('@serialport/parser-readline')
const port = 3000
const parser = new Readline()
const server = express()
    .listen(port, () => console.log(`listening on ${port}`))
const wss = new SocketServer({server})
    wss.on ('connection', ws =>{
        console.log('client connected')  
    setTimeout(function() {
        arduinoport.on('open',function() {
            console.log('Serial Port ' + arduinoport + ' is opened.');
          });
          arduinoport.pipe(parser)
        parser.on('data', line =>{
            console.log(line)
        ws.send(line)//傳給client端serialport讀的到訊息
    },1000)
})
    ws.on('message' , message =>{
        let clients = wss.clients //取得所有連接中的 client
        var data1 = JSON.parse(message); //將client端傳來的訊息包成JSON給變數data1
        console.log(data1);//在終端顯示出data1
        if ( data1.number == '1410732051') {
             clients.forEach(client => { 
            client.send(String('hello 魯志謙'))  
             })
        }
        else if ( data1.number == '1410732001') {
            clients.forEach(client => {
                client.send(String('hello 江芊縈'))
             })
        }
    })
    ws.on('close', () => {
        console.log('Close connected')
    })
  }) 
```
#### websocket_client
``` node.js=  
  //使用 WebSocket 的網址向 Server 開啟連結
const WebSocket = require('ws');

var ws = new WebSocket('ws://localhost:3000')

//開啟後執行的動作，指定一個 function 會在連結 WebSocket 後執行
ws.onopen = () => {
    console.log('open connection')
    setTimeout(function() {
        var data = { number : "1410732051" , name : "魯志謙" }//將JSON格式的資料給變數data
        ws.send(JSON.stringify(data));//將JSON格式的資料轉成字串傳送(FIREFOX只接受字串)
      }, 1000);
}

//關閉後執行的動作，指定一個 function 會在連結中斷後執行
ws.onclose = () => {
    console.log('close connection')
}

ws.onmessage = message => {
    setTimeout(function() {
        console.log(message.data)
    },1000)
    }
``` 
#### 測試廣播的程式
```  node.js=
//使用 WebSocket 的網址向 Server 開啟連結
const WebSocket = require('ws');

let ws = new WebSocket('ws://localhost:3000')

//開啟後執行的動作，指定一個 function 會在連結 WebSocket 後執行
ws.onopen = () => {
    console.log('open connection')
    setTimeout(function() {
        var data = { number : "1410732001" , name : "江芊縈" }
        ws.send(JSON.stringify(data));
      }, 1000);
}

//關閉後執行的動作，指定一個 function 會在連結中斷後執行
ws.onclose = () => {
    console.log('close connection')
}

ws.onmessage = message => {
    console.log(message.data)
    }
```
