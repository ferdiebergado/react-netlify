import { api } from '@/app/lib/http-client';
import type { Profile } from '@/shared/schemas/user';

export const fetchCurrentUser = async (): Promise<Profile | null> =>
  await api.get('/me');

export const signout = async (): Promise<void | null> =>
  await api.post('/signout');
