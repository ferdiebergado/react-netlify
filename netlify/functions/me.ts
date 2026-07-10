import findUser from '../../backend/auth/repo.ts';
import { db } from '../../backend/db.ts';
import { UnauthorizedError } from '../../backend/errors.ts';
import {
  checkMethod,
  withMiddlewares,
} from '../../backend/http/middlewares.ts';
import type { AppRequest } from '../../backend/http/types.ts';
import type { Profile } from '../../shared/schemas/user.ts';
import type { ApiResponse } from '../../shared/types.ts';

async function handler(request: AppRequest): Promise<Response> {
  const user = await findUser(db, request.session.userId);

  if (!user) throw new UnauthorizedError('user not found');

  const data: Profile = {
    name: user.name,
    email: user.email,
    picture: user.picture,
  };

  const payload: ApiResponse<Profile> = {
    success: true,
    data,
  };

  return Response.json(payload);
}

export default withMiddlewares(checkMethod(handler, ['GET']));
