const util = require('../../../utils/response');
const message = require('../../../utils/messages.json');
const StudentModel = require('../model/student.model');
const userModel = require('../../user/model/user.model');


class StudentHandler {

  async addStudent(req, res) {
    let reqData = req.body;
    reqData.user_id = res.locals.user._id

    try {
      if (!reqData.user_id || !req.user._id) {
        return res.status(200).send(util.error({}, message.user_id_empty));
      } else if (typeof reqData.first_name == "undefined" || (typeof reqData.first_name != "undefined" && reqData.first_name == "")) {
        return res.status(200).send(util.error({}, message.firstName_is_empty));
      } else if (typeof reqData.last_name == "undefined" || (typeof reqData.last_name != "undefined" && reqData.last_name == "")) {
        return res.status(200).send(util.error({}, message.lastName_is_empty));
      } else if (typeof reqData.age == "undefined" || (typeof reqData.age != "undefined" && reqData.age == "")) {
        return res.status(200).send(util.error({}, message.age_is_empty));
      } else if (typeof reqData.mobile_no == "undefined" || (typeof reqData.mobile_no != "undefined" && reqData.mobile_no == "")) {
        return res.status(200).send(util.error({}, message.mobile_empty));
      } else if (typeof reqData.address == "undefined" || (typeof reqData.address != "undefined" && reqData.address == "")) {
        return res.status(200).send(util.error({}, message.address_is_empty));
      } else if (typeof reqData.notes == "undefined" || (typeof reqData.notes != "undefined" && reqData.notes == "")) {
        return res.status(200).send(util.error({}, message.note_is_empty));
      } else {
        
        const user = await userModel.getUserById(req.user._id);

        if (user) {
          const insObj = {};
          insObj.user_id = reqData.user_id;
          insObj.first_name = reqData.first_name;
          insObj.last_name = reqData.last_name;
          insObj.age = reqData.age;
          insObj.mobile_no = reqData.mobile_no;
          insObj.address = reqData.address;
          insObj.notes = reqData.notes;
          
          const rs = await StudentModel.createStudent(insObj);

          if (rs && rs != "") {
            return res.send(util.success({ result: rs }, message.common_messages_record_added));
          } else {
            return res.status(200).send(util.error({}, message.something_went_wrong));
          }
        } else {
           res.status(200).send(util.error({}, message.user_not_found));
        }
      }
    } catch (err) {
      console.log(err, "err")
      return res.send(util.error({err}, message.something_went_wrong));
    }
  }


  async getAllStudent(req, res) {
    try {
      var StudentExist = await StudentModel.findAllStudents();
      if (StudentExist && Array.isArray(StudentExist) && StudentExist.length > 0) {
        return res.send(util.success({ result: StudentExist }, message.common_messages_record_available));
      } else {
        return res.status(200).send(util.error({}, message.common_messages_record_not_available));
      }
    } catch (err) {
      console.log(err, "err")
      return res.send(util.error({}, message.something_went_wrong));
    }
  }

  async updateStudent(req, res) {
    let reqData = req.body;
    try {
      if (!reqData.user_id || !req.user._id) {
        return res.status(200).send(util.error({}, message.user_id_empty));
      } else if (typeof reqData.first_name == "undefined" || (typeof reqData.first_name != "undefined" && reqData.first_name == "")) {
        return res.status(200).send(util.error({}, message.firstName_is_empty));
      } else if (typeof reqData.last_name == "undefined" || (typeof reqData.last_name != "undefined" && reqData.last_name == "")) {
        return res.status(200).send(util.error({}, message.lastName_is_empty));
      } else if (typeof reqData.age == "undefined" || (typeof reqData.age != "undefined" && reqData.age == "")) {
        return res.status(200).send(util.error({}, message.age_is_empty));
      } else if (typeof reqData.mobile_no == "undefined" || (typeof reqData.mobile_no != "undefined" && reqData.mobile_no == "")) {
        return res.status(200).send(util.error({}, message.mobile_empty));
      } else if (typeof reqData.address == "undefined" || (typeof reqData.address != "undefined" && reqData.address == "")) {
        return res.status(200).send(util.error({}, message.address_is_empty));
      } else if (typeof reqData.notes == "undefined" || (typeof reqData.notes != "undefined" && reqData.notes == "")) {
        return res.status(200).send(util.error({}, message.note_is_empty));
      } else{

        const findStudent = await StudentModel.findStudent(req.params.id);
        if (findStudent) {
          findStudent.user_id = req.user._id;
          findStudent.first_name = reqData.first_name;
          findStudent.last_name = reqData.last_name;
          findStudent.age = reqData.age;
          findStudent.mobile_no = reqData.mobile_no;
          findStudent.address = reqData.address;
          findStudent.notes = reqData.notes;
          
          const rs = await StudentModel.updateStudent(findStudent);
          if (rs) {
            return res.send(util.success({ result: rs }, message.common_messages_record_updated));
          } else {
            return res.status(200).send(util.error({}, message.common_messages_record_updated_failed));
          }
        } else {
          return res.status(200).send(util.error({}, message.common_messages_record_not_available));
        }

      }
    } catch (err) {
      console.log(err, "err")
      return res.send(util.error({}, message.something_went_wrong));
    }
  }

  async deleteStudent(req, res) {
    try {
      if (typeof req.params.id == "undefined" || (typeof req.params.id != "undefined" && req.params.id == "")) {
        return res.status(200).send(util.error({}, message.user_id_empty));
      }
      const StudentExist = await StudentModel.findStudent(req.params.id);
      if (StudentExist) {
        const dl = await StudentModel.deleteStudent(StudentExist);
        return res.send(util.success({ result: dl }, message.common_messages_record_deleted));
      } else {
        return res.status(200).send(util.error({}, message.common_messages_record_not_available));
      }
    } catch (err) {
      console.log(err, "err")
      return res.send(util.error({}, message.something_went_wrong));
    }
  }
}

module.exports = new StudentHandler();