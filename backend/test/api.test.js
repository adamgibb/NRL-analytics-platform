const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../app');
const pool = require('../config/db');

let server;
let baseUrl;

test.before(async () => {
  await new Promise(resolve => { server = app.listen(0, '127.0.0.1', resolve); });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise(resolve => server.close(resolve));
  await new Promise(resolve => pool.end(resolve));
});

async function get(path) {
  const response = await fetch(`${baseUrl}${path}`);
  assert.equal(response.status, 200, `${path}: ${await response.text()}`);
  return response.json();
}

test('overall ranking counts each home and away appearance once', async () => {
  const rows = await get('/get_all_overall_wins');
  assert.equal(rows.find(row => row.team === 'Storm').games_played, 6);
  assert.equal(Number(rows.find(row => row.team === 'Storm').overall_win_rate), 1);
  assert.ok(Math.abs(Number(rows.find(row => row.team === 'Cowboys').overall_win_rate) - 1 / 6) < 0.0001);
});

test('surface rate combines home and away games before ranking', async () => {
  const rows = await get('/get_best_surface_win');
  assert.deepEqual(rows.map(row => row.team), ['Storm']);
  assert.equal(rows[0].games_played, 6);
});

test('season wins include away matches', async () => {
  const rows = await get('/get_best_season');
  assert.equal(Number(rows.find(row => row.team === 'Storm').total_wins_in_season), 4);
});

test('away score is from the selected team perspective', async () => {
  const rows = await get('/get_biggest_score');
  const loss = rows.find(row => row.team === 'Cowboys' && row.result_type === 'loss');
  assert.equal(loss.best_score_for_team, 8);
  assert.equal(loss.best_opponent_score, 32);
});

test('crowd uses actual attendance and missing stadium data stays unknown', async () => {
  const crowds = await get('/get_crowd_wins');
  assert.equal(crowds.find(row => row.team === 'Storm' && row.game_type === 'away' && row.description === 'Smallest Crowd for Wins').crowd_size, 12000);
  const stadiums = await get('/get_team_stadiums');
  assert.equal(stadiums.find(row => row.team === 'Storm').Capacity, null);
});
