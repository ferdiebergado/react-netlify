import { db } from '../../backend/db.ts';

export default async () => {
  await db.execute('SELECT 1');
  return new Response('hello');
};
