const { succes, error } = require("../utils/handleResponse");
const Chat = require("../models/Chat");

/**
 * GET USERS
 */
const getChats = async (req, res) => {
  try {
    const users = await Chat.findAll();
    succes(res, users, 200);
  } catch (err) {
    error(res, [err.message], 500);
  }
};


module.exports = {
  getChats
};
