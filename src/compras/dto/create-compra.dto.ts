export class CreateCompraDto {
    nombre_producto:string;
    precio:number;
    cantidad:number;
    total:number;
    fecha:Date;
    estado_compra:string;
    usuarioId:number;
}