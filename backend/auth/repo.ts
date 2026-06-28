import type { NewUser, User } from '../../shared/schemas/user.ts';
import type { Database } from '../db.ts';

export async function upsertUser(db: Database, user: NewUser): Promise<User['id']> {
  const sql = `
INSERT INTO users (google_id, name, email, picture, role)
VALUES (?, ?, ?, ?, ?)
ON CONFLICT (google_id)
DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  picture = EXCLUDED.picture,
  last_login_at = ?
RETURNING id
`;

  const { rows } = await db.execute<Pick<User, 'id'>>(sql, [
    user.googleId,
    user.name ?? null,
    user.email ?? null,
    user.picture ?? null,
    new Date().toISOString(),
  ]);

  return rows[0].id;
}

export default async function findUser(db: Database, id: User['id']): Promise<User | undefined> {
  const sql = `
SELECT id, google_id googleId, email, name, picture, role, last_login_at lastLoginAt, updated_at updatedAt, created_at createAt
FROM users
WHERE id = ? AND deactivated_at IS NULL
LIMIT 1
`;

  const { rows } = await db.execute<User>(sql, [id]);

  return rows[0];
}
