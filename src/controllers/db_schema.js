const { succes, error } = require("../utils/handleResponse");
const DbSchema = require("../models/DbSchema");

/**
 * GET USERS
 */
const getDbSchemas = async (req, res) => {
  try {
    const users = await DbSchema.findAll();
    succes(res, users, 200);
  } catch (err) {
    error(res, [err.message], 500);
  }
};


module.exports = {
  getDbSchemas
};
