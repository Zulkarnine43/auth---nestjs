import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateStockDto {
    @IsNotEmpty()
    @IsNumber()
    skuId: number;

    @IsNotEmpty()
    @IsNumber()
    warehouseId: number;

    // @IsNotEmpty()
    // @IsNumber()
    // quantity: number;
}