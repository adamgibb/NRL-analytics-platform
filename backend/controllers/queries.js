const pool = require('../config/db');

const teamGames = `team_games AS (
  SELECT m.hteam AS team, m.ateam AS opponent, m.year, m.round,
    l.surface_type, 'home' AS game_type, m.hscore AS points_for,
    m.ascore AS points_against, m.attendance,
    CASE WHEN m.hscore > m.ascore THEN 1 WHEN m.hscore < m.ascore THEN 0 ELSE 0.5 END AS result
  FROM matches m JOIN locations l ON m.location = l.location
  UNION ALL
  SELECT m.ateam, m.hteam, m.year, m.round,
    l.surface_type, 'away', m.ascore, m.hscore, m.attendance,
    CASE WHEN m.ascore > m.hscore THEN 1 WHEN m.ascore < m.hscore THEN 0 ELSE 0.5 END
  FROM matches m JOIN locations l ON m.location = l.location
)`;

function sendQuery(res, sql, params = []) {
  pool.query(sql, params, (error, rows) => {
    if (error) {
      console.error('Database query failed:', error);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(rows);
  });
}

module.exports = { teamGames, sendQuery };
