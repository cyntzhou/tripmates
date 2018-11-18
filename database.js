require('dotenv').config();

const mysql = require('mysql');

const config = {
  host: 'sql.mit.edu',
  user: 'jellee',
  password: 'janrice',
  database: 'jellee+tripmates',
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

    await this.query(`CREATE TABLE IF NOT EXISTS user (
      id INT PRIMARY KEY AUTOINCREMENT,
      username VARCHAR(20) NOT NULL,
      password VARCHAR(20) NOT NULL,
    );`
    ).catch(err => console.log(err));

    await this.query(`CREATE TABLE IF NOT EXISTS trip (
	    id INT PRIMARY KEY AUTOINCREMENT,
	    name VARCHAR(20) NOT NULL,
      FOREIGN KEY(creatorId) REFERENCES user(id) NOT NULL,
      startdate DATE NOT NULL,
      enddate DATE NOT NULL
    );`
    ).catch(err => console.log(err));

    await this.query(`CREATE TABLE IF NOT EXISTS tripmembership (
      FOREIGN KEY(userId) REFERENCES user(id) NOT NULL,
      FOREIGN KEY(tripId) REFERENCES trip(id) NOT NULL,
      PRIMARY KEY (userId, tripId) UNIQUE
    );`
    ).catch(err => console.log(err));

    await this.query(`CREATE TABLE IF NOT EXISTS activity (
    	id INT PRIMARY KEY AUTOINCREMENT,
    	name VARCHAR(20) NOT NULL,
    	suggestedDuration INT,
    	FOREIGN KEY (placeId) REFERENCES place(id),
    	FOREIGN KEY (tripId) REFERENCES trip(id) NOT NULL,
    	category VARCHAR(20)
    );`
    ).catch(err => console.log(err));

    await this.query(`CREATE TABLE IF NOT EXISTS place (
	    id INT PRIMARY KEY AUTOINCREMENT,
	    address VARCHAR(100)
    );`
    ).catch(err => console.log(err));

    await this.query(`CREATE TABLE IF NOT EXISTS openHours (
    	FOREIGN KEY(placeId) REFERENCES place(id),
    	day INT NOT NULL,
    	startTime TIME NOT NULL,
    	duration INT NOT NULL
    );`
    ).catch(err => console.log(err));

    await this.query(`CREATE TABLE IF NOT EXISTS itinerary (
    	id INT PRIMARY KEY AUTOINCREMENT,
    	name VARCHAR(20) NOT NULL,
    	FOREIGN KEY(tripId) REFERENCES trip(id) NOT NULL,
    	starred BOOLEAN NOT NULL
    );`
    ).catch(err => console.log(err));

    await this.query(`CREATE TABLE IF NOT EXISTS event (
    	id INT PRIMARY KEY AUTOINCREMENT,
    	FOREIGN KEY(activityId) REFERENCES activity(id) NOT NULL,
    	startDateTime DATETIME NOT NULL,
    	endDateTime DATETIME NOT NULL,
    	FOREIGN KEY (itineraryId) REFERENCES itinerary(id) NOT NULL
    );`
    ).catch(err => console.log(err));

    await this.query(`CREATE TABLE IF NOT EXISTS activityVotes (
    	FOREIGN KEY(activityId) REFERENCES activity(id) NOT NULL,
    	FOREIGN KEY(userId) REFERENCES user(id) NOT NULL,
    	value INT NOT NULL,
    	PRIMARY KEY (activityId, userId) UNIQUE
    );`
    ).catch(err => console.log(err));
  }

  /* Used for testing */
  async clearTables() {
    await database.query('TRUNCATE TABLE user');
    await database.query('TRUNCATE TABLE trip');
    await database.query('TRUNCATE TABLE tripmembership');
    await database.query('TRUNCATE TABLE activity');
    await database.query('TRUNCATE TABLE place');
    await database.query('TRUNCATE TABLE openHours');
    await database.query('TRUNCATE TABLE itinerary');
    await database.query('TRUNCATE TABLE event');
    await database.query('TRUNCATE TABLE activityVotes');
  }
}

const database = new Database(config);

module.exports = database;
