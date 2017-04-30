CREATE TABLE list (
    id SERIAL PRIMARY KEY NOT NULL,
    item VARCHAR(140),
    complete BOOLEAN DEFAULT false
);
