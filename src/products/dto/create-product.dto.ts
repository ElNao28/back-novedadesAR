export class CreateProductDto {
    nombre_producto: string;
    precio: number;
    descripccion: string;
    stock: number;
    categoria: string;
    rating?: number;
    descuento: number;
}
