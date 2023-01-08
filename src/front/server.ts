import compression from 'compression';
import express from 'express';
import chokidar from 'chokidar';
import http from 'http';
import WebSocket from 'ws';
import logger from '../utils/log';
import WebsocketServer from './ws';

export default class Server {
  private port: number;
  private pluginWsClientHandler: any;
  private staticFiles: string;

  public ws!: WebsocketServer;

  constructor(staticFiles: string, pluginWsClientHandler: any, port = 9595) {
    this.staticFiles = staticFiles;
    this.port = port;
    this.pluginWsClientHandler = pluginWsClientHandler;
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
    this.ws = new WebsocketServer(wss, this.pluginWsClientHandler);

    // Start Websocket server
    this.ws.start();

    // Watch client files on dev mode
    const watcher = chokidar.watch(this.staticFiles, {
      ignored: /(^|[/\\])\../, // ignore dotfiles
      persistent: true,
    });

    // And send refresh to commmand to parent on change
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
