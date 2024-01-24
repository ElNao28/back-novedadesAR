import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  async sendEmail() {
    const to = 'luis28jair5@gmail.com';
    const subject = 'Hola wenas';
    const text = 'Lorem ipsumLorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas ea fuga repellendus officiis culpa, fugiat commodi modi inventore accusantium natus provident dicta quam consequuntur non accusamus molestias reprehenderit porro doloribus?Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas ea fuga repellendus officiis culpa, fugiat commodi modi inventore accusantium natus provident dicta quam consequuntur non accusamus molestias reprehenderit porro doloribus?Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas ea fuga repellendus officiis culpa, fugiat commodi modi inventore accusantium natus provident dicta quam consequuntur non accusamus molestias reprehenderit porro doloribus? dolor sit amet consectetur adipisicing elit. Voluptas ea fuga repellendus officiis culpa, fugiat commodi modi inventore accusantium natus provident dicta quam consequuntur non accusamus molestias reprehenderit porro doloribus?';

    await this.emailService.sendMail(to, subject, text);

    return 'Email sent successfully';
  }
}
