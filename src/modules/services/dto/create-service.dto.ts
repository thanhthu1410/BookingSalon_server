import { Allow } from "class-validator"

export class CreateServiceDto {

    @Allow()
    price: number

    @Allow()
    name: string

    @Allow()
    desc: string

    @Allow()
    avatar: string
}

