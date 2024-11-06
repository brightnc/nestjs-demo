import { HttpStatus } from '@nestjs/common';

export const createResponse = (
  status: HttpStatus,
  message: string,
  data?: any,
) => ({
  status,
  message,
  data,
});
