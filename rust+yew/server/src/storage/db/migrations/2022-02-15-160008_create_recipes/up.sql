CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  complexity SMALLINT NOT NULL,
  popularity SMALLINT NOT NULL,
  has_image BOOLEAN NOT NULL,
  ingredients JSONB NOT NULL,
  steps JSONB NOT NULL
)