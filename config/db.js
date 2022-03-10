import mongoose from "mongoose";

const conectarDB = async()=>{
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
             useUnifiedTopology:true
        })
        const url=`${connection.connection.host}:${connection.connection.port}`
        console.log(`conectado a ${url}`)
    }catch(error){
        console.log(error)
        //forzar que el proceso termine
        process.exit(1)
    }
}
export default conectarDB