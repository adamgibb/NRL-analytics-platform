const { teamGames, sendQuery } = require('./queries');

exports.getAllMatches = (req, res) => sendQuery(res, 'SELECT * FROM matches ORDER BY year, round');

exports.getTeamTrends = (req, res) => sendQuery(res, `
  WITH ${teamGames}
  SELECT team, surface_type,
    AVG(CASE WHEN game_type = 'home' THEN result END) AS home_win_rate,
    AVG(CASE WHEN game_type = 'away' THEN result END) AS away_win_rate,
    AVG(result) AS overall_win_rate,
    COUNT(*) AS games_played
  FROM team_games GROUP BY team, surface_type ORDER BY team, surface_type`);

const overall = `WITH ${teamGames}
  SELECT team, AVG(result) AS overall_win_rate, COUNT(*) AS games_played
  FROM team_games GROUP BY team HAVING COUNT(*) >= 6`;

exports.getBestWinOverall = (req, res) => sendQuery(res, `${overall} ORDER BY overall_win_rate DESC, team LIMIT 1`);
exports.getWorstWinOverall = (req, res) => sendQuery(res, `${overall} ORDER BY overall_win_rate ASC, team LIMIT 1`);

// Attendance belongs to a match; venue capacity is deliberately not used as a crowd figure.
exports.getCrowdWins = (req, res) => sendQuery(res, `
  WITH ${teamGames}
  SELECT 'Smallest Crowd for Wins' AS description, team, game_type,
    MIN(attendance) AS crowd_size
  FROM team_games WHERE result = 1 AND attendance IS NOT NULL
  GROUP BY team, game_type
  UNION ALL
  SELECT 'Largest Crowd for Losses', team, game_type, MAX(attendance)
  FROM team_games WHERE result = 0 AND attendance IS NOT NULL
  GROUP BY team, game_type`);

exports.getTeamStadiums = (req, res) => sendQuery(res,
  'SELECT team, stadium AS Stadium, city AS Location, capacity AS Capacity FROM teams ORDER BY team');
