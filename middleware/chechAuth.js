import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js';


const checkAuth = async(req,res,next)=>{

    let token;
    //si esta la autorizacion y esa autorizacion tiene un beare
    if(req.headers.authorization && req.headers.authorization.startsWith('Beare')){
        try {
            //funcion para divir el string en partes por cada esapcio se crea tipo arreglo y le pasamos el nuemero dentro del arreglo , 
            token = req.headers.authorization.split(' ')[1];

            
            //funcion para veriicar el token y misma variable de entorno que usamos para firmalo se usa para 
            //verificarlo
            //te lo desglosa tomamos el puro id para consultar al usuario  y traer sus datos
            const decode =jwt.verify(token,process.env.JWT_SECRET);
            //creamos una variable en el req llamada usuarios
            //funcion para quitar lo que no queremos del arreglo 
            req.usuario = await Usuario.findById(decode.id).select(" -confirmado -token -createdAt -updatedAt -__v");

           return next()

        } catch (error) {
            console.log(error)
            return res.status(404).json({msg: 'hubo un error'})

        }
    }

    if(!token){
        const error = new Error('Token no valido');
       return  res.status(401).json({msg: error.message})

    }

    //esta funion  la de express para pasar al siguente middleware
    //del router
    
    next();
}

export default checkAuth