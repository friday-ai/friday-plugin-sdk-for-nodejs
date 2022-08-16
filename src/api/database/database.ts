import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';
import { DataError } from 'node-json-db/dist/lib/Errors';

export default class Database {
  public database: JsonDB;

  constructor(name: string) {
    this.database = new JsonDB(new Config(`./cache/user.${name}.database.json`, true, true, '/'));
  }

  public async getData<T>(path: string, defaultValue?: T): Promise<T> {
    try {
      const data = await this.database.getData(path);
      return JSON.parse(data);
    } catch (e) {
      const err = e as DataError;
      if (err.message.includes("Can't find dataPath")) {
        await this.database.push(path, defaultValue || {});
        return this.getData<T>(path);
      }
      throw e;
    }
  }

  public async insert(path: string, data: unknown, override = true): Promise<void> {
    // Stringify data if it's an object or array,
    // see : https://github.com/Belphemur/node-json-db/issues/460
    await this.database.push(path, JSON.stringify(data), override);
  }
}
