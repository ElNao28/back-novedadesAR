import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { DetallesVenta } from './entities/detalles_venta.entity';
import { Items } from 'src/products/entities/Items.interface';
import { Carrito } from 'src/carrito/entities/carrito.entity';

@Injectable()
export class VentasService {
    constructor(
        @InjectRepository(Venta) private ventaRepository: Repository<Venta>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Product) private productRepository: Repository<Product>,
        @InjectRepository(DetallesVenta) private detallesVenta: Repository<DetallesVenta>,
        @InjectRepository(Carrito) private carritoRepository: Repository<Carrito>,
    ) { }
    async addVenta(idUser: number, products: Items[],idCard:string,total:number,fecha:string) {
        console.log(total)
        const foundUser = await this.userRepository.findOne({
            where: {
                id: idUser,
            }
        });

        const newVenta = this.ventaRepository.create({
            total_venta:total,
            fecha_venta:fecha,
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
                venta: saveVenta
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
            if(idCard !== 'null'){
                this.carritoRepository.update(parseInt(idCard),{
                    estado: 'inactivo'
                });
            }
        }
        const newCard = this.carritoRepository.create({
            usuario:foundUser
        })
        this.carritoRepository.save(newCard)
    }
}
