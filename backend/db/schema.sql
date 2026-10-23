CREATE TABLE IF NOT EXISTS locations (
  location VARCHAR(120) PRIMARY KEY,
  surface_type VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS teams (
  team VARCHAR(120) PRIMARY KEY,
  stadium VARCHAR(120) NULL,
  city VARCHAR(120) NULL,
  capacity INT UNSIGNED NULL
);

CREATE TABLE IF NOT EXISTS matches (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  year SMALLINT UNSIGNED NOT NULL,
  round TINYINT UNSIGNED NOT NULL,
  hteam VARCHAR(120) NOT NULL,
  ateam VARCHAR(120) NOT NULL,
  hscore TINYINT UNSIGNED NOT NULL,
  ascore TINYINT UNSIGNED NOT NULL,
  location VARCHAR(120) NOT NULL,
  attendance INT UNSIGNED NULL,
  UNIQUE KEY unique_fixture (year, round, hteam, ateam),
  INDEX matches_home_team (hteam),
  INDEX matches_away_team (ateam),
  FOREIGN KEY (hteam) REFERENCES teams(team),
  FOREIGN KEY (ateam) REFERENCES teams(team),
  FOREIGN KEY (location) REFERENCES locations(location)
);
