CREATE TABLE messages(
       usr TEXT NOT NULL,
       text TEXT NOT NULL
);

CREATE TABLE followers(
       follower TEXT NOT NULL,
       followed TEXT NOT NULL
);

-- CREATE INDEX ON messages(usr);
-- CREATE INDEX ON followers(follower);
