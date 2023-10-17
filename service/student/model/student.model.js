"use strict";

const Student = require("./student.schema");

class StudentModel {

  createStudent(data) {

    return new Promise(async (resolve, reject) => {
      try {
        const result = await Student.create(data);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  findStudent(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await Student.findOne({ _id: data });
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
  findById(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = Student.findById(userId);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
  getStudentById(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await Student.findOne({ _id: userId });
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
  

  findAllStudents(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await Student.find({data:data});
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  updateStudent(pkg) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await pkg.save();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  deleteStudent(StudentId) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await Student.deleteOne({ _id: StudentId });
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

}

module.exports = new StudentModel();
