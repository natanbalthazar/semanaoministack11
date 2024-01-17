const express = require('express');
const OngController = require('./controllers/OngController');
const IncedentController = require('./controllers/IncidentController');
const ProfileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController');

// Para desacoplar o módulo de rotas do express em uma nova variável. 
const routes = express.Router();

routes.post('/sessions', SessionController.create);

routes.get('/ongs', OngController.index);
routes.post('/ongs', OngController.create);

routes.get('/profile', ProfileController.index);

routes.get('/incidents', IncedentController.index);
routes.post('/incidents', IncedentController.create);
routes.delete('/incidents/:id', IncedentController.delete);

// Para exportar as rotas.
module.exports = routes;