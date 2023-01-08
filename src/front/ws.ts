import WebSocket from 'ws';

export default class WebsocketServer {
  public wss: WebSocket.Server;
  public pluginWsHandler: any;

  constructor(wss: WebSocket.Server, pluginWsHandler: any) {
    this.wss = wss;
    this.pluginWsHandler = pluginWsHandler;
  }

  start() {
    this.wss.on('connection', (ws: WebSocket) => {
      ws.on('message', (message: string) => {
        this.handleMessage(ws, message);
      });
    });
  }

  sendMessage(msg = {}) {
    this.wss.clients.forEach((client) => {
      client.send(JSON.stringify(msg));
    });
  }

  handleMessage(_ws: WebSocket, message: string) {
    const msg = JSON.parse(message.toString());
    this.pluginWsHandler(msg);
  }
}
