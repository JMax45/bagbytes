export default {
	eventName: 'get:chunk',
	listener: (data: any, ws: any, wss: any, log: any) => {
		let distributor: any = null;
		wss.clients.forEach((e: any) => {
			if (e.role === 'distributor' && e.id === data.id) {
				distributor = e;
			}
		});
		if (distributor === null) {
			return;
		}
		distributor.send(
			JSON.stringify(['get:chunk', { ...data, subject_id: ws.subject_id }])
		);
	},
};
