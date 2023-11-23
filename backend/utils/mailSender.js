import nodemailer from "nodemailer";


const mailSender = async (email, title, body) => {
    try{
            let transporter = nodemailer.createTransport({
                service:"gmail",
                port: 465,
                secure: true,
                logger:true,
                debug:true,
                secureConnection:false,
                auth:{
                    user:"d26170995@gmail.com",
                    pass:"utvuxwlnjbpqoqgo",
                },
                tls:{
                    rejectUnAuthorized:true
                }
    
            })


            let info = await transporter.sendMail({
                from: "d26170995@gmail.com",
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            console.log(info);
            console.log(transporter.options.host);

            return info;
    }
    catch(error) {
        console.log(error.message);
    }
}


export default mailSender;