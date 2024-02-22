import { IsString } from 'class-validator';

export class CommentDto {
  @IsString({ message: 'comment content must be a string' })
  readonly content: string;
}
