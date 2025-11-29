// Entrypoint for hosting platforms that expect `index.js`.
// This simply imports the real server entry `server.js` which
// is an ES module (see `package.json: type: "module"`).
import './server.js';
