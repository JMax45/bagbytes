import WebSocket from 'ws';
import Dashboard from '../lib/dashboard';
import EventEmitter from 'events';
import events from './events';

class Server {
	wss: WebSocket.Server;
	dashboard: Dashboard;
	emitter: EventEmitter;
	constructor(port?: number) {
		this.wss = new WebSocket.Server({ port: port || 8080 });
		this.dashboard = new Dashboard();
		this.dashboard.log(`Server started on port ${this.wss.options.port}`);
		this.emitter = new EventEmitter();

		events.forEach((e) => {
			this.emitter.on(e.eventName, (data, ws) =>
				e.listener(data, ws, this.wss, this.dashboard.log)
			);
		});

		this.wss.on('connection', (ws: any) => {
			ws.on('message', (message: string) => {
				if (typeof message !== 'string') {
					return;
				}
				const data = JSON.parse(message);
				this.emitter.emit(data[0], data[1], ws);
			});
			ws.on('close', () => {
				this.dashboard.log(
					`${ws._socket.remoteAddress} [${ws.role}] left the network`
				);
			});
			ws.send(JSON.stringify(['role:specify']));
		});
	}
}

export default Server;
