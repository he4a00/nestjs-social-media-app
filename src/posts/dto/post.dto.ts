import { IsString } from 'class-validator';

export class PostDto {
  @IsString({ message: 'post content must be a string' })
  readonly content: string;
}
