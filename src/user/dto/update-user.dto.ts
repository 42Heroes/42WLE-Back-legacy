import { IsString, IsDate } from 'class-validator';

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
  // token 사용 전까지 임시
  @IsString()
  id: string;

  @IsString()
  nickname: string;

  @IsString()
  image_url: string;

  @IsString({ each: true })
  n_language: Language[];

  @IsString({ each: true })
  l_language: Language[];

  @IsString({ each: true })
  hashtags: string[];

  @IsString()
  github_id: string;

  @IsString()
  introduction: string;
}
