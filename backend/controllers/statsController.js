const { teamGames, sendQuery } = require('./queries');

function surfaceRanking(res, direction) {
  return sendQuery(res, `WITH ${teamGames}, performance AS (
    SELECT team, surface_type, AVG(result) AS win_rate, COUNT(*) AS games_played
    FROM team_games GROUP BY team, surface_type HAVING COUNT(*) >= 6
  ), ranked AS (
    SELECT *, RANK() OVER (PARTITION BY surface_type ORDER BY win_rate ${direction}) AS win_rank
    FROM performance
  ) SELECT team, surface_type, win_rate, games_played FROM ranked
    WHERE win_rank = 1 ORDER BY surface_type, team`);
}

exports.getBestSurfaceWin = (req, res) => surfaceRanking(res, 'DESC');
exports.getWorstSurfaceWin = (req, res) => surfaceRanking(res, 'ASC');

function venueRanking(res, type, direction) {
  const field = type === 'home' ? 'home_win_rate' : 'away_win_rate';
  return sendQuery(res, `WITH ${teamGames}
    SELECT team, AVG(result) AS ${field}, COUNT(*) AS games_played
    FROM team_games WHERE game_type = ? GROUP BY team HAVING COUNT(*) >= 3
    ORDER BY ${field} ${direction}, team LIMIT 1`, [type]);
}

exports.getBestHomeWin = (req, res) => venueRanking(res, 'home', 'DESC');
exports.getBestAwayWin = (req, res) => venueRanking(res, 'away', 'DESC');
exports.getWorstHomeWin = (req, res) => venueRanking(res, 'home', 'ASC');
exports.getWorstAwayWin = (req, res) => venueRanking(res, 'away', 'ASC');

exports.getAllOverallWins = (req, res) => sendQuery(res, `WITH ${teamGames}
  SELECT team, AVG(result) AS overall_win_rate, COUNT(*) AS games_played
  FROM team_games GROUP BY team ORDER BY overall_win_rate DESC, team`);

exports.getPointsForAgainst = (req, res) => sendQuery(res, `WITH ${teamGames}, totals AS (
  SELECT team, AVG(result) AS overall_win_rate,
    SUM(points_for) AS total_points_scored,
    SUM(points_against) AS total_points_conceded,
    COUNT(*) AS games_played
  FROM team_games GROUP BY team HAVING COUNT(*) >= 6
), ranked AS (
  SELECT *, ROW_NUMBER() OVER (ORDER BY overall_win_rate DESC, team) AS best_rank,
    ROW_NUMBER() OVER (ORDER BY overall_win_rate ASC, team) AS worst_rank FROM totals
)
SELECT 'Highest Win Percentage Team' AS team_type, team, total_points_scored, total_points_conceded
FROM ranked WHERE best_rank = 1
UNION ALL
SELECT 'Lowest Win Percentage Team', team, total_points_scored, total_points_conceded
FROM ranked WHERE worst_rank = 1`);

exports.getBestSeason = (req, res) => sendQuery(res, `WITH ${teamGames}, seasons AS (
  SELECT team, year, SUM(result = 1) AS total_wins_in_season
  FROM team_games GROUP BY team, year
)
SELECT team, year, total_wins_in_season FROM seasons s
WHERE total_wins_in_season = (SELECT MAX(total_wins_in_season) FROM seasons WHERE team = s.team)
ORDER BY team, year`);

exports.getBiggestScore = (req, res) => sendQuery(res, `WITH ${teamGames}, scored AS (
  SELECT team, opponent, year, round, points_for - points_against AS best_score_difference,
    points_for AS best_score_for_team, points_against AS best_opponent_score,
    CASE WHEN points_for > points_against THEN 'win' ELSE 'loss' END AS result_type
  FROM team_games WHERE points_for <> points_against
), ranked AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY team, result_type
    ORDER BY ABS(best_score_difference) DESC, year, round) AS score_rank FROM scored
)
SELECT team, opponent, year, round, best_score_difference, best_score_for_team,
  best_opponent_score, result_type
FROM ranked WHERE score_rank = 1 ORDER BY team, result_type`);
