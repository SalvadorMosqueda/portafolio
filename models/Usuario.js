import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const usuarioSchema = mongoose.Schema({
    nombre:{
        type:String,
        require:true,
        trim:true
    },
    password:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        trim:true,
        unique:true

    },
    token:{
        type:String,
        
    },
    confirmado:{
        type:Boolean,
        default:false
    },

},
{
    //crea 2 columnas actualizado y creado
    timestamps:true
}


)
//pre se ejecita antes de modificar o guardar rgistros
//si usaremos this tieen que ser function normal sin arrow
usuarioSchema.pre('save',async function (next){
    //verificamos si no esta modificado el password no hagas nada para no volver a hashear
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)

})
//asi creamos una nueva funcion
usuarioSchema.methods.comprobarPassword= async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario,this.password)
}
    
const Usuario = mongoose.model('Usuario',usuarioSchema)

export default Usuario;