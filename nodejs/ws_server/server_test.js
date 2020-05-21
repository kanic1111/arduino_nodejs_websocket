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