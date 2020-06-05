CREATE TYPE datatype AS ENUM (
    'number',
    'quality-score',
    'yes-no'
);

CREATE TABLE journal_settings (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY, 
    user_id INTEGER REFERENCES users(id),
    target_name TEXT NOT NULL, 
    units TEXT, 
    type datatype NOT NULL,
    description TEXT NOT NULL,
    habit_1 TEXT NOT NULL, 
    habit_2 TEXT, 
    habit_3 TEXT
);