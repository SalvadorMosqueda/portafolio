import jwt from 'jsonwebtoken'

const generarJWT = (id)=>{
    //le pasamos un id, la palabra secrta y cuando expira 
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d',
    })
}

export default generarJWT