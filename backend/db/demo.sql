-- Illustrative fixtures only. Scores and attendance are invented, not historical NRL data.
INSERT INTO locations (location, surface_type) VALUES
  ('Demo Ground', 'Grass')
ON DUPLICATE KEY UPDATE surface_type = VALUES(surface_type);

INSERT INTO teams (team, stadium, city, capacity) VALUES
  ('Broncos', NULL, NULL, NULL),
  ('Cowboys', NULL, NULL, NULL),
  ('Storm', NULL, NULL, NULL)
ON DUPLICATE KEY UPDATE team = VALUES(team);

INSERT INTO matches (year, round, hteam, ateam, hscore, ascore, location, attendance) VALUES
  (2021, 1, 'Broncos', 'Cowboys', 28, 10, 'Demo Ground', 11000),
  (2021, 2, 'Cowboys', 'Storm', 18, 24, 'Demo Ground', 12000),
  (2021, 3, 'Storm', 'Broncos', 30, 6, 'Demo Ground', 13000),
  (2021, 4, 'Cowboys', 'Broncos', 12, 20, 'Demo Ground', 14000),
  (2021, 5, 'Storm', 'Cowboys', 32, 8, 'Demo Ground', 15000),
  (2021, 6, 'Broncos', 'Storm', 14, 22, 'Demo Ground', 16000),
  (2022, 1, 'Broncos', 'Cowboys', 10, 16, 'Demo Ground', 17000),
  (2022, 2, 'Cowboys', 'Storm', 20, 26, 'Demo Ground', 18000),
  (2022, 3, 'Storm', 'Broncos', 18, 12, 'Demo Ground', 19000)
ON DUPLICATE KEY UPDATE id = id;
