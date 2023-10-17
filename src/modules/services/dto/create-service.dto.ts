import { Allow } from "class-validator"

export class CreateServiceDto {

    @Allow()
    price: string

    @Allow()
    name: string

    @Allow()
    desc: string

    @Allow()
    avatar: string
}

