require('dotenv').config();

const axios = require('axios');
const WebSocketServer = require('ws').Server;
const PORT = process.env.PORT || 8087;
const wss = new WebSocketServer({port: PORT});

wss.on('connection', function(ws) {
  const endpoint = 'https://ws-api.iextrading.com/1.0/tops/last?symbols=ORCL';

  let price;
  const getPrice = () => {
    axios.get(endpoint)
      .then(response => {
        price = response.data[0].price;
        wss.clients.forEach(conn => {
          conn.send(price);
        });
      })
      .catch(error => {
        console.log(error);
      });

    setTimeout(getPrice, 4000);
  };

  getPrice();
});
