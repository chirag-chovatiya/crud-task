"use strict";
const User = require("./user.schema");
const mongoose = require("mongoose");

class UserModel {
  
  createUser(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await User.create(data);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  findUser(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await User.findOne(data);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
  findUserById(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await User.findOne({_id: data});
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
  getUserById(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await User.findOne({ _id: userId });
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
  updateUser(user) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await user.save();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  findAlluser(data) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await User.find(data);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
  deleteUser(drinkId) {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await User.deleteOne({ _id: drinkId });
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

}



module.exports = new UserModel();
