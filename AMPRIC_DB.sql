-- Schéma PostgreSQL pour AMPRIC
-- Crée la base séparément si besoin : CREATE DATABASE ampric;

CREATE TABLE IF NOT EXISTS utilisateurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    telephone VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    comment TEXT,
    date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
