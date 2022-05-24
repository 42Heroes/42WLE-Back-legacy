import { IsString, IsDate, IsNotEmpty, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsString()
  image_url: string;

  @IsString()
  intra_id: string;

  @IsString()
  nickname: string;

  @IsString()
  campus: string;

  @IsString()
  country: string;
}
