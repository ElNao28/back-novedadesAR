
export class CreateUserDto {
    name:string;
    lastname:string;
    motherLastname:string;
    gender:string;
    birthdate?:Date | null;
    city:string;
    address:string;
    cp:number;
    email:string;
    cellphone:number;
    password:string;
    question:string;
    answer:string;
    
}