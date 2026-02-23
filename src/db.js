import fs from "node:fs/promises";

const DATABASE_PATH = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(DATABASE_PATH, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    fs.writeFile(DATABASE_PATH, JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key]?.toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();
    return data;
  }

  findById(table, id) {
    const data = this.#database[table] ?? [];
    return data.find((row) => row.id === id);
  }

  update(table, id, data) {
    const rowIndex = (this.#database[table] ?? []).findIndex(
      (row) => row.id === id
    );

    if (rowIndex > -1) {
      const current = this.#database[table][rowIndex];
      this.#database[table][rowIndex] = { ...current, ...data };
      this.#persist();
      return this.#database[table][rowIndex];
    }

    return null;
  }

  delete(table, id) {
    const rowIndex = (this.#database[table] ?? []).findIndex(
      (row) => row.id === id
    );

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
      return true;
    }

    return false;
  }
}
