const express = require("express");
const router = express.Router();

// Importar las fucniones del controlador 
const { getUsers, postUsers,getUser, deleteUser, updatedUser} = require("../controllers/user.js");

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
router.delete("/delete/:id", deleteUser);
router.put("/update/:id", updatedUser);



module.exports = router;