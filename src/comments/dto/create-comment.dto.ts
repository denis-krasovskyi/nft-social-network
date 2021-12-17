import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  nftId: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}
