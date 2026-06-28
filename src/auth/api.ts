import type { Profile } from '../../shared/schemas/user';
import { api } from '../lib/http-client';

export const fetchCurrentUser = async (): Promise<Profile | null> => await api.get('/me');

export const signout = async (): Promise<void | null> => await api.post('/signout');
