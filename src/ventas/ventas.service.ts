import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { Comentarios } from 'src/products/entities/comentatios.entity';
import { DetallesVenta } from './entities/detalles_venta.entity';
import { Items } from 'src/products/entities/Items.interface';
import { Carrito } from 'src/carrito/entities/carrito.entity';
import { Envios } from './entities/envios.entity';
import { Chat } from "src/test-msj/entities/chat.entity";
import { Admin } from "src/admin/entities/admin.entity";

@Injectable()
export class VentasService {
    constructor(
        @InjectRepository(Venta) private ventaRepository: Repository<Venta>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(DetallesVenta) private detallesVenta: Repository<DetallesVenta>,
        @InjectRepository(Carrito) private carritoRepository: Repository<Carrito>,
        @InjectRepository(Envios) private enviosRepository: Repository<Envios>,
        @InjectRepository(Comentarios) private comentarioRepository: Repository<Comentarios>,
        @InjectRepository(Chat) private chatRepository:Repository<Chat>,
        @InjectRepository(Admin) private adminRepository:Repository<Admin>,
    ) { }
    async addVenta(idUser: number, products: Items[], idCard: string, total: number, fecha: string) {
        console.log(idUser, products, idCard, total, fecha)
        return
        const foundUser = await this.userRepository.findOne({
            where: {
                id: idUser,
            }
        });

        const newVenta = this.ventaRepository.create({
            total_venta: total,
            fecha_venta: fecha,
            usuario: foundUser
        });
        const saveVenta = await this.ventaRepository.save(newVenta)
        for (let i = 0; i < products.length; i++) {
            let foundProduct = await this.productRepository.findOne({
                where: {
                    id: parseInt(products[i].id)
                }
            })
            const newDetallesVenta = this.detallesVenta.create({
                cantidad: products[i].quantity,
                precio: products[i].unit_price,
                producto: foundProduct,
                venta: saveVenta,
                descuento: foundProduct.descuento
            });
            const saveDetallesVenta = this.detallesVenta.save(newDetallesVenta);
            const newStock = foundProduct.stock - products[i].quantity;
            this.productRepository.update({
                id: parseInt(products[i].id)
            }, {
                stock: newStock
            });

            if (newStock <= 0) {
                this.productRepository.update({
                    id: parseInt(products[i].id)
                }, {
                    status: 'inactivo'
                });
            }
            saveDetallesVenta;
            if (idCard !== 'null') {
                this.carritoRepository.update(parseInt(idCard), {
                    estado: 'inactivo'
                });
            }
        }
        const newCard = this.carritoRepository.create({
            usuario: foundUser
        })
        this.carritoRepository.save(newCard)
    }
    async addVentaStripe(
        idUser: number,
        productos: {
            idProducto: number,
            cantidad: number,
        }[],
        total: number,
        idCard: string,
        idSession: string
    ) {
        const foundUser = await this.userRepository.findOne({
            where: {
                id: idUser
            }
        });
        let fecha = new Date()
        const newVenta = this.ventaRepository.create({
            usuario: foundUser,
            total_venta: total,
            fecha_venta: fecha,
            estado: 'PConfirmar',
            idCarrito: idCard,
            idSession
        });
        const saveVenta = await this.ventaRepository.save(newVenta)
        productos.forEach(async data => {
            const foundProduct = await this.productRepository.findOne({
                where: {
                    id: data.idProducto
                }
            });
            const saveDetalleVenta = this.detallesVenta.create({
                cantidad: data.cantidad,
                producto: foundProduct,
                descuento: foundProduct.descuento,
                precio: foundProduct.precio,
                venta: saveVenta
            });
            this.detallesVenta.save(saveDetalleVenta);
        })
        setTimeout(async () => {
            const foundVenta = await this.ventaRepository.findOne({
                where: {
                    id: saveVenta.id
                },
                relations: ['detallesVenta']
            });
            if (foundVenta.estado !== 'PConfirmar') {
                console.log("no borra")
                return
            }
            for (let i = 0; i < foundVenta.detallesVenta.length; i++) {
                await this.detallesVenta.delete(foundVenta.detallesVenta[i].id)
            }
            await this.ventaRepository.delete(foundVenta.id)
        }, 1800000);//1800000
    }
    async confirmVenta(idSession: string) {
        const foundVenta = await this.ventaRepository.findOne({
            where: {
                idSession
            },
            relations: ['detallesVenta', 'detallesVenta.producto', 'usuario']
        });
        const foundAdmin = await this.adminRepository.findOneBy({id:1});
        const newChat = await this.chatRepository.create()
        const saveChat = await this.chatRepository.save(newChat)
        this.ventaRepository.update(foundVenta.id, {
            estado: 'Fenvio',
            chat: saveChat,
            admin:foundAdmin
        });
        for (let i = 0; i < foundVenta.detallesVenta.length; i++) {
            let newStock = 0;
            const foundProduct = await this.productRepository.findOne({
                where: {
                    id: foundVenta.detallesVenta[i].producto.id
                }
            });
            newStock = foundProduct.stock - foundVenta.detallesVenta[i].cantidad;
            this.productRepository.update({
                id: foundVenta.detallesVenta[i].producto.id
            }, {
                stock: newStock
            });
        }
        if (foundVenta.idCarrito === 'null') {
            return
        }
        else {
            await this.carritoRepository.update(+foundVenta.idCarrito, {
                estado: 'inactivo'
            });
            const newCard = this.carritoRepository.create({
                usuario: foundVenta.usuario
            })
            this.carritoRepository.save(newCard)
        }
    }
    async getVentas(idUser: number) {
        const foundUser = await this.userRepository.findOne({
            where: {
                id: idUser
            }
        });
        const detallesVenta = await this.ventaRepository.find({
            where: {
                usuario: foundUser
            },
            order: {
                fecha_venta: 'DESC',
                id: 'DESC'
            },
            relations: ['detallesVenta', 'detallesVenta.producto', 'detallesVenta.producto.imagen', 'envio']
        });
        return {
            status: HttpStatus.OK,
            detallesVenta: detallesVenta
        }
    }
    async getAllVentasByStatus(estado: string) {
        const ventas = await this.ventaRepository.find({
            where: {
                estado
            },
            order: {
                fecha_venta: 'DESC'
            },
            relations: ['detallesVenta', 'detallesVenta.producto', 'envio', 'usuario', 'usuario.ubicacion']
        });
        return {
            message: 'exito',
            status: HttpStatus.OK,
            data: ventas
        }
    }
    async addCodeRastreo(id: number, code: number) {
        const foundVenta = await this.ventaRepository.findOne({
            where: {
                id
            }
        });
        if (!foundVenta) return {
            message: 'La venta no existe',
            status: HttpStatus.NOT_FOUND
        }
        const newEnvio = await this.enviosRepository.create({
            numero_guia: code.toString()
        });
        const saveEnvio = await this.enviosRepository.save(newEnvio);

        await this.ventaRepository.update(id, {
            envio: saveEnvio,
            estado: 'proceso'
        })

        return {
            message: 'exito',
            status: HttpStatus.OK
        }
    }
    async addRaking(idVenta: number, raking: number, opinion: string) {
        const foundDetalles = await this.detallesVenta.findOne({
            where: {
                id: idVenta
            },
            relations: ['producto', 'venta', 'venta.usuario']
        })
        const foundProduct = await this.productRepository.findOne({
            where: {
                id: foundDetalles.producto.id
            }
        });
        const foundUser = await this.userRepository.findOne({
            where: {
                id: foundDetalles.venta.usuario.id
            }
        })
        const fecha: Date = new Date()
        const newComent = this.comentarioRepository.create({
            comentario: opinion,
            producto: foundProduct,
            usuario: foundUser,
            fecha: fecha
        });
        const saveComent = await this.comentarioRepository.save(newComent);

        await this.detallesVenta.update(idVenta, {
            calificacion: raking,
            comentario: saveComent
        });

        const foundVentas = await this.detallesVenta.find({
            where: {
                producto: foundProduct
            }
        });
        let rakingProduct: number = 0;
        let lenght: number = 0;
        let suma: number = 0;
        foundVentas.forEach(data => {
            if (data.calificacion > 0) {
                lenght++;
                suma += data.calificacion;
            }
        })
        rakingProduct = suma / lenght;

        await this.productRepository.update(foundProduct, {
            rating: rakingProduct
        })

        return {
            message: 'exito',
            status: HttpStatus.OK
        }
    }
    async getComentariosByid(idUser: number) {
        const foundUser = await this.userRepository.findOne({
            where: {
                id: idUser
            },
            relations: ['ventas', 'ventas.detallesVenta', 'ventas.detallesVenta.producto', 'ventas.detallesVenta.producto.imagen', 'ventas.detallesVenta.comentario']
        });
        let detallesVenta = [];

        foundUser.ventas.forEach(data => {
            data.detallesVenta.forEach(dataVen => {
                if (dataVen.comentario)
                    detallesVenta.push(dataVen)
            })
        });
        detallesVenta = detallesVenta.map(data => {
            return {
                producto: data.producto.nombre_producto,
                precio: data.precio,
                cantidad: data.cantidad,
                calificacion: data.calificacion,
                comentario: data.comentario,
                imagen_url: data.producto.imagen[0].url_imagen
            }
        });
        return {
            message: 'exito',
            status: HttpStatus.OK,
            data: detallesVenta
        }
    }
    async ventaComplete(data: { idEnvio: number, fecha: Date, idVenta: number }) {
        const foundEnvio = await this.enviosRepository.findOne({
            where: {
                id: data.idEnvio
            }
        });
        const foundVenta = await this.ventaRepository.findOne({
            where: {
                id: data.idVenta
            }
        });
        foundVenta.estado = 'completo';
        foundEnvio.fecha_entrega = data.fecha;
        await this.enviosRepository.update(foundEnvio.id, foundEnvio)
        await this.ventaRepository.update(foundVenta.id, foundVenta)
        return {
            message: 'Exito',
            status: HttpStatus.OK
        }
    }


    async dataByDataSet() {
        const foundDetalles = await this.detallesVenta.find({
            relations: ['producto', 'venta','venta.usuario'],

        }
        );
        const filterByDataSet = foundDetalles.map((data) => {
            return {
                id: data.venta.usuario.id,
                descuento: data.descuento,
                precio: data.precio,
                categoria: data.producto.categoria,
                tipo: data.producto.tipo,
                rating: data.producto.rating,
                calificacion:data.calificacion,
                cantidad: data.cantidad,
                total:data.venta.total_venta,
                genero:data.venta.usuario.gender,
                fecha_venta: data.venta.fecha_venta
                
            }
        })
        return filterByDataSet
    }

    async canceledVenta(id:number){
        console.log(id)
        await this.ventaRepository.update(id,{
            estado:'canceled'
        });
        return{
            message:'Exito',
            status:HttpStatus.OK
        }
    }

    async checkVenta(id:number){
        const founduser = await this.userRepository.findOne({
            where:{
                id
            },
            relations:['ventas']
        });
        if(founduser.ventas || founduser.ventas.length > 0){
            return {
                status:HttpStatus.OK,
                isShopping:true
            }
        }
        else{
            return {
                status:HttpStatus.OK,
                isShopping:true
            }
        }
    }
}