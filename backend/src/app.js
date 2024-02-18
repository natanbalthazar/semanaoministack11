const cors = require('cors');
const express = require('express');
const { errors } = require('celebrate')
const routes = require('./routes');

const app = express();

app.use(cors()); // Como estamos em desenvolvimento, deixaremos apenas isso.
// Ao deixar apenas o comando acima, permitiremos que todas as aplicações Front-End possam acessar o Back-End.

app.use(express.json());
// Necessário que o comando abaixo seja após o comando acima. 
app.use(routes);

app.use(errors());

module.exports = app;