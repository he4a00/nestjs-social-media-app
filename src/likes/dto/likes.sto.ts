import { IsBoolean } from 'class-validator';

export class LikesDto {
  @IsBoolean()
  readonly isLiked: boolean;
}
