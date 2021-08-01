import bytes from '../../lib/formatBytes';

export default {
	eventName: 'chunk',
	listener: (data: any, ws: any, wss: any, log: any) => {
		wss.clients.forEach((e: any) => {
			if (
				e.role === 'client' &&
				e.id === ws.id &&
				e.subject_id === data.subject_id
			) {
				e.send(JSON.stringify(['chunk', { chunk: data.chunk }]));
				log(`Transferring ${bytes.formatBytes(data.end - data.start)} chunk`);
			}
		});
	},
};
