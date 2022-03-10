import  express  from "express";
import { registrar,autenticar,confirmar,olvidePassword,comprobarToken,nuevoPassword,perfil} from "../controllers/usuarioController.js";
import checkAuth from "../middleware/chechAuth.js";
const router  = express.Router()

// la / significa la misma url que esta en index que nos manda hacia aca

//creacion registro y confirmacion de usuario

router.post('/',registrar); //Registra nuevo user
router.post('/login',autenticar)
router.get('/confirmar/:token',confirmar)
router.post('/olvide-password',olvidePassword)
//cuando presionen en el enlace que se envio arriba tenemos que validar el token
router.get('/olvide-password/:token',comprobarToken)
//hacemos condicional si es get o post para rutas iguales 
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)

router.get('/perfil',checkAuth,perfil)


export default router