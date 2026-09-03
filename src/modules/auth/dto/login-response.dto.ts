import { AuthUserResponseDto } from './auth-user-response.dto';

export class LoginResponseDto {
  token: string;
  user: AuthUserResponseDto;
}
