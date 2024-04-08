export class CreateUserDto {
    name:string;
    lastname:string;
    motherLastname:string;
    gender:string;
    birthdate?:Date | null;
    email:string;
    cellphone:string;
    password:string;
    answer:string;
    estado:string;
    municipio:string;
    cp:number;
    colonia:string;
    referencia:string;
    questionId:number;
    rolId:number;
}