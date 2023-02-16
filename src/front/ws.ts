import WebSocket from 'ws';
import FPL from '../main';

export default class WebsocketServer {
  public wss: WebSocket.Server;
  public fpl: FPL;

  constructor(wss: WebSocket.Server, fpl: FPL) {
    this.wss = wss;
    this.fpl = fpl;
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
    this.fpl.emit('ws-message', msg);
  }
}
