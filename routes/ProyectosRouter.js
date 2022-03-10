import {obtenerProyectos,
    nuevoProyectos,
    obtenerProyecto,
    editarProyecto,
    eliminarProyectos,
    agregarColaborador,
    eliminarColaborador } from "../controllers/proyectosController.js";
import  Express  from "express";
import checkAuth from "../middleware/chechAuth.js";

const router=Express.Router()

//cuando estemos en la ruta principal cuando sea un get ejecuta esto  y si es post ejecuta lo otro
router.route("/").get(checkAuth,obtenerProyectos).post(checkAuth,nuevoProyectos)
router.route('/:id').get(checkAuth,obtenerProyecto).put(checkAuth,editarProyecto).delete(checkAuth,eliminarProyectos)
router.post('/agregar-colobarador/:id',checkAuth,agregarColaborador)
router.post('/eliminar-colobarador/:id',checkAuth,eliminarColaborador)






export default router
