CREATE TABLE wikipages (
  ID SERIAL PRIMARY KEY,
  title VARCHAR(100),
  content json NOT NULL,
  created_at timestamp NOT NULL DEFAULT NOW(),
  updated_at timestamp NOT NULL DEFAULT NOW(),
  space_id int4 REFERENCES spaces ON DELETE CASCADE
);

CREATE TABLE spaces (
  ID SERIAL PRIMARY KEY,
  title VARCHAR(100),
);

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ 
LANGUAGE plpgsql;


CREATE TRIGGER set_timestamp
BEFORE UPDATE ON wikipages
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();