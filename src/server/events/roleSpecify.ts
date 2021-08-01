import generateUID from '../../lib/generateUID';
import { v4 } from 'uuid';

export default {
	eventName: 'role:specify',
	listener: (data: any, ws: any, wss: any, log: any) => {
		if (data.role === 'distributor') {
			ws.id = generateUID().toString().toUpperCase();
			ws.role = 'distributor';
			ws.send(JSON.stringify(['role:confirmed', { id: ws.id }]));
			ws.send(JSON.stringify(['file:stats']));
		} else {
			ws.id = data.id;
			ws.role = 'client';
			ws.send(JSON.stringify(['role:confirmed']));
		}
		ws.subject_id = v4();
		log(`${ws._socket.remoteAddress} joined the network as ${ws.role}`);
	},
};
