CREATE SEQUENCE messageIds;

CREATE TABLE messages(
       id INTEGER NOT NULL PRIMARY KEY,
       usr TEXT NOT NULL,
       text TEXT NOT NULL
);

CREATE TABLE followers(
       follower TEXT NOT NULL,
       followed TEXT NOT NULL
);

CREATE TABLE hashtags(
       tag TEXT NOT NULL,
       message INTEGER NOT NULL REFERENCES messages(id),
       PRIMARY KEY (tag, message)
);

CREATE INDEX ON messages(usr);
CREATE INDEX ON followers(follower);
