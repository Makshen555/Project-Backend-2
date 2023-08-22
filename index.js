const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

// Conexión a MongoDB
const mongoose = require("mongoose");
const db = mongoose.connect("mongodb://127.0.0.1:27017/project2", {
  useFindAndModify: true,
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const {
  userPost,
  userGet,
  userPut,
  userDelete,
  userLogin,
  userVerification,
  desactivate2fa
} = require("./controllers/userController.js");

const {
  editPost,
  editGet,
  //editPut,
  editDelete
} = require("./controllers/editController.js")

const {
  completionPost,
  completionGet,
  //completionPut,
  completionDelete
} = require("./controllers/completionController.js")

const {
  imagePost,
  imageGet,
  //imagePut,
  imageDelete
} = require("./controllers/imageController.js")

const {
  createCompletions,
  createEdit,
  createImage
} = require('./controllers/openAIController.js')

const { verify } = require( "./controllers/sendGridController.js")

app.use(express.json());

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors({
  domains: '*',
  methods: "*"
}));

// Endpoint para registrarse
app.post('/api/users', userPost);

// Endpoint para loguearse
app.post('/api/login', userLogin);

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  jwt.verify(token, 'clave-secreta-del-jwt', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = user;
    next();
  });
}
//Listen the task request 

//User
app.get('/api/users', userGet);
app.put('/api/users/:id', authenticateToken, userPut);
app.put('/api/users/:id/verify', authenticateToken, userVerification);
app.put('/api/users/:id/desactivate2fa', authenticateToken, desactivate2fa);
app.put('/api/users/:id/verifyEmail', userVerification);
app.delete('/api/users/:id', authenticateToken, userDelete);

app.post('/api/editPrompt', editPost);
app.get('/api/editPrompt', editGet);
//app.put('/api/editPrompt', editPut);
app.delete('/api/editPrompt/:id', editDelete); 

app.post('/api/completionPrompt', completionPost);
app.get('/api/completionPrompt', completionGet);
//app.put('/api/completionPrompt', completionPut);
app.delete('/api/completionPrompt/:id', completionDelete);

app.post('/api/imagePrompt', imagePost);
app.get('/api/imagePrompt', imageGet);
//app.put('/api/imagePrompt', imagePut);
app.delete('/api/imagePrompt/:id', imageDelete);

//AI Prompts
app.post('/api/completion', createCompletions);
app.post('/api/edit', createEdit);
app.post('/api/image', createImage);

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});