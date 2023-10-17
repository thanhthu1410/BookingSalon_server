import { PartialType } from '@nestjs/mapped-types';
import { CreateVoucherDto } from './create-voucher.dto';
import { Allow } from 'class-validator';

export class UpdateVoucherDto extends PartialType(CreateVoucherDto) {
    @Allow()
    id:number
    @Allow()
    title: string;
    @Allow()
    code: string;
    @Allow()
    value: number;
    @Allow()
    discountType: string;
    @Allow()
    IsDelete: boolean
    @Allow()
    status: boolean

}
