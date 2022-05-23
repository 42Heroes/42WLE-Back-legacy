import { IsString, IsDate } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nickname: string;
}

// export interface LanguageProps {
//   language: string;
//   flag: string;
// }

// export interface CreateUserDto {
//   _id: string;
//   nickname: string;
//   image_url: string;
//   n_language: LanguageProps[];
//   l_language: LanguageProps[];
//   intra_id: string;
//   campus: string;
//   createdAt: Date;
//   hashtags: string[];
//   country: string;
//   github_id: string;
//   introduction: string;
//   chat_room: number[];
//   liked_users: string[];
//   saved_posts: string[];
//   posts: string[];
//   join_date: Date;
// }
