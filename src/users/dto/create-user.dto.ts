
export class CreateUserDto {
    name:string;
    lastname:string;
    motherLastname:string;
    gender:string;
    birthdate?:Date | null;
    estado:string;
    municipio:string;
    cp:number;
    colonia:string;
    email:string;
    cellphone:number;
    password:string;
    question:string;
    answer:string;
    
}