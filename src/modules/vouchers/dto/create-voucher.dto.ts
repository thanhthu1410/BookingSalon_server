import { IsNotEmpty } from "class-validator"

export class CreateVoucherDto {
    @IsNotEmpty()
    title: string

    @IsNotEmpty()
    code: string

    @IsNotEmpty()
    value: number

    @IsNotEmpty()
    discountType: string
    

}
