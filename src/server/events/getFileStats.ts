export default {
	eventName: 'get:file:stats',
	listener: (data: any, ws: any, wss: any, log: any) => {
		let file = null;
		wss.clients.forEach((e: any) => {
			if (e.role === 'distributor' && e.id === data.id) {
				file = e.file;
			}
		});
		ws.send(JSON.stringify(['post:file:stats', file]));
	},
};
