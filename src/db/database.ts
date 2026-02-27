import { createClient, Client, InValue } from '@libsql/client';
import { config } from '../config';

export interface ScheduledPost {
  id: number;
  type: 'image' | 'carousel' | 'reel';
  caption: string;
  media_urls: string;
  scheduled_at: string;
  status: 'pending' | 'publishing' | 'published' | 'failed';
  ig_media_id: string | null;
  error_message: string | null;
  created_at: string;
}

export type NewPost = Pick<ScheduledPost, 'type' | 'caption' | 'media_urls' | 'scheduled_at'>;

let client: Client;

export function getDb(): Client {
  if (!client) {
    client = createClient({
      url: config.turso.url,
      authToken: config.turso.authToken,
    });
  }
  return client;
}

export async function initSchema(): Promise<void> {
  const db = getDb();
  await db.batch([
    `CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('image', 'carousel', 'reel')),
      caption TEXT NOT NULL DEFAULT '',
      media_urls TEXT NOT NULL DEFAULT '[]',
      scheduled_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'publishing', 'published', 'failed')),
      ig_media_id TEXT,
      error_message TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS tokens (
      id INTEGER PRIMARY KEY CHECK(id = 1),
      page_token TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS pipeline_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id TEXT NOT NULL,
      template_name TEXT,
      content_json TEXT,
      post_id INTEGER,
      status TEXT NOT NULL DEFAULT 'started' CHECK(status IN ('started', 'completed', 'failed')),
      error_message TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  ]);
}

export async function createPost(post: NewPost): Promise<ScheduledPost> {
  const db = getDb();
  const result = await db.execute({
    sql: 'INSERT INTO posts (type, caption, media_urls, scheduled_at) VALUES (?, ?, ?, ?)',
    args: [post.type, post.caption, post.media_urls, post.scheduled_at],
  });
  return (await getPostById(Number(result.lastInsertRowid)))!;
}

export async function getPostById(id: number): Promise<ScheduledPost | undefined> {
  const db = getDb();
  const result = await db.execute({ sql: 'SELECT * FROM posts WHERE id = ?', args: [id] });
  return result.rows[0] as unknown as ScheduledPost | undefined;
}

export async function getAllPosts(): Promise<ScheduledPost[]> {
  const db = getDb();
  const result = await db.execute('SELECT * FROM posts ORDER BY scheduled_at DESC');
  return result.rows as unknown as ScheduledPost[];
}

export async function getDuePosts(): Promise<ScheduledPost[]> {
  const db = getDb();
  const result = await db.execute(
    "SELECT * FROM posts WHERE status = 'pending' AND scheduled_at <= datetime('now') ORDER BY scheduled_at ASC"
  );
  return result.rows as unknown as ScheduledPost[];
}

export async function updatePostStatus(
  id: number,
  status: ScheduledPost['status'],
  extra?: { ig_media_id?: string; error_message?: string }
): Promise<void> {
  const fields = ['status = ?'];
  const args: InValue[] = [status];

  if (extra?.ig_media_id) {
    fields.push('ig_media_id = ?');
    args.push(extra.ig_media_id);
  }
  if (extra?.error_message) {
    fields.push('error_message = ?');
    args.push(extra.error_message);
  }

  args.push(id);
  await getDb().execute({
    sql: `UPDATE posts SET ${fields.join(', ')} WHERE id = ?`,
    args,
  });
}

export async function deletePost(id: number): Promise<boolean> {
  const result = await getDb().execute({
    sql: "DELETE FROM posts WHERE id = ? AND status = 'pending'",
    args: [id],
  });
  return result.rowsAffected > 0;
}

export async function savePageToken(token: string): Promise<void> {
  await getDb().execute({
    sql: `INSERT INTO tokens (id, page_token, updated_at) VALUES (1, ?, datetime('now'))
          ON CONFLICT(id) DO UPDATE SET page_token = excluded.page_token, updated_at = datetime('now')`,
    args: [token],
  });
}

export async function getPageToken(): Promise<string | undefined> {
  const result = await getDb().execute('SELECT page_token FROM tokens WHERE id = 1');
  const row = result.rows[0] as unknown as { page_token: string } | undefined;
  return row?.page_token;
}

// --- Pipeline log ---

export interface PipelineLogEntry {
  id: number;
  topic_id: string;
  template_name: string | null;
  content_json: string | null;
  post_id: number | null;
  status: 'started' | 'completed' | 'failed';
  error_message: string | null;
  created_at: string;
}

export async function createPipelineLog(topicId: string): Promise<number> {
  const result = await getDb().execute({
    sql: 'INSERT INTO pipeline_log (topic_id) VALUES (?)',
    args: [topicId],
  });
  return Number(result.lastInsertRowid);
}

export async function updatePipelineLog(
  id: number,
  updates: {
    template_name?: string;
    content_json?: string;
    post_id?: number;
    status?: PipelineLogEntry['status'];
    error_message?: string;
  }
): Promise<void> {
  const fields: string[] = [];
  const args: InValue[] = [];

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      args.push(value as InValue);
    }
  }
  if (fields.length === 0) return;

  args.push(id);
  await getDb().execute({
    sql: `UPDATE pipeline_log SET ${fields.join(', ')} WHERE id = ?`,
    args,
  });
}

export async function getRecentPipelineLogs(limit = 20): Promise<PipelineLogEntry[]> {
  const result = await getDb().execute({
    sql: 'SELECT * FROM pipeline_log ORDER BY created_at DESC LIMIT ?',
    args: [limit],
  });
  return result.rows as unknown as PipelineLogEntry[];
}

export async function getLastUsedTopicId(): Promise<string | undefined> {
  const result = await getDb().execute(
    "SELECT topic_id FROM pipeline_log WHERE status = 'completed' ORDER BY created_at DESC LIMIT 1"
  );
  const row = result.rows[0] as unknown as { topic_id: string } | undefined;
  return row?.topic_id;
}

export async function getRecentPostTitles(days = 7): Promise<{ topic_id: string; title: string }[]> {
  const result = await getDb().execute({
    sql: `SELECT topic_id, content_json FROM pipeline_log
          WHERE status = 'completed'
            AND content_json IS NOT NULL
            AND created_at >= datetime('now', '-' || ? || ' days')
          ORDER BY created_at DESC`,
    args: [days],
  });
  return result.rows
    .map((row: any) => {
      try {
        const content = JSON.parse(row.content_json);
        return { topic_id: row.topic_id as string, title: content.coverTitle || '' };
      } catch {
        return { topic_id: row.topic_id as string, title: '' };
      }
    })
    .filter((r: { title: string }) => r.title);
}
