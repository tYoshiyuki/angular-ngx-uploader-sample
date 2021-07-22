const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('mock/db.json');
const middlewares = jsonServer.defaults();

const multer = require('multer');
const upload = multer({ dest: 'mock/tmp/' });

server.use(middlewares);

// ファイルアップロード用のモックエンドポイントです
server.post('/upload', upload.any(), (req, res) => {
  console.log(req.files);
  console.log(req.headers);
  res.status(200).end();
});

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});
