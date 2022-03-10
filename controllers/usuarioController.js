//comunica routing con modelo
//importamos el modelo para interacturar con la bd
import Usuario from '../models/Usuario.js'
import generarID from '../helpers/GenerarId.js';
import generarJWT from '../helpers/generarJWT.js';
import { emailRegistro,emailOlvidePassword } from '../helpers/emails.js';

const registrar = async(req,res)=>{
    //evitar regitros duplicados
    const{email}= req.body;
    //quiero buscar el email y le pasamos el email para que los compare y ver si lo haya
    const existeUsuario = await Usuario.findOne({email:email})
    
    if(existeUsuario){
        const error = new Error('usuario ya registrado')
        return res.status(400).json({msg: error.message})
    }
  try{
    const usuario = new Usuario(req.body)
    usuario.token = generarID()
     await usuario.save()
     //enviar email de confirmacion
    emailRegistro({
        email:usuario.email,
        nombre: usuario.nombre,
        token:usuario.token
    })
    res.json({msg:'Usuario Creado Correctamente,revisa tu email para confirmar tu cuenta'})
  }catch(error){
      console.log(error)

  }
    
};

const autenticar =async(req,res)=>{
 //comprobar que el usuario exist
 const {email,password}=req.body;
 const usuario= await Usuario.findOne({email})
 if(!usuario){
     const error = new Error('el usuario no existe')
     return res.status(404).json({msg: error.message})

 }
 //comprobar si el  usuario esta confirmado
 if(!usuario.confirmado){
    const error = new Error('tu cuenta no a sido confirmada')
    return res.status(404).json({msg: error.message})
    
}
 //comprobar password  
 
 if(await usuario.comprobarPassword(password)){
     res.json({
         _id: usuario._id,
         nombre: usuario.nombre,
         email: usuario.email,
         token: generarJWT(usuario.id)
     })

 }else{
    const error = new Error('tu password es incorrecto')
    return res.status(404).json({msg: error.message})
 }
}
const confirmar = async (req,res)=>{
    //acedemos al valor de la url
    const {token}=req.params;
    //si no existe nos regresara un null y si existe nos dara toda la info 
    const usuarioConfirmar = await Usuario.findOne({token})
    if(!usuarioConfirmar){
    const error = new Error('Token no valido')
    return res.status(404).json({msg: error.message})
    }
    try {
     
       usuarioConfirmar.token= "";
       usuarioConfirmar.confirmado=true;
       console.log(usuarioConfirmar)
       await usuarioConfirmar.save();
       res.json({msg: 'Usuario Confirmado Correctamente'})
    } catch (error) {
        console.log(error)
        
    }
}
    const olvidePassword = async (req,res)=>{
        const {email}=req.body;
        const usuario= await Usuario.findOne({email})
        if(!usuario){
            const error = new Error('el usuario no existe')
            return res.status(404).json({msg: error.message})
       
        }
        try {
            usuario.token=generarID()
            await usuario.save();
            //enviar email
            emailOlvidePassword({
                email:usuario.email,
                nombre: usuario.nombre,
                token:usuario.token
            })
            res.json({msg: 'Hemos enviado un email con las instrucciones'})


        } catch (error) {
            console.log(error)
        }
    

}

    const comprobarToken = async(req,res)=>{
        const {token}=req.params;
         
        const tokenValido =await Usuario.find({token})
        console.log(tokenValido)
        if(tokenValido.length===0){
            const error = new Error('token no valido')
            return res.status(404).json({msg: error.message})
        }else{
            res.json({msg:'token valido'})


        }
    }
   const nuevoPassword =async (req,res)=>{
        const {token}=req.params;
        const {password}=req.body
        const usuario = await Usuario.findOne({token})

        if(!usuario){
        const error = new Error('Token no valido')
        return res.status(404).json({msg: error.message})
        }else{
            usuario.password = password
            usuario.token='';
            await usuario.save()
            res.json({msg:'password modificado correctamente'})
        }
        
    }
    
    const perfil =async(req,res)=>{
        const {usuario}=req
         res.json(usuario)
    }
export{
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}