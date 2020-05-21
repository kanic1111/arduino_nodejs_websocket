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
    console.log(message.data)//在終端顯示message裡的data欄位
    // ws.addEventListener('message', function(e) {
    //     var msg = JSON.parse(e.data);
    //     console.log(msg)
    //   })
    }