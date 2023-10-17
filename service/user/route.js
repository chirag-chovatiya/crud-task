
const userApi = require('./controller/user.controller');
class Routes {
  constructor(app) {
    this.app = app;
  }
  appRoutes() {
    this.app.post('/user/register', userApi.register);
    this.app.post('/user/login', userApi.login);
    this.app.get('/get/all/user', userApi.userGetAll);
    this.app.put('/user/profile/update/:id', userApi.updateUser);
    this.app.delete('/user/delete/:id', userApi.deleteUser);
  }
  routesConfig() {
    this.appRoutes();
  }
}
module.exports = Routes;
