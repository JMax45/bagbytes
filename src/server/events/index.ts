import chunk from './chunk';
import fileStats from './fileStats';
import getChunk from './getChunk';
import getFileHash from './getFileHash';
import getFileStats from './getFileStats';
import postFileHash from './postFileHash';
import roleSpecify from './roleSpecify';

const events = [
	chunk,
	fileStats,
	getChunk,
	getFileHash,
	getFileStats,
	postFileHash,
	roleSpecify,
];

export default events;
