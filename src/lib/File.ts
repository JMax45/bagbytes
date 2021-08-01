import WebSocket from 'ws';
import fs from 'fs';
import crypto, { Hash } from 'crypto';

class File {
	path: string;
	ws: WebSocket | undefined;
	size: number;
	fd: number;
	filename: string;
	hash: Hash;
	constructor(path: string, ws?: WebSocket) {
		this.path = path;
		this.ws = ws;
		this.size = 0;
		this.fd = 0;
		try {
			this.size = fs.statSync(this.path).size;
			fs.open(this.path, 'r', (status, fd) => {
				this.fd = fd;
			});
		} catch (error) {}
		this.filename = this.path.split('/')[this.path.split('/').length - 1];
		this.hash = crypto.createHash('sha1', { encoding: 'hex' });
	}
	getChunk(start: number, end: number) {
		return new Promise((resolve, reject) => {
			const diff = end - start;
			const buffer = Buffer.alloc(diff);
			fs.read(this.fd, buffer, 0, diff, start, () => {
				resolve(buffer.toString('base64'));
			});
		});
	}
	sendChunk(chunk: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.ws!.send(chunk, () => {
				resolve();
			});
		});
	}
	appendChunk(chunk: string): Promise<void> {
		return new Promise((resolve, reject) => {
			fs.appendFile(this.path, chunk, { encoding: 'base64' }, (err) =>
				resolve()
			);
			this.hash.write(chunk, 'base64');
		});
	}
	getHash(): crypto.Hash {
		this.hash.end();
		return this.hash.read();
	}
	getHashUncached(): Promise<crypto.Hash> {
		return new Promise((resolve, reject) => {
			const fd = fs.createReadStream(this.path);
			const hash = crypto.createHash('sha1');
			hash.setEncoding('hex');

			fd.on('end', function () {
				hash.end();
				resolve(hash.read());
			});

			fd.pipe(hash);
		});
	}
	splitInChunks(chunkSize: number, fileSize = this.size) {
		const numberOfChunks = Math.ceil(fileSize / chunkSize);
		const chunks = [];

		for (let i = 0; i < numberOfChunks; i++) {
			chunks.push([i * chunkSize, i * chunkSize + chunkSize]);
		}

		// remove additional bytes
		if (chunks[chunks.length - 1][1] > fileSize) {
			const difference = chunks[chunks.length - 1][1] - fileSize;
			chunks[chunks.length - 1][1] = chunks[chunks.length - 1][1] - difference;
		}

		return chunks;
	}
}

export default File;
