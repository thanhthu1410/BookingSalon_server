import { Allow } from "class-validator";

export class CreateStaffServiceDto {
    @Allow()
    staffId: string

    @Allow()
    serviceId: string
}
