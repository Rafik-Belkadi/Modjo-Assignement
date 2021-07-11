import { IsNumber, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

/**
 * This dto is used to control user inputs and make sure it is valid data to create comments.
 * If the input provided to the endpoint does not match the rules defined by decorators here,
 * the endpoint will immediately return an error.
 * More info here: https://docs.nestjs.com/techniques/validation
 */
export class CreateCommentDto {
  @IsNumber()
  @ApiModelProperty({ type: Number })
  callId: number;

  @IsString()
  @ApiModelProperty({ type: String })
  comment: string;

  @IsString()
  @ApiModelProperty({ type: String })
  timestamp: string;
}
