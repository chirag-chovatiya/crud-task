const util = require("../../../utils/response");
const message = require("../../../utils/messages.json");
const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserHandler {
    // register by name & userName & password
  async register(req, res) {
    let reqData = req.body;
    try {
      if (
        typeof reqData.name == "undefined" ||
        (typeof reqData.name != "undefined" && reqData.name == "")
      ) {
        return res.status(200).send(util.error({}, message.name_is_empty));
      } else if (
        typeof reqData.username == "undefined" ||
        (typeof reqData.username != "undefined" && reqData.username == "")
      ) {
        return res.status(200).send(util.error({}, message.username_is_empty));
      } else if (
        typeof reqData.password == "undefined" ||
        (typeof reqData.password != "undefined" && reqData.password == "")
      ) {
        return res.status(200).send(util.error({}, message.empty_password));
      } else if (reqData.password && reqData.password.length < 6) {
        return res.status(200).send(util.error({}, message.password_length_6));
      } else {
        var userExist = await userModel.findUser({
          username: reqData.username,
        });
        if (userExist) {
          return res
            .status(200)
            .send(util.error({}, message.username_already_exist));
        }
      }
      var user_arr = {};
      user_arr.name = reqData.name;
      user_arr.username = reqData.username;
      user_arr.password = bcrypt.hashSync(reqData.password,parseInt(process.env.BCRYPT_ROUNDS));
      const user = await userModel.createUser(user_arr);

      if (user != "") {
        const payload = { user: user.id };
        const options = { expiresIn: process.env.JWT_EXPIRES_IN,issuer: process.env.JWT_ISSUER };
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret, options);
        user.token = token;
        const updatedUser = await userModel.updateUser(user);
        return res
          .status(200)
          .cookie("auth", token, {
            maxAge: 1.728e8,
            httpOnly: true,
          })
          .send(
            util.success({ result: updatedUser }, message.registration_success)
          );
      } else {
        return res
          .status(200)
          .send(util.error({}, message.something_went_wrong));
      }
    } catch (err) {
      return res.send(util.error({}, message.something_went_wrong));
    }
  }

  // login by userName & password
  async login(req, res) {
    const reqData = req.body;
    if (reqData && reqData.username && reqData.password) {
      const user = await userModel.findUser({ username: reqData.username });
      try {
        if (user && user._id != "" && user._id != undefined) {
          bcrypt.compare(
            reqData.password,
            user.password,
            async function (err, pres) {
              if (pres == true) {
                const payload = { user: user._id };
                const options = { expiresIn: process.env.JWT_EXPIRES_IN,issuer: process.env.JWT_ISSUER };
                const secret = process.env.JWT_SECRET;
                const token = jwt.sign(payload, secret, options);

                user.token = token;
                await userModel.updateUser(user);
                const user_details = await userModel.findUser({
                  username: user.username,
                });
                user_details.accesstoken = token;
                user_details.token = token;
                const result = {
                  accesstoken: token,
                  user: user,
                };
                return res.send(
                  util.success({ result: result }, message.login_success)
                );
              } else {
                return res
                  .status(200)
                  .send(util.error({}, message.wrong_password));
              }
            }
          );
        } else {
          return res
            .status(401)
            .send(util.error({}, message.in_correct_login_details));
        }
      } catch (err) {
        console.log(err);
        res.status(200).send(util.error({}, message.something_went_wrong));
      }
    } else {
      return res.status(405).send(util.error({}, message.required_parameters_null_or_missing));
    }
  }

  async updateUser(req, res) {
    let reqData = req.body;
    try {
      if (
        typeof req.params.id == "undefined" ||
        (typeof req.params.id != "undefined" && req.params.id == "")
      ) {
        return res.status(200).send(util.error({}, message.user_id_empty));
      } else {
        const findUser = await userModel.getUserById(req.params.id);
        if (findUser) {
          findUser.name = reqData.name;
          if (reqData.username) {
            findUser.username = reqData.username;
          }
          if (reqData.password) {
            const hashedPassword = await bcrypt.hash(reqData.password, parseInt(process.env.BCRYPT_ROUNDS));
            findUser.password = hashedPassword;
          }
          const rs = await userModel.updateUser(findUser);
          if (rs) {
            return res.send(
              util.success(
                { result: rs },
                message.common_messages_record_updated
              )
            );
          } else {
            return res
              .status(200)
              .send(
                util.error({}, message.common_messages_record_updated_failed)
              );
          }
        } else {
          return res.status(200).send(util.error({}, message.user_not_found));
        }
      }
    } catch (err) {
      console.log(err, "err");
      return res.send(util.error({}, message.something_went_wrong));
    }
  }
// userGetAll
  async userGetAll(req, res) {
    try {
      const results = await userModel.findAlluser({});

      if (results && results.length > 0) {
        const result = results.map((user) => ({
          id: user.id,
          name: user.name,
          username: user.username,
        }));
        return res.send(
          util.success(
            { result: result },
            message.common_messages_record_available
          )
        );
      } else {
        return res
          .status(200)
          .send(util.error({}, message.common_messages_record_not_available));
      }
    } catch (err) {
      console.log(err, "err");
      return res.send(util.error({}, message.something_went_wrong));
    }
  }
// deleteUser by id
  async deleteUser(req, res) {
    try {
      if (
        typeof req.params.id == "undefined" ||
        (typeof req.params.id != "undefined" && req.params.id == "")
      ) {
        return res.status(200).send(util.error({}, message.user_id_empty));
      }
      const UserExist = await userModel.getUserById(req.params.id);
      if (UserExist) {
        const pkg = await userModel.deleteUser(UserExist);
        return res.send(
          util.success({ result: pkg }, message.common_messages_record_deleted)
        );
      } else {
        return res
          .status(200)
          .send(util.error({}, message.common_messages_record_not_available));
      }
    } catch (err) {
      console.log(err, "err");
      return res.send(util.error({}, message.something_went_wrong));
    }
  }
}

module.exports = new UserHandler();
