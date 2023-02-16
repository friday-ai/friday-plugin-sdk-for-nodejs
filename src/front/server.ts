import logger from '@friday-ai/logger';
import chokidar from 'chokidar';
import compression from 'compression';
import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import FPL from '../main';
import WebsocketServer from './ws';

export default class Server {
  public fpl: FPL;
  private port: number;
  private staticFiles: string;

  public ws!: WebsocketServer;

  constructor(fpl: FPL, staticFiles: string, port = 9595) {
    this.fpl = fpl;
    this.staticFiles = staticFiles;
    this.port = port;
  }

  start() {
    const app = express();

    // compress our client side content before sending it over the wire
    app.use(compression());

    // Serve static files
    app.use(express.static(this.staticFiles));

    // Initialize a simple http server
    const server = http.createServer(app);

    // Initialize the WebSocket server instance
    const wss = new WebSocket.Server({ server });
    this.ws = new WebsocketServer(wss, this.fpl);

    // Start Websocket server
    this.ws.start();

    // Watch client files on dev mode
    const watcher = chokidar.watch(this.staticFiles, {
      ignored: /(^|[/\\])\../, // ignore dotfiles
      persistent: true,
    });

    // And send refresh commmand to parent on change
    watcher.on('change', (path: string) => {
      this.ws.sendMessage({ type: 'friday-refresh' });
      logger.info(`HMR update ${path}`);
    });

    // listen for requests :)
    server.listen(this.port, () => {
      logger.info(`Plugin server listening on port ${this.port}`);
    });
  }
}
