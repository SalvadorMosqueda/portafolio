import nodemailer from 'nodemailer'

export const emailRegistro = async(datos)=>{
    const{email,token,nombre}=datos

    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "ac591e4c078c91",
          pass: "7c2ad528191394"
        }
      });

    //informacion del email
    const info = await transport.sendMail({
        front: 'Uptask - Administrador de proyectos',
        to:email,
        subject:'Uptask-comprueba tu cuenta',
        text:"Comprueba tu cuenta en UPtask",
        html: `<p>Hola: ${nombre} Comprueba tu cuenta en Uptask </p>
        <p>Tu cuenta ya esta casi lista, compruebala en el siguente enlace:
        <a href="${process.env.FRONDTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
        <p>Si tu no creaste la cuenta , puedes ignorar el mensaje
        `


    })
}

export const emailOlvidePassword= async(datos)=>{
    const{email,token,nombre}=datos

    //todo mover hacia  variables de enotorno
    const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "ac591e4c078c91",
          pass: "7c2ad528191394"
        }
      });

    //informacion del email
    const info = await transport.sendMail({
        front: 'Uptask - Administrador de proyectos',
        to:email,
        subject:'Uptask-restablece tu password',
        text:"Comprueba tu cuenta en UPtask",
        html: `<p>Hola: ${nombre} has solicitado restablecer tu pasword </p>
        <p>sigue el siguente enlace para gener un nuevo password:
        <a href="${process.env.FRONDTEND_URL}/nuevo-password/${token}">restablcecer Password</a>
        <p>Si tu no creaste la cuenta , puedes ignorar el mensaje
        `


    })
}

