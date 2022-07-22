import { createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;
  return data ? user?.[data] : user;
});
