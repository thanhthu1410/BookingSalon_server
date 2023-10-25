import { Body, OnModuleInit, Res } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Customer } from "src/modules/customers/entities/customer.entity";
import { Appointment } from "src/modules/appointments/entities/appointment.entity";
import { AppointmentDetail } from "src/modules/appointment-details/entities/appointment-detail.entity";
import { AppointmentService } from "./appointment.service";
import { Repository } from "typeorm";
import { Response } from "express";
import * as fs from 'fs';
import * as ejs from 'ejs';
import { MailService } from "src/modules/mail/mail.service";
import { AppointmentStatus } from "src/modules/appointments/appointment.enum";


interface ClientType {
    socket: Socket,
}

@WebSocketGateway(3003, { cors: true })

export class AppointmentSocketGateWay implements OnModuleInit {
    @WebSocketServer()
    server: Server

    clients: ClientType[] = [];

    constructor(
        private readonly appointmentService: AppointmentService,
        @InjectRepository(Customer) private readonly customer: Repository<Customer>,
        @InjectRepository(Appointment) private readonly appointment: Repository<Appointment>,
        @InjectRepository(AppointmentDetail) private readonly appointmentDetail: Repository<AppointmentDetail>,
        private readonly mail: MailService,
    ) { }

    onModuleInit() {
        this.server.on("connect", (async (socket: Socket) => {
            console.log("Da co user connect")
            /* Xóa người dùng khỏi clients nếu disconnect */
            socket.on("disconnect", () => {
                this.clients = this.clients.filter(client => client.socket.id != socket.id)
            })

            socket.emit("connectStatus", {
                message: "Kết nối Socket thành công",
                status: true,
                socketId: socket.id
            });

            this.clients.push({
                socket,
            })

            let listAppointments = await this.appointmentService.findAll();

            if (listAppointments) {
                socket.emit("listAppointments", listAppointments)
            }

            socket.on("booking", async (body) => {
                try {
                    let listAppointments = await this.handleBooking(body);
                    if (listAppointments) {
                        for (let i in this.clients) {
                            this.clients[i].socket.emit("listAppointments", listAppointments.data);
                        }
                        socket.emit("listAppointments", listAppointments.data);
                    } else {
                        socket.emit("bookingFail", {
                            message: "Booking fail"
                        })
                    }
                } catch (err) {
                    console.log("err", err);
                }
            });

            socket.on("acceptBooking", async (body) => {
                for (let i in this.clients) {
                    this.clients[i].socket.emit("listAppointments", body);
                }
                socket.emit("listAppointments", body);
            })
        }))
    }

    async handleBooking(@Body() body: any) {
        try {
            const customerData = {
                fullName: body.customer.fullName,
                email: body.customer.email,
                phoneNumber: body.customer.phoneNumber,
            };

            // tinh total ;
            let totalNotVoucherBefore: number;
            let totalNotVoucherAfter = totalNotVoucherBefore = body?.details?.reduce((acc: number, appointment: any) => {
                const appointmentCost = appointment.price * appointment.slot;
                return acc + appointmentCost;
            }, 0);

            if (!body.voucher) {
                totalNotVoucherBefore = body?.details?.reduce((acc, appointment) => {
                    const appointmentCost = appointment.price * appointment.slot;
                    return acc + appointmentCost;
                }, 0);
            } else {
                // tinh tien khi co voucher
                // tinh tien khi co voucher vs type cash
                if (body.voucher.discountType == "cash") {
                    totalNotVoucherBefore = totalNotVoucherAfter - (Number(body?.voucher?.value))
                    console.log("totalNotVoucherBefore", totalNotVoucherBefore);
                    // tinh tien khi co voucher vs type cash & total < value discount
                    if (totalNotVoucherBefore < 0) {
                        totalNotVoucherBefore = 0
                    }
                    // tinh tien khi co voucher vs type percent
                } else if (body.voucher.discountType == "percent") {
                    console.log("percent", body.voucher.discountType);
                    totalNotVoucherBefore = totalNotVoucherAfter - (totalNotVoucherAfter * (Number(body?.voucher?.value)) * 0.01)
                }
            }

            const appointmentData = {
                date: body.appointment.date,
                time: body.appointment.time,
                total: body?.voucher ? totalNotVoucherBefore : totalNotVoucherAfter
                // total: body.details.reduce((acc, appointment) => {
                //     const appointmentCost = appointment.price * appointment.slot;
                //     return acc + appointmentCost;
                // }, 0),
            };

            const formatAppointmentDetail = body.details;
            let voucherHistoryData: any;

            if (body?.voucher) {
                console.log("voucher", body?.voucher);
                voucherHistoryData = {
                    voucherId: body?.voucher?.id
                }
            }

            let result = await this.appointmentService.create(customerData, appointmentData, formatAppointmentDetail, voucherHistoryData, body?.voucher);
            // send email để người dùng xác nhận đặt lịch 
            // Mục đích: người dùng có thể xác nhận lịch hẹn của mình thông qua email
            //Bước cuối -1: Người dùng bấm xác nhận email thành công
            //Bước cuối -2: Email được gửi tới 
            //Bước cuối -3: Tạo ra email
            //Bước cuối -4: lấy dữ liệu bỏ vào

            // Bước 1: lấy dữ liệu 
            const appointmentDetail = await this.appointmentService.findOne(result.appoiment.id)
            const ejsTemplate = fs.readFileSync('appointmentConfirmed.ejs', 'utf8');
            const templateData = {
                customerName: result.customer.fullName,
                date: result.appoiment.date,
                time: result.appoiment.time,
                id: result.appoiment.id,
                appointmentDetail: appointmentDetail.appointmentDetails,
                total: result.details.reduce((acc, detail) => acc + detail.price, 0),
                voucherValue: (body.voucher) ? ((body.voucher.discountType == "percent") ? (body.voucher.value + "%") : ("$" + body.voucher.value)) : 0,
                apmTotal: result.appoiment.total,
            };
            // Bước 2: tạo ra email
            const compiledHtml = ejs.render(ejsTemplate, templateData);
            this.mail.sendMail({
                to: result.customer.email,
                subject: "Rasm Salon Appointment Confirm",
                html: compiledHtml
            });
            // Bước 3: Gửi email 

            if (result) {
                let listAppointments = await this.appointmentService.findAll();

                return {
                    status: true,
                    data: listAppointments
                }
            } else {
                return {
                    status: false,
                    message: "Lỗi controller"
                }
            }
        } catch {
            return {
                status: false,
                message: "Lỗi controller"
            }
        }
    }

}