import { PartialType } from '@nestjs/mapped-types';
import { CreateTimeDto } from './create-time.dto';
import { Allow } from 'class-validator';

export class UpdateTimeDto extends PartialType(CreateTimeDto) {
    @Allow()
    duration: number

    @Allow()
    startTime: number

    @Allow()
    endTime: number
}
