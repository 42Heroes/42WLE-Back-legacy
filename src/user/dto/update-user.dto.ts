import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  Length,
  MaxLength,
  ArrayNotEmpty,
  ArrayMaxSize,
  ArrayUnique,
} from 'class-validator';

type Language = {
  name:
    | 'arabic'
    | 'bengali'
    | 'chinese'
    | 'dutch'
    | 'english'
    | 'finnish'
    | 'french'
    | 'german'
    | 'hindi'
    | 'italian'
    | 'japanese'
    | 'korean'
    | 'malay'
    | 'portuguese'
    | 'russian'
    | 'spainish'
    | 'swedish'
    | 'thai'
    | 'turkish'
    | 'vietnamese';
};

export class UpdateUserDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(3)
  @ArrayUnique((language) => language.name)
  n_language: Language[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(3)
  @ArrayUnique((language) => language.name)
  l_language: Language[];

  @IsString()
  @IsNotEmpty()
  image_url: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  nickname: string;

  @IsArray()
  @IsOptional()
  hashtags: string[];

  @IsString()
  @IsOptional()
  github_id: string;

  @IsString()
  @Length(10, 500)
  introduction: string;
}
