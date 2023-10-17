const studentApi = require('./controller/student.controller');
class Routes {
  constructor(app) {
    this.app = app;
  }

  appRoutes() {

    this.app.post("/student/add", studentApi.addStudent);
    this.app.get('/student/get-all', studentApi.getAllStudent);
    this.app.post('/student/update/:id', studentApi.updateStudent);
    this.app.delete('/student/delete/:id', studentApi.deleteStudent);
  }

  routesConfig() {
    this.appRoutes();
  }
}
module.exports = Routes;
