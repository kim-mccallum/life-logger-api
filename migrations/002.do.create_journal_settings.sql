CREATE TYPE datatype AS ENUM (
    'number',
    'quality-score',
    'yes-no'
);

CREATE TABLE journal_settings (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY, 
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    target_name TEXT NOT NULL, 
    units TEXT, 
    type datatype NOT NULL,
    target_description TEXT,
    habit_name TEXT NOT NULL, 
    habit_description TEXT
);