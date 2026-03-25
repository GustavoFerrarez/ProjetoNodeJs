const pessoaController = require('./pessoaController');

module.exports = (app) => {
    app.get('/pessoa', pessoaController.get);
    app.post('/pessoa', pessoaController.post);
    app.get('/pessoa/:id', pessoaController.getById);
    app.put('/pessoa/:id', pessoaController.put);
    app.delete('/pessoa/:id', pessoaController.delete);
}