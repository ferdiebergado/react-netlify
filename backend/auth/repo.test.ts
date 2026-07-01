import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { NewUser, User } from '../../shared/schemas/user.ts';
import { createTestDB } from '../../tests/db.ts';
import type { Database } from '../db.ts';
import findUser, { upsertUser } from './repo.ts';

describe('auth repo', () => {
  const user: NewUser = {
    googleId: '123',
    name: 'antonio',
    email: 'antonio@example.com',
    picture: 'https://antonio.example.com',
  };

  let db: Database;

  beforeEach(async () => (db = await createTestDB()));

  afterEach(() => db.close());

  describe('upsertUser', () => {
    it('should return the user id', async () => {
      const userId = await upsertUser(db, user);

      expect(userId).toBe(1);

      const { rows } = await db.execute(
        'SELECT google_id googleId, name, email, picture, last_login_at lastLoginAt FROM users WHERE id = ? LIMIT 1',
        [userId],
      );
      const createdUser = rows[0] as unknown as User;
      expect(createdUser.googleId).toEqual(user.googleId);
      expect(createdUser.name).toEqual(user.name);
      expect(createdUser.email).toEqual(user.email);
      expect(createdUser.picture).toEqual(user.picture);
      expect(new Date(createdUser.lastLoginAt).getTime()).toBeCloseTo(
        new Date().getTime(),
        -1,
      );
    });

    it('should update the existing user', async () => {
      vi.useFakeTimers();

      await upsertUser(db, user);

      vi.advanceTimersByTime(30 * 60 * 1000);

      const userUpdate: NewUser = {
        ...user,
        picture: 'https://antonio2.example.com',
      };
      const userId = await upsertUser(db, userUpdate);

      const { rows } = await db.execute(
        'SELECT google_id googleId, name, email, picture, last_login_at lastLoginAt FROM users WHERE id = ? LIMIT 1',
        [userId],
      );
      const createdUser = rows[0] as unknown as User;
      expect(createdUser.googleId).toEqual(user.googleId);
      expect(createdUser.name).toEqual(user.name);
      expect(createdUser.email).toEqual(user.email);
      expect(createdUser.picture).toEqual(userUpdate.picture);
      expect(new Date(createdUser.lastLoginAt).getTime()).toBeCloseTo(
        new Date().getTime(),
        -1,
      );

      vi.useRealTimers();
    });
  });

  describe('findUser', () => {
    it('should return the user', async () => {
      const userId = await upsertUser(db, user);
      const foundUser = await findUser(db, userId);

      expect(foundUser).toBeDefined();

      expect(foundUser!.googleId).toEqual(user.googleId);
      expect(foundUser!.name).toEqual(user.name);
      expect(foundUser!.email).toEqual(user.email);
      expect(foundUser!.picture).toEqual(user.picture);
      expect(new Date(foundUser!.lastLoginAt).getTime()).toBeCloseTo(
        new Date().getTime(),
        -1,
      );
    });

    it('should return undefined when user does not exists', async () => {
      const nonExistentUser = await findUser(db, 999);

      expect(nonExistentUser).toBeUndefined();
    });
  });
});
