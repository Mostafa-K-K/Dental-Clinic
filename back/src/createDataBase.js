let { connection } = require("./config");

const bcrypt = require("bcryptjs");

const createDataBase = async () => {

    var admin = `CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            role_id VARCHAR(25) NOT NULL DEFAULT "AD&Mii#iin(,.<1)>mEe",
            username VARCHAR(25) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            first_name VARCHAR(15) NOT NULL,
            middle_name VARCHAR(15) NOT NULL,
            last_name VARCHAR(15) NOT NULL,
            phone VARCHAR(25) NOT NULL UNIQUE,
            token TEXT
        )`;

    var type = `CREATE TABLE IF NOT EXISTS types (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            description VARCHAR(50) NOT NULL UNIQUE,
            bill INTEGER NOT NULL
        )`;

    var thooth = `CREATE TABLE IF NOT EXISTS teeth (
            id INTEGER PRIMARY KEY,
            category VARCHAR(25) NOT NULL
        )`;

    var clinic = `CREATE TABLE IF NOT EXISTS clinics (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(15) NOT NULL UNIQUE
        )`;

    var patient = `CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            role_id VARCHAR(25) NOT NULL DEFAULT "paTI__enT?/@cc!untQq",
            username VARCHAR(25) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            first_name VARCHAR(25) NOT NULL,
            middle_name VARCHAR(25) NOT NULL,
            last_name VARCHAR(25) NOT NULL,
            phone VARCHAR(25) UNIQUE NOT NULL,
            gender VARCHAR(6) NOT NULL,
            birth DATE NOT NULL,
            marital VARCHAR(7) NOT NULL,
            health VARCHAR(100) NOT NULL DEFAULT "Null",
            address VARCHAR(100) NOT NULL,
            token TEXT
        )`;

    var doctor = `CREATE TABLE IF NOT EXISTS doctors (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            first_name VARCHAR(25) NOT NULL,
            middle_name VARCHAR(25) NOT NULL,
            last_name VARCHAR(25) NOT NULL,
            phone VARCHAR(25) UNIQUE
        )`;

    var request = `CREATE TABLE IF NOT EXISTS requests (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            description VARCHAR(255),
            date TIMESTAMP NOT NULL,
            status VARCHAR(8) NOT NULL DEFAULT "Waiting",
            id_patient INTEGER NOT NULL,
            FOREIGN KEY (id_patient) REFERENCES patients(id)
        )`;

    var appointment = `CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            description VARCHAR(255) DEFAULT "NULL",
            date DATE NOT NULL,
            start_at TIME NOT NULL,
            end_at TIME NOT NULL,
            status VARCHAR(8) DEFAULT "Waiting",
            id_patient INTEGER NOT NULL,
            id_clinic INTEGER NOT NULL,
            FOREIGN KEY (id_clinic) REFERENCES clinics(id),
            FOREIGN KEY (id_patient) REFERENCES patients(id)
        )`;

    var procedure = `CREATE TABLE IF NOT EXISTS procedures (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            date TIMESTAMP NOT NULL,
            payment INTEGER DEFAULT 0,
            balance INTEGER DEFAULT 0,
            id_patient INTEGER NOT NULL,
            id_doctor INTEGER,
            FOREIGN KEY (id_doctor) REFERENCES doctors(id),
            FOREIGN KEY (id_patient) REFERENCES patients(id)
        )`;

    var P_T_C = `CREATE TABLE IF NOT EXISTS P_T_C (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            id_procedure INTEGER NOT NULL,
            id_type INTEGER,
            id_teeth INTEGER,
            price INTEGER,
            FOREIGN KEY (id_type) REFERENCES types(id),
            FOREIGN KEY (id_teeth) REFERENCES teeth(id),
            FOREIGN KEY (id_procedure) REFERENCES procedures(id) ON DELETE CASCADE
        )`;

    const database = [admin, type, thooth, clinic, patient, doctor, request, appointment, procedure, P_T_C]
    database.map(sql => {
        connection.query(sql, function (err, result) {
            if (err) throw err;
        });
    });


    connection.query(`SELECT * FROM admins`, async function (err, result) {
        if (err) throw err;

        if (!result || result.length == 0) {
            var sql = `INSERT INTO admins(username, password, first_name, middle_name, last_name, phone, role_id) VALUES(?,?,?,?,?,?,?)`;

            let salt = await bcrypt.genSalt(10);
            let hashedPassword = await bcrypt.hash("admin", salt);

            var val = ['admin', hashedPassword, 'admin', 'admin', 'admin', '00000000', "_SuPE8/@DmIn&^%(0)__"];
            connection.query(sql, val, function (err, result) {
                if (err) throw err;
            });
        }
    });

    connection.query(`SELECT * FROM teeth`, function (err, result) {
        if (err) throw err;
        if (!result || result.length == 0) {
            var sql =

                `INSERT INTO teeth VALUES 

            (1, 'Adult'),
            (2, 'Child'),

            (11, 'Adult'),
            (12, 'Adult'),
            (13, 'Adult'),
            (14, 'Adult'),
            (15, 'Adult'),
            (16, 'Adult'),
            (17, 'Adult'),
            (18, 'Adult'),

            (21, 'Adult'),
            (22, 'Adult'),
            (23, 'Adult'),
            (24, 'Adult'),
            (25, 'Adult'),
            (26, 'Adult'),
            (27, 'Adult'),
            (28, 'Adult'),

            (31, 'Adult'),
            (32, 'Adult'),
            (33, 'Adult'),
            (34, 'Adult'),
            (35, 'Adult'),
            (36, 'Adult'),
            (37, 'Adult'),
            (38, 'Adult'),

            (41, 'Adult'),
            (42, 'Adult'),
            (43, 'Adult'),
            (44, 'Adult'),
            (45, 'Adult'),
            (46, 'Adult'),
            (47, 'Adult'),
            (48, 'Adult'),

            (51, 'Child'),
            (52, 'Child'),
            (53, 'Child'),
            (54, 'Child'),
            (55, 'Child'),

            (61, 'Child'),
            (62, 'Child'),
            (63, 'Child'),
            (64, 'Child'),
            (65, 'Child'),

            (71, 'Child'),
            (72, 'Child'),
            (73, 'Child'),
            (74, 'Child'),
            (75, 'Child'),

            (81, 'Child'),
            (82, 'Child'),
            (83, 'Child'),
            (84, 'Child'),
            (85, 'Child')`;

            connection.query(sql, function (err, result) {
                if (err) throw err;
            });
        }
    });

}
module.exports = { createDataBase };