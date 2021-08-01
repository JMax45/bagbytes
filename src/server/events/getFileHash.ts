export default {
	eventName: 'get:file:hash',
	listener: (data: any, ws: any, wss: any, log: any) => {
		let dstr: any = null;
		wss.clients.forEach((e: any) => {
			if (e.role === 'distributor' && e.id === data.id) {
				dstr = e;
			}
		});
		if (dstr === null) {
			return;
		}
		wss.clients.forEach((e: any) => {
			if (
				e.role === 'client' &&
				e.id === ws.id &&
				e.subject_id === ws.subject_id
			) {
				e.send(JSON.stringify(['post:file:hash', { hash: dstr.file.hash }]));
			}
		});
	},
};
