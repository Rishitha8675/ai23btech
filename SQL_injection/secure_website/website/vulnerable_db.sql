
CREATE DATABASE vulnerable_db;
USE vulnerable_db;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255)
);
INSERT INTO users (username, password, email) VALUES 
('Murthy', '123456', 'Murty123@gmail.com'),
('Gopal', 'qwerty', 'Gopal_Krishna65@gmail.com'),
('Ranjith', 'hello345', 'Ranjith_Kumar98@gmail.com');
CREATE TABLE health_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patients_name VARCHAR(255),
    patients_number VARCHAR(255),
    amount_received INT
);
INSERT INTO health_info (patients_name, patients_number, amount_received) 
VALUES 
('Murty', '9345278908', 12000),
('Gopal', '9554324848', 15000),
('Ranjith', '7453897589', 18000);
