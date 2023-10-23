import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAppointmentDetailDto } from "src/modules/appointment-details/dto/create-appointment-detail.dto";
import { AppointmentDetail } from "src/modules/appointment-details/entities/appointment-detail.entity";
import { Appointment } from "src/modules/appointments/entities/appointment.entity";
import { CreateCustomerDto } from "src/modules/customers/dto/create-customer.dto";
import { Customer } from "src/modules/customers/entities/customer.entity";
import { Voucher } from "src/modules/vouchers/entities/voucher.entity";
import { VoucherHistory } from "src/modules/voucher-history/entities/voucher-history.entity";
import { CreateVoucherHistoryDto } from "src/modules/voucher-history/dto/create-voucher-history.dto";
import { Repository } from "typeorm";

@Injectable()
export class AppointmentService {
    constructor(
        @InjectRepository(Customer) private customer: Repository<Customer>,
        @InjectRepository(Appointment) private appointment: Repository<Appointment>,
        @InjectRepository(AppointmentDetail) private appointmentDetail: Repository<AppointmentDetail>,
        @InjectRepository(VoucherHistory) private voucherHistory: Repository<VoucherHistory>,
        @InjectRepository(Voucher) private voucher: Repository<Voucher>
    ) { }
    async create(createCustomerDto: CreateCustomerDto, createAppointmentDto: any, createAppointmentDetailDto: CreateAppointmentDetailDto[], voucherHistoryDto?: CreateVoucherHistoryDto, useVoucher?: any) {
        try {
            let customerRes = await this.customer.save(createCustomerDto);
            // console.log("customerRes", customerRes);

            if (!customerRes) return {
                status: false,
                message: "Error"
            }
            if (customerRes) {
                let formatAppointment = {
                    ...createAppointmentDto,
                    customerId: customerRes.id
                }
                let appointmentRes = await this.appointment.save(formatAppointment)
                if (!appointmentRes) throw new Error('Error')

                if (appointmentRes) {

                    if (voucherHistoryDto) {
                        console.log("voucherHistoryDto", voucherHistoryDto);
                        const formatVoucherHistory = {
                            ...voucherHistoryDto,
                            appointmentId: Number(appointmentRes.id),
                            customerId: Number(customerRes.id)
                        }
                        let resultVoucherHistory = await this.voucherHistory.save(formatVoucherHistory)
                        console.log("resultVoucherHistory", resultVoucherHistory);
                        if (resultVoucherHistory) {
                            let updateVoucherUsed = {
                                ...useVoucher,
                                status: true
                            }
                            let updatedVoucher = this.voucher.merge(useVoucher, updateVoucherUsed);
                            let resultUpdateVoucher = await this.voucher.save(updatedVoucher)
                        }
                    }
                    for (let i in createAppointmentDetailDto) {
                        createAppointmentDetailDto[i] = {
                            ...createAppointmentDetailDto[i],
                            appointmentId: appointmentRes.id
                        }
                    }
                    let resultAppointmentDetailRes = await Promise.all(createAppointmentDetailDto.map(async (detail) => await this.appointmentDetail.save(detail)));

                    return {
                        status: true,
                        message: "create booking successfully",
                        customer: customerRes,
                        appointment: appointmentRes,
                        details: resultAppointmentDetailRes
                    }
                }
            }
            return {
                status: true,
                message: "Create Appointment Successfully"
            }

        } catch (err) {
            console.log("err", err);

            return {
                status: false,
                message: "Create Appointment Fail"
            }
        }
    }

    async findAll() {
        try {
            let listAppointments = await this.appointment.find({
                relations: {
                    customer: true,
                    appointmentDetails: {
                        staff: true,
                        service: true
                    }
                }
            });
            return listAppointments
        } catch {
            return {
                status: false,
                data: null
            }
        }
    }
}