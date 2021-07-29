import WebSocket from 'ws';
import { v4 } from 'uuid';
import generateUID from '../lib/generateUID';
import bytes from '../lib/formatBytes';
import Dashboard from '../lib/dashboard';
import minimist from 'minimist';

class Server {
    wss: WebSocket.Server;
    dashboard: Dashboard;
    constructor(port?: number) {
        this.wss = new WebSocket.Server({ port: port || 8080 });
        this.dashboard = new Dashboard();
        this.dashboard.log(`Server started on port ${this.wss.options.port}`);

        this.wss.on('connection', (ws: any) => {
            ws.on('message', (message: string) => {
                if(typeof message === 'string') {
                    const data = JSON.parse(message);
                    switch(data[0]) {
                        case 'role:specify':
                            if(data[1].role === 'distributor') {
                                ws.id = generateUID().toString().toUpperCase();
                                ws.role = 'distributor';
                                ws.send(JSON.stringify(['role:confirmed', { id: ws.id }]));
                                ws.send(JSON.stringify(['file:stats']));
                            } else {
                                ws.id = data[1].id;
                                ws.role = 'client';
                                ws.send(JSON.stringify(['role:confirmed']));
                            }
                            ws.subject_id = v4();
                            this.dashboard.log(`${ws._socket.remoteAddress} joined the network as ${ws.role}`);
                            break;
                        case 'file:stats':
                            ws.file = {
                                size: data[1].size,
                                filename: data[1].filename,
                                hash: data[1].hash
                            }
                            break;
                        case 'get:file:stats':
                            let file = null;
                            this.wss.clients.forEach((e: any) => {
                                if(e.role === 'distributor' && e.id === data[1].id) {
                                    file = e.file;
                                }
                            })
                            ws.send(JSON.stringify(['post:file:stats', file]));
                            break;
                        case 'get:chunk':
                            let distributor: any = null;
                            this.wss.clients.forEach((e: any) => {
                                if(e.role === 'distributor' && e.id === data[1].id) {
                                    distributor = e;
                                }
                            })
                            if(distributor === null) {
                                return;
                            }
                            distributor.send(JSON.stringify(['get:chunk', { ...data[1], subject_id: ws.subject_id }]));
                            break;
                        case 'chunk':
                            this.wss.clients.forEach((e: any) => {
                                if(e.role === 'client' && e.id === ws.id && e.subject_id === data[1].subject_id) {
                                    e.send(JSON.stringify(['chunk', { chunk: data[1].chunk }]));
                                    this.dashboard.log(`Transferring ${bytes.formatBytes(data[1].end - data[1].start)} chunk`);
                                }
                            })
                            break;
                        case 'get:file:hash':
                            let dstr: any = null;
                            this.wss.clients.forEach((e: any) => {
                                if(e.role === 'distributor' && e.id === data[1].id) {
                                    dstr = e;
                                }
                            })
                            if(dstr === null) {
                                return;
                            }
                            this.wss.clients.forEach((e: any) => {
                                if(e.role === 'client' && e.id === ws.id && e.subject_id === ws.subject_id) {
                                    e.send(JSON.stringify(['post:file:hash', { hash: dstr.file.hash }]));
                                }
                            })
                            break;
                        case 'post:file:hash':
                            this.wss.clients.forEach((e: any) => {
                                if(e.role === 'client' && e.id === ws.id && e.subject_id === data[1].subject_id) {
                                    e.send(JSON.stringify(['post:file:hash', { hash: data[1].hash }]));
                                }
                            })
                            break;
                    }
                } else {
                    //
                }
            });
            ws.on('close', () => {
                this.dashboard.log(`${ws._socket.remoteAddress} [${ws.role}] left the network`)
            })
                ws.send(JSON.stringify(['role:specify']));
            });
    }
}

export default Server;