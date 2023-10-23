import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';
import { Allow } from 'class-validator';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
    @Allow()
    price: number

    @Allow()
    name: string

    @Allow()
    desc: string

    @Allow()
    avatar: string

    @Allow()
    status: boolean

}
