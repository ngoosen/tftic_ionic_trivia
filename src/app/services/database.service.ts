import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection, } from "@capacitor-community/sqlite";

export interface IGame {
  category: string;
  difficulty: string;
  score: number;
  total_questions: number;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  // Connexion à SQLite
  private _sqliteConnection!: SQLiteConnection;
  // Connexion à la db
  private _db!: SQLiteDBConnection;
  private _isReady: boolean = false;

  constructor() {
    this.initDatabase();
  }

  async initDatabase() {
    try {
      // Initialise la connexion SQLite grâce au capacitor
      this._sqliteConnection = new SQLiteConnection(CapacitorSQLite);
      this._db = await this._sqliteConnection.createConnection("Quizz", false, "no-encryption", 1, false);
      await this._db.open();
      await this._createTables();
      this._isReady = true;
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la base de données SQLite", error);
    }
  }

  private async _createTables() {
    await this._db.execute(`
      CREATE TABLE IF NOT EXISTS profile(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total_games INTEGER,
        total_correct INTEGER
      )
    `);

    await this._db.execute(`
      CREATE TABLE IF NOT EXISTS game_history(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT,
        difficulty TEXT,
        score INTEGER,
        total_questions INTEGER,
        date: TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  async addToHistory(game: IGame) {
    if (!this._isReady) {
      await this.initDatabase();
    }

    const query = `INSERT INTO game_history (category, difficulty, score, total_questions) VALUES ('${game.category}', '${game.difficulty}', ${game.score}, ${game.total_questions})`;

    return await this._db.execute(query);
  }

  async getHistory() {
    if (!this._isReady) {
      await this.initDatabase();
    }

    return await this._db.query(`SELECT * FROM game_history ORDER BY date DESC`);
  }
}
