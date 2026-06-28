import findUser from '../../backend/auth/repo.ts';
import { db } from '../../backend/db.ts';
import { UnauthorizedError } from '../../backend/errors.ts';
import { withMiddlewares } from '../../backend/http/middlewares.ts';
import type { AppRequest, HttpMethod } from '../../backend/http/types.ts';
import type { Profile } from '../../shared/schemas/user.ts';
import type { ApiResponse } from '../../shared/types.ts';

async function handler(request: AppRequest): Promise<Response> {
  const allowedMethod: HttpMethod = 'GET';

  if (request.method !== allowedMethod)
    return new Response(undefined, { status: 405, headers: { Allow: allowedMethod } });

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

export default withMiddlewares(handler);
