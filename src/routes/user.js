const express = require("express");
const router = express.Router();

// Importar las fucniones del controlador 
const { getUsers, postUsers,loginUser,getUser} = require("../controllers/user.js");

// Importar las fucniones del validador
// const {validatorRegister, validationLogin, validationUser, validatorUpdate } = require('../validators/user.js')

// Importar middleware
// const {authMiddleware} = require("../middlewares/authMiddleware.js")

//  Ruta , middleware, validation , funcion del cotrolador

/*
    Ejemplo de rutas con middleware:

    router.get("/",authMiddleware,  getUsers);
    router.get("/:id",authMiddleware, validationUser, getUser);
    router.post("/create",authMiddleware, validatorRegister,postUsers);
    router.put("/update",authMiddleware, validatorUpdate, updateUsers)
    router.delete("/:id",authMiddleware, validationUser,deleteUser);

*/

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/create", postUsers);

module.exports = router;