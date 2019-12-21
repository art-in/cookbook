CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description VARCHAR(100) NOT NULL,
  complexity SMALLINT NOT NULL,
  popularity SMALLINT NOT NULL,
  has_image BOOLEAN NOT NULL,
  ingredients JSONB NOT NULL,
  steps JSONB NOT NULL
)