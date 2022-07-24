const WebSocket = require("ws");

const create = (port) => {

    const serverWebSocket = new WebSocket.Server(
        { 
            port: port
        }
    );
    
    serverWebSocket.on("connection", clientWebSocket => {
        //console.log('Conexión OK');
        
        clientWebSocket.onmessage = (e) => {
            console.log(e.data)

            serverWebSocket.clients.forEach((client) => {
                //console.log('id', client.id, ws.id)
                if (client !== clientWebSocket && client.readyState === WebSocket.OPEN) 
                    client.send(`HOLA ${e.data}`);

            })
        }

        clientWebSocket.onclose = () => {
            //console.log(ws);
            //console.log(this);
            console.log(`Client ${ws.id} has disconnected!`);
        };        
    })

}


module.exports = {
    create
}