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
    this.connection = mysql.createPool(dbConfig);
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
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(20) NOT NULL UNIQUE,
      password VARCHAR(60) NOT NULL
      );`
    ).catch(err => console.log(err));

    await this.query(`CREATE TABLE IF NOT EXISTS trip (
	    id INT PRIMARY KEY AUTO_INCREMENT,
	    name VARCHAR(40) NOT NULL,
      creatorId INT REFERENCES user(id),
      startDate VARCHAR(10) NOT NULL,
      endDate VARCHAR(10) NOT NULL
      );`
    ).catch(err => console.log(err));

    await this.query(`CREATE TABLE IF NOT EXISTS tripMembership (
      userId INT REFERENCES user(id),
      tripId INT REFERENCES trip(id),
      PRIMARY KEY (userId, tripId)
    );`
    ).catch(err => console.log(err));

    await this.query(`CREATE TABLE IF NOT EXISTS activity (
    	id INT PRIMARY KEY AUTO_INCREMENT,
    	name VARCHAR(40) NOT NULL,
    	suggestedDuration INT,
    	placeId INT REFERENCES place(id),
    	tripId INT REFERENCES trip(id),
    	category VARCHAR(20)
    );`
    ).catch(err => console.log(err));

    await this.query(`CREATE TABLE IF NOT EXISTS place (
	    id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(40) NOT NULL,
	    address VARCHAR(100)
    );`
    ).catch(err => console.log(err));

    await this.query(`CREATE TABLE IF NOT EXISTS openHours (
      id INT PRIMARY KEY AUTO_INCREMENT,
    	placeId INT REFERENCES place(id),
    	day INT NOT NULL,
    	startTime VARCHAR(5) NOT NULL,
    	duration INT NOT NULL
    );`
    ).catch(err => console.log(err));

    await this.query(`CREATE TABLE IF NOT EXISTS itinerary (
    	id INT PRIMARY KEY AUTO_INCREMENT,
    	name VARCHAR(40) NOT NULL,
    	tripId INT REFERENCES trip(id),
    	starred BOOLEAN NOT NULL
    );`
    ).catch(err => console.log(err));

    await this.query(`CREATE TABLE IF NOT EXISTS event (
    	id INT PRIMARY KEY AUTO_INCREMENT,
    	activityId INT REFERENCES activity(id),
    	startDateTime VARCHAR(16) NOT NULL,
    	endDateTime VARCHAR(16) NOT NULL,
    	itineraryId INT REFERENCES itinerary(id)
    );` // startDateTime and endDateTime formatted as YYYY-MM-DD HH:MM
    ).catch(err => console.log(err));

    await this.query(`CREATE TABLE IF NOT EXISTS activityVotes (
    	activityId INT REFERENCES activity(id),
    	userId INT REFERENCES user(id),
    	value INT NOT NULL,
    	PRIMARY KEY (activityId, userId)
    );`
    ).catch(err => console.log(err));
  }

  /* Used for testing */
  async clearTables() {
    await database.query('TRUNCATE TABLE user');
    await database.query('TRUNCATE TABLE trip');
    await database.query('TRUNCATE TABLE tripMembership');
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
