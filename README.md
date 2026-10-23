# NRL Analytics Platform

An Express API and Next.js dashboard for NRL match statistics. The included database fixture is **illustrative**, with invented scores and attendance. Replace it with licensed, verified match data before presenting results as historical NRL facts.

## Requirements

- Node.js 20 or newer and npm
- MySQL 8.0 or newer

## Run locally

1. In `backend`, run `npm ci`.
2. Copy `backend/.env.example` to `backend/.env` and set your MySQL username and password. The account needs permission to create the configured database for first setup.
3. Run `npm run db:setup` in `backend`. This creates the schema and loads an idempotent demo fixture.
4. Run `npm start` in `backend`. The API listens on port 3000 by default.
5. In a separate terminal, run `npm ci` and `npm run dev` from `frontend/nrl-dashboard`.
6. Open the URL printed by Next.js (normally `http://localhost:3001` if port 3000 is occupied by the API).

The frontend requests `/api/*` from its own origin. Next.js forwards those requests to `API_URL`, which defaults to `http://localhost:3000`. Set `API_URL` in the frontend environment when deploying the API elsewhere. Keep the API reachable from the Next.js server. The API port can be changed with `PORT` in `backend/.env`.

## Data model

- `backend/db/schema.sql`: teams, locations and matches. `matches.attendance` is the measured crowd; `teams.capacity` is venue capacity. They are separate fields.
- `backend/db/demo.sql`: repeatable, invented demo data for three teams. Stadium fields are null because no verified stadium source is bundled.
- Match results award 1 for a win, 0.5 for a draw, and 0 for a loss. Ranking endpoints require six total games, and home/away rankings require three games in that role.

Import your own verified match data into these tables to use the dashboard with real history. The API currently provides read-only endpoints in `backend/routes`. Update `teams` with sourced stadium values where available; unknown values are displayed as “Not recorded.”

## Checks

Run `npm test` in `backend` after `npm run db:setup`; it exercises the API against the demo fixture. Run `npm run build` in `frontend/nrl-dashboard`. GitHub Actions runs both checks with MySQL on pushes and pull requests.

## License

MIT; see [LICENSE](LICENSE).
