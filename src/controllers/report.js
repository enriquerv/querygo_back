const { succes, error } = require("../utils/handleResponse");
const Report = require("../models/Report");

/**
 * GET USERS
 */
const getReports = async (req, res) => {
  try {
    const users = await Report.findAll();
    succes(res, users, 200);
  } catch (err) {
    error(res, [err.message], 500);
  }
};


module.exports = {
  getReports
};
