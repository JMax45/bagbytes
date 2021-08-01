export default {
	eventName: 'file:stats',
	listener: (data: any, ws: any, wss: any, log: any) => {
		ws.file = {
			size: data.size,
			filename: data.filename,
			hash: data.hash,
		};
	},
};
