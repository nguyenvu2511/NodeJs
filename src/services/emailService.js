require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"CSKH Goodcare" <goodcare.dev48@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        text: "Hello world?", // plain text body
        html: getBodyHTMLEmail(dataSend), // html body
    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin chào ${dataSend.patientName} !</h3>
        <p>Bạn nhận được Email này vì đã đặt lịch khám bệnh trên website GoodCare !</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

        <p>Nếu các thông tin trên là đúng sự thật, vui lòng Click vào đường link bên dưới 
            để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.
        </p>
        <div>
            <a href=${dataSend.redirectLink} target="_blank" >Nhấn vào đây !</a>
        </div>
        <div> GoodCare Xin chân thành cảm ơn ! </div>
        <div>*****************</div>
        <div>GoodCare</div>
        <div>*****************</div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>Dear ${dataSend.patientName} !</h3>
        <p>You received this email because you booked an appointment on the Goodcare website !</p>
        <p>Information to schedule an appointment: </p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>

        <p>If the above information is true, please Click on the link below 
            to confirm and complete the procedure to book an appointment.
        </p>
        <div>
            <a href=${dataSend.redirectLink} target="_blank" >Click Here !</a>
        </div>
        <div> Sincerely thank ! </div>
        <div>*****************</div>
        <div>GoodCare</div>
        <div>*****************</div>
        `
    }
    return result;
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin chào ${dataSend.patientName} !</h3>
        <p>Bạn nhận được Email này vì đã kết thúc lịch khám bệnh trên website Goodcare !</p>
        <p>Thông tin đơn thuốc/hóa đơn được gửi trong tập tin đính kèm !</p>
        <h3> Chúc bạn thật nhiều sức khỏe và thành công trong cuộc sống. </h3>
        <h3> GoodCare Xin chân thành cảm ơn ! </h3>
        <div>*****************</div>
        <div>GoodCare</div>
        <div>*****************</div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>Dear ${dataSend.patientName} !</h3>
        <p>You received this email because your appointment on Goodcare website has ended !</p>
        <p>Prescription/invoice information is sent in the attached file !</p>
        <h3>Wishing you a lot of health and success in life.</h3>
        <div> Sincerely thank ! </div>
        <div>*****************</div>
        <div>GoodCare</div>
        <div>*****************</div>
        `
    }
    return result;
}

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_APP, // generated ethereal user
                    pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"CSKH Goodcare" <goodcare.dev48@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "Kết quả đặt lịch khám bệnh", // Subject line
                text: "Hello world?", // plain text body
                html: getBodyHTMLEmailRemedy(dataSend), // html body
                attachments: [
                    {
                        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split('base64,')[1],
                        encoding: 'base64',
                    },
                ]
            });

            resolve(true);

        } catch (e) {
            reject(e);
        }
    })
}


let sendCancelBooking = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"CSKH Goodcare" <goodcare.dev48@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Thông tin hủy lịch khám bệnh tại GoodCare", // Subject line

        html: getBodyCancelBooking(dataSend), // html body
    });
}

let getBodyCancelBooking = (dataSend) => {
    let result = '';
    result =
        `
        <h3>Xin chào ${dataSend.patientName} !</h3>
        <p> Bạn nhận được Email này vì lịch khám bệnh của bạn trên website GoodCare đã bị HỦY !</p>
        <p> GoodCare rất hoan nghênh nếu được tiếp tục phục vụ bạn ở những lần tiếp theo !</p>
        <h3> Chúc bạn thật nhiều sức khỏe và thành công trong cuộc sống. </h3>
        <h3> GoodCare Xin chân thành cảm ơn ! </h3>
        <div>*****************</div>
        <div>GoodCare</div>
        <div>*****************</div>
        `
    return result;
}

let sendChooseDoctorBooking = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"CSKH Goodcare" <goodcare.dev48@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Thông tin lịch khám bệnh tại GoodCare", // Subject line

        html: getBodyDoctorBooking(dataSend), // html body
    });
}

let getBodyDoctorBooking = (dataSend) => {
    let result = '';
    result =
        `
        <h3>Xin chào ${dataSend.patientName} !</h3>
        <p> Bạn nhận được Email này vì lịch khám bệnh của bạn đã được chọn bác sỹ !</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <div><b>Chuyên khoa: ${dataSend.specialty}</b></div>
        <p> GoodCare rất hoan nghênh nếu được tiếp tục phục vụ bạn ở những lần tiếp theo !</p>
        <p> Chúc bạn thật nhiều sức khỏe và thành công trong cuộc sống. </p>
        <p> GoodCare Xin chân thành cảm ơn ! </p>
        <div>*****************</div>
        <div>GoodCare</div>
        <div>*****************</div>
        `
    return result;
}
module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment,
    sendCancelBooking: sendCancelBooking,
    sendChooseDoctorBooking: sendChooseDoctorBooking
}