require('dotenv').config();

const mysql = require('mysql');

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

class Database {
  constructor(dbConfig) {
    this.connection = mysql.createConnection(dbConfig);
  }

  query( sql, args ) {
    return new Promise( ( resolve, reject ) => {
      this.connection.query( sql, args, ( err, rows ) => {
        if ( err ) { 
          return reject( err ); 
        }
        resolve( rows );
      });
    });
  }

  // This is a helper function to close a connection to the database.
  // The connection also closes when the program stops running.
  close() {
    return new Promise((resolve, reject) => {
      this.connection.end(err => {
        if (err) { return reject( err ); }
        resolve();
      });
    });
  }

  async createTables() {
    /* Add code here, and uncomment the appropriate lines in bin/www,
     * to create database tables when starting the application
     *
     * Hint: use CREATE TABLE IF NOT EXISTS
     */

    await this.query(`CREATE TABLE IF NOT EXISTS users(
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password BINARY(60) NOT NULL
      );`
    ).catch(err => console.log(err));

    // id INT PRIMARY KEY AUTO_INCREMENT,
    await this.query(`CREATE TABLE IF NOT EXISTS freets(
        id VARCHAR(50) PRIMARY KEY,
        content VARCHAR(140) NOT NULL,
        authorId VARCHAR(50) NOT NULL REFERENCES users(id),
        originalFreetId VARCHAR(50) REFERENCES freets(id)
      );`
    ).catch(err => console.log(err));

    await this.query(`CREATE TABLE IF NOT EXISTS upvotes(
        freetId VARCHAR(50) NOT NULL REFERENCES freets(id),
        userId VARCHAR(50) NOT NULL REFERENCES users(id),
        primary key(freetId, userId)
      );`
    ).catch(err => console.log(err));

    await this.query(`CREATE TABLE IF NOT EXISTS downvotes(
        freetId VARCHAR(50) NOT NULL REFERENCES freets(id),
        userId VARCHAR(50) NOT NULL REFERENCES users(id),
        primary key(freetId, userId)
      );`
    ).catch(err => console.log(err));

    await this.query(`CREATE TABLE IF NOT EXISTS follows(
        followerId VARCHAR(50) NOT NULL REFERENCES users(id),
        followeeId VARCHAR(50) NOT NULL REFERENCES users(id),
        primary key(followerId, followeeId)
      );`
    ).catch(err => console.log(err));
  }

  /* Used for testing */
  async clearTables() {
    await database.query('TRUNCATE TABLE users');
    await database.query('TRUNCATE TABLE freets');
    await database.query('TRUNCATE TABLE follows');
    await database.query('TRUNCATE TABLE upvotes');
    await database.query('TRUNCATE TABLE downvotes');
  }
}

const database = new Database(config);

module.exports = database;
