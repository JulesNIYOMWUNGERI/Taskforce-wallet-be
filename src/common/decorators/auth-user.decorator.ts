import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtClaimsDataDto } from '../dtos/jwt-data.dto';

/**
 * Use: The decorator can be used as a controller's function argument,
 * in the same way as @Body to get current authUser
 */
export const AuthUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtClaimsDataDto => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Explicitly map the properties from the user to JwtClaimsDataDto
    const jwtClaimsData: JwtClaimsDataDto = {
      sub: user?.id,
      email: user?.email,
    };

    return jwtClaimsData;
  },
);
