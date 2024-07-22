import { Controller,Body, Post} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  create(@Body() dataLogin: {email:string, password:string}) {
    return this.adminService.loginAdmin(dataLogin.email, dataLogin.password);
  }
}
