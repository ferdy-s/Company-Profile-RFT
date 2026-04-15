-- Separate database for Keycloak (main POSTGRES_DB is for the app).
-- Runs once on first Postgres volume init.
CREATE DATABASE keycloak;
