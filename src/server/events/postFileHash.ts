export default {
	eventName: 'post:file:hash',
	listener: (data: any, ws: any, wss: any, log: any) => {
		wss.clients.forEach((e: any) => {
			if (
				e.role === 'client' &&
				e.id === ws.id &&
				e.subject_id === data.subject_id
			) {
				e.send(JSON.stringify(['post:file:hash', { hash: data.hash }]));
			}
		});
	},
};
