const { succes, error } = require("../utils/handleResponse");
const Conversation = require("../models/Conversation");

/**
 * GET USERS
 */
const getConversations = async (req, res) => {
  try {
    const users = await Conversation.findAll();
    succes(res, users, 200);
  } catch (err) {
    error(res, [err.message], 500);
  }
};


module.exports = {
  getConversations
};
