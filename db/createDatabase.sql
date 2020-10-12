-- create database
CREATE DATABASE sylEval;
USE sylEval;

-- create tables
CREATE TABLE user (
    userid     MEDIUMINT NOT NULL AUTO_INCREMENT,
    username   VARCHAR(30) NOT NULL,
    userrole   VARCHAR(10) NOT NULL,
    PRIMARY KEY (userid)
);

CREATE TABLE usersyllabus (
    syllabusid          MEDIUMINT NOT NULL AUTO_INCREMENT,
    usersyllabusname    VARCHAR(50) NOT NULL,
    usersyllabusscore   INTEGER(2),
    missingfields       TEXT,
    userid              MEDIUMINT NOT NULL,
    PRIMARY KEY (syllabusid)
);

ALTER TABLE usersyllabus
    ADD CONSTRAINT userid FOREIGN KEY ( userid )
        REFERENCES user ( userid );

-- create user
CREATE USER 'maristSylUser'@'localhost' identified by 'MaristSyllabusEvaluator2020!'; -- or choose a different password
GRANT ALL ON sylEval.* to 'maristSylUser'@'localhost';

-- may need for debugging to start server back up using connection
mysql -u root -p
ALTER USER 'maristSylUser'@'localhost' IDENTIFIED WITH mysql_native_password BY 'MaristSyllabusEvaluator2020!';
flush privileges;

-- exit and switch user to our new user
exit
-u maristSylUser -p -- then enter the password MaristSyllabusEvaluator2020!

-- insert sample data
INSERT INTO user (username, userrole) VALUES
    ('emily.doran1', 'user');

INSERT INTO usersyllabus (usersyllabusname, usersyllabusscore, missingfields, userid) VALUES
    ('EmilyDoranSyllabus1.pdf', 100, 'inclusion statement. office hours',
     (SELECT userid FROM user WHERE username = 'emily.doran1'));

-- show data
SELECT * FROM user;

SELECT * FROM usersyllabus;
