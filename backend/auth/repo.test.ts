import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NewUser, User } from '../../shared/schemas/user.ts';
import { createTestDB } from '../../tests/db.ts';
import type { Database } from '../db.ts';
import findUser, { upsertUser } from './repo.ts';

describe('auth repo', () => {
  const createMockUser = (overrides?: Partial<NewUser>): NewUser => ({
    googleId: '123',
    name: 'antonio',
    email: 'antonio@example.com',
    picture: 'https://antonio.example.com',
    ...overrides,
  });

  const getUserFromDb = async (db: Database, userId: number): Promise<User> => {
    const { rows } = await db.execute<User>(
      'SELECT google_id googleId, name, email, picture, last_login_at lastLoginAt FROM users WHERE id = ? LIMIT 1',
      [userId],
    );
    return rows[0];
  };

  let db: Database;

  beforeEach(async () => (db = await createTestDB()));

  afterEach(() => db.close());

  describe('upsertUser', () => {
    it('should return the user id', async () => {
      const user = createMockUser();
      const userId = await upsertUser(db, user);

      expect(userId).toBe(1);

      const createdUser = await getUserFromDb(db, userId);
      expect(createdUser.googleId).toEqual(user.googleId);
      expect(createdUser.name).toEqual(user.name);
      expect(createdUser.email).toEqual(user.email);
      expect(createdUser.picture).toEqual(user.picture);
      const timeDiffMs = Math.abs(
        new Date(createdUser.lastLoginAt).getTime() - new Date().getTime(),
      );
      expect(timeDiffMs).toBeLessThan(1000);
    });

    it('should update the existing user', async () => {
      vi.useFakeTimers();
      try {
        const user = createMockUser();

        await upsertUser(db, user);

        vi.advanceTimersByTime(30 * 60 * 1000);

        const userUpdate: NewUser = {
          ...user,
          picture: 'https://antonio2.example.com',
        };
        const userId = await upsertUser(db, userUpdate);

        const createdUser = await getUserFromDb(db, userId);
        expect(createdUser.googleId).toEqual(user.googleId);
        expect(createdUser.name).toEqual(user.name);
        expect(createdUser.email).toEqual(user.email);
        expect(createdUser.picture).toEqual(userUpdate.picture);
        const timeDiffMs = Math.abs(
          new Date(createdUser.lastLoginAt).getTime() - new Date().getTime(),
        );
        expect(timeDiffMs).toBeLessThan(1000);
      } finally {
        vi.useRealTimers();
      }
    });

    it.todo('null/empty optional fields');
    it.todo('concurrent upsert operations');
  });

  describe('findUser', () => {
    it('should return the user', async () => {
      const user = createMockUser();

      const userId = await upsertUser(db, user);
      const foundUser = await findUser(db, userId);

      expect(foundUser).toBeDefined();

      expect(foundUser!.googleId).toEqual(user.googleId);
      expect(foundUser!.name).toEqual(user.name);
      expect(foundUser!.email).toEqual(user.email);
      expect(foundUser!.picture).toEqual(user.picture);
      const timeDiffMs = Math.abs(
        new Date(foundUser!.lastLoginAt).getTime() - new Date().getTime(),
      );
      expect(timeDiffMs).toBeLessThan(1000); // Within 1 second
    });

    it('should return undefined when user does not exists', async () => {
      const nonExistentUser = await findUser(db, 999);

      expect(nonExistentUser).toBeUndefined();
    });
  });
});
