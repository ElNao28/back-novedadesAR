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
    ) { }
    async addVenta(idUser: number, products: Items[], idCard: string, total: number, fecha: string) {
        console.log("llega aqui ", total)
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
                fecha_venta: 'DESC'
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
    async dataByDataSet() {
        const foundDetalles = await this.detallesVenta.find({
            relations: ['producto', 'venta']
        });

        const filterByDataSet = foundDetalles.map((data) => {
            return {
                id: data.id,
                producto: data.producto.nombre_producto,
                descuento: data.descuento,
                precio: data.precio,
                stock: data.producto.stock,
                categoria: data.producto.categoria,
                tipo: data.producto.tipo,
                rating: data.producto.rating,
                fecha_venta: data.venta.fecha_venta,
                cantidad: data.cantidad
            }
        })
        return filterByDataSet
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
        await this.comentarioRepository.save(newComent);
        await this.detallesVenta.update(idVenta, {
            calificacion: raking
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

        await this.productRepository.update(foundProduct,{
            rating:rakingProduct
        })

        return {
            message: 'exito',
            status: HttpStatus.OK
        }
    }
}
