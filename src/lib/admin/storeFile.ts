import fs from 'fs';
import path from 'path';

export const storePath = path.join(process.cwd(), 'src', 'data', 'admin-content.json');

export function readStoreFile<T>() {
  if (!fs.existsSync(storePath)) return null;
  const raw = fs.readFileSync(storePath, 'utf8');
  return JSON.parse(raw) as T;
}

export function writeStoreFile<T>(data: T) {
  // Ensure the directory exists so writing the JSON file never fails due to missing folders.
  const dir = path.dirname(storePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(storePath, JSON.stringify(data, null, 2), 'utf8');
}
