import { IsString, Length } from 'class-validator';

export class ShippingInfoDto {
  @IsString()
  @Length(2, 150, { message: 'Ingresá el nombre del destinatario' })
  recipientName!: string;

  @IsString()
  @Length(5, 200, { message: 'Ingresá una dirección válida' })
  address!: string;

  @IsString()
  @Length(2, 100, { message: 'Ingresá una ciudad válida' })
  city!: string;

  @IsString()
  @Length(2, 100, { message: 'Ingresá una provincia válida' })
  province!: string;

  @IsString()
  @Length(3, 20, { message: 'Ingresá un código postal válido' })
  postalCode!: string;

  @IsString()
  @Length(6, 30, { message: 'Ingresá un teléfono válido' })
  phone!: string;
}
