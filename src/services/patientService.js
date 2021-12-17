import db from "../models/index";
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';
import e from "cors";

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email
                || !data.doctorId
                || !data.timeType
                || !data.date
                || !data.fullName
                || !data.selectedGender
                || !data.address
                || !data.reason
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing params!'
                })
            } else {



                //upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName,
                        phonenumber: data.phonenumber
                    }
                });

                //create booking
                if (user && user[0]) {

                    let info = await db.Booking.findOne({
                        where: { patientId: user[0].id, statusId: 'S1' },
                        raw: false
                    })
                    let info2 = await db.Booking.findOne({
                        where: { patientId: user[0].id, statusId: 'S2' },
                        raw: false
                    })
                    if (info || info2) {
                        resolve({
                            errCode: 2,
                            errMessage: 'Đặt lịch thất bại, bạn đang có lịch hẹn chưa xác nhận hoặc chưa khám xong!'
                        })
                    } else {
                        let token = uuidv4();

                        await emailService.sendSimpleEmail({
                            reciverEmail: data.email,
                            patientName: data.fullName,
                            time: data.timeString,
                            doctorName: data.doctorName,
                            language: data.language,
                            redirectLink: buildUrlEmail(data.doctorId, token)
                        });
                        await db.Booking.create({
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            reason: data.reason,
                            token: token
                        })

                    }

                }

                resolve({
                    errCode: 0,
                    errMessage: 'Save Info Patient succeed!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing params!'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'Update Appointment succeed!'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist!'
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}