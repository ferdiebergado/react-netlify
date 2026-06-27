CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  google_id TEXT UNIQUE NOT NULL,
  name TEXT,
  email TEXT UNIQUE,
  picture TEXT,
  role TEXT DEFAULT 'user',
  deactivated_at TEXT,
  last_login_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  user_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  last_active_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  created_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  updated_at TEXT DEFAULT (STRFTIME ('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  deleted_at TEXT,
  revoked_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON sessions (session_id);

CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions (expires_at);
