# kanji-practice

A web app for practicing Japanese kanji readings and meanings from JLPT N5 to N1.

This project is designed to demonstrate:
- A React + Express + PostgreSQL app running fully in Docker
- Weighted random questions that bring back the words a user often misses
- Cookie-based JWT auth with role-based admin pages
- Layered server code: routes, controllers, services, repositories
- Structured logging, rate limiting, and browser error reporting

---

## ✨ Features

- Sign up and sign in with email. The session is a JWT in an `httpOnly` cookie.
- Practice on `/quiz`:
  - "How do you read this?" and "What does this mean?" questions, in Thai or English.
  - Multiple choice with 4 options, or typing the answer.
  - Pick one or more levels from N5 to N1.
  - "Focus on words I often miss" picks weak words more often.
  - "I was right" marks a typed answer correct when it only has a small typo.
  - Hotkeys: `1`–`4` to choose, `Enter` for the next question.
- See progress on `/stats`: accuracy, progress per level, weak words, and a reset button.
- Manage vocabulary on `/admin/words` (admin only): add, edit, delete, search, filter by level, and paginate.
- See all users on `/admin/users` (admin only).
- Switch between Thai and English, and between light and dark themes.

---

## 🧠 Business Rules

1. Multiple choice needs at least 4 words in the selected levels, so there are enough choices.
2. Typing mode only asks for meanings, in the language the user has selected.
3. With "focus on weak words" on, each word gets a weight:
   - Never answered: `1.6`
   - Otherwise: `1 + wrong × 2.5 − correct × 0.6`, plus `3` if the last answer was wrong, kept between `0.25` and `25`
4. The last 5 questions are not repeated when other words are available.
5. Answers are checked on the server, ignoring case, spaces, punctuation, and a leading `to`, `a`, `an`, or `the` in English.
6. "I was right" only works on the latest wrong typed answer from the last 10 minutes, and only once.
7. A word is weak when its accuracy is below 70% or its last answer was wrong.
8. Each IP can call login and register 20 times per 15 minutes, and send 30 browser error logs per minute.
9. When adding or editing a word:
   - The kanji field must be Japanese (kanji or kana, no spaces).
   - The reading must be hiragana or katakana.
   - The Thai meaning must be Thai and the English meaning must be English.
   - At least one meaning is required, and the same kanji and reading cannot be added twice.

---

## ⚙️ Configuration

Copy the example file, then edit `.env`:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `APP_NAME` | Project name |
| `APP_ENV` | `dev` or `prod`. `prod` writes logs as JSON at a lower level. |
| `PG_HOST`, `PG_PORT`, `PG_USER`, `PG_PASSWORD`, `PG_DATABASE` | PostgreSQL connection |
| `CLIENT_PORT` | Web port (default `3000`) |
| `VITE_API_URL` | API address that the web app forwards `/api` requests to |
| `SERVER_PORT` | API port (default `3001`) |
| `CORS_ORIGINS` | Allowed origins, separated by `,` |
| `COOKIE_SAME_SITE`, `COOKIE_SECURE` | Session cookie options. Use `COOKIE_SECURE=true` behind HTTPS. |
| `JWT_SECRET` | Token signing key, at least 32 characters |
| `DUMMY_PASSWORD_HASH` | A bcrypt hash with cost 12, used so a login with an unknown email takes as long as a wrong password |

---

## 🚀 How to Run

### 1. Start the containers
```bash
docker compose up -d --build
```

The `server` and `client` containers stay idle until you start the apps.

### 2. Create the tables and load the vocabulary
```bash
docker exec -it kanji-practice-server npx prisma migrate deploy
docker exec -i kanji-practice-db psql -v ON_ERROR_STOP=1 -U <PG_USER> -d <PG_DATABASE> < server/prisma/sample-data.sql
```

Replace `<PG_USER>` and `<PG_DATABASE>` with the values in `.env`. The vocabulary file can be run again; words that already exist are skipped.

Use `psql` as shown. Some GUI tools split the file into separate statements, and the words are not saved.

### 3. Start the API and the web app
```bash
docker exec -it kanji-practice-server npm start
```
```bash
docker exec -it kanji-practice-client npm start
```

- Web: http://localhost:3000
- API: http://localhost:3001/api/v1/health

### 4. Make yourself an admin
Sign up on the website first, then run:
```bash
docker exec -it kanji-practice-db psql -U <PG_USER> -d <PG_DATABASE> \
  -c "UPDATE users SET role = 'admin' WHERE email = 'you@example.com';"
```

Sign out and sign in again to see the admin tabs.

### Development notes
- Code changes reload automatically, because `client/` and `server/` are mounted into the containers.
- After pulling changes that add packages, run `npm ci` inside the container. Its `node_modules` is separate from your machine.
  ```bash
  docker exec kanji-practice-server npm ci
  docker exec kanji-practice-client npm ci
  ```
- After editing `server/prisma/schema.prisma`, create a migration:
  ```bash
  docker exec -it kanji-practice-server npx prisma migrate dev --name <change-name>
  ```
  Do not edit migrations that have already run.
- Type check:
  ```bash
  docker exec kanji-practice-server npx tsc --noEmit -p .
  docker exec kanji-practice-client npx tsc -b
  ```
- Run `git` from the project folder on your machine, not inside a container.
- The containers run as `root`, so files they create (such as new migrations) belong to `root`. If you cannot remove them on your machine, remove them with `docker exec` or `sudo`.

---

## 🔌 API

All paths start with `/api/v1`. Errors use the shape `{ "error": { "code": "...", "message": "..." } }`.

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Anyone | Health check |
| `POST` | `/auth/register` | Anyone | Sign up (rate limited) |
| `POST` | `/auth/login` | Anyone | Sign in (rate limited) |
| `POST` | `/auth/logout` | Anyone | Sign out |
| `GET` | `/auth/profile` | User | Current user |
| `GET` | `/quiz/next` | User | Next question (`levels`, `type`, `mode`, `lang`, `focus`, `exclude`) |
| `POST` | `/quiz/answer` | User | Check an answer and save stats |
| `POST` | `/quiz/override` | User | Mark the latest wrong typed answer correct |
| `GET` | `/stats` | User | Own stats |
| `DELETE` | `/stats` | User | Reset own stats |
| `GET` | `/words/levels` | User | Word count per level |
| `GET` | `/words` | Admin | Word list (`page`, `pageSize`, `search`, `level`) |
| `POST` | `/words` | Admin | Add a word |
| `PUT` | `/words/:id` | Admin | Edit a word |
| `DELETE` | `/words/:id` | Admin | Delete a word and its stats |
| `GET` | `/users` | Admin | User list (`page`, `pageSize`) |
| `POST` | `/client-logs` | Anyone | Save a browser error (rate limited) |

---

## 📊 Example Output

Server console in `dev`:

```
10:30:01.120 info Server listening on port 3001
10:30:05.482 http [a1b2c3d4] GET /api/v1/quiz/next 200 8.12ms {"userId":"6f1c..."}
10:30:07.913 debug [9e8d7c6b] Quiz answered {"event":"quiz.answer","wordId":19,"qtype":"read","correct":true}
10:30:21.004 warn [5f4e3d2c] Login failed {"event":"auth.login_failed","ip":"172.20.0.1","error":"Email or password is incorrect"}
10:31:02.377 error [0a1b2c3d] [web] TypeError: x is undefined {"event":"client.error","source":"react","pageUrl":"http://localhost:3000/quiz"}
```

- Every request has a request id, also returned in the `X-Request-Id` header.
- Logs are also written to `server/logs/combined.log` and `server/logs/error.log`, rotated every 10 MB, keeping 5 files.
- Fields such as `password`, `token`, and `cookie` are replaced with `[REDACTED]`.

---

## 📚 Vocabulary Data

`server/prisma/sample-data.sql` contains 1,250 words, 250 per level:

| Level | N5 | N4 | N3 | N2 | N1 |
|---|---|---|---|---|---|
| Words | 250 | 250 | 250 | 250 | 250 |

**Sources of the words, readings, English meanings, and JLPT levels**
- [open-anki-jlpt-decks](https://github.com/jamsinclair/open-anki-jlpt-decks) by Jamie Sinclair, MIT License (Copyright © 2020 Jamie Sinclair)
- which took its data from [jlpt-anki-decks](https://github.com/chyyran/jlpt-anki-decks) by Ryan Thompson, WTFPL

**What this project added**
- Thai meanings, written for this project. They have not been reviewed by a Japanese language expert.
- Only words that contain kanji, with the level taken from the source list.
- Common everyday words first, then words picked evenly across each list.
- Fixes to the source data, such as readings with `する` attached, misspelled words, and some wrong English meanings.
- Removed duplicates and alternate spellings of the same word.

**Notes**
- JLPT has not published an official word list since 2010, so levels are estimates and may differ from other sources.
- Admins can fix wrong words or meanings on the word management page.

---

## 📁 Project Structure

```
kanji-practice/
├── client/                      # React + Vite
│   ├── src/
│   │   ├── pages/               # One file per page
│   │   ├── components/          # Page building blocks
│   │   ├── hooks/               # Page state and API calls
│   │   ├── services/            # API calls (the only place that knows the URLs)
│   │   ├── contexts/            # Signed-in user and language
│   │   ├── i18n/locales/        # Thai and English texts
│   │   ├── lib/                 # Validation, error messages, storage helpers
│   │   ├── routes/              # Paths and access guards
│   │   └── types/
│   ├── vite.config.ts           # /api proxy to the server
│   └── Dockerfile
├── server/                      # Express + Prisma
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── sample-data.sql      # Vocabulary data
│   ├── src/
│   │   ├── routes/              # Paths and middleware
│   │   ├── controllers/         # Read the request, call a service, send the response, log
│   │   ├── services/            # Business logic (*.logic.ts are pure functions)
│   │   ├── repositories/        # Database queries
│   │   ├── middlewares/         # Auth, rate limit, request log, error handler
│   │   ├── utils/               # Input validation and helpers
│   │   ├── constants/           # Error codes, log events, settings
│   │   ├── config/              # Env, logger, Prisma client
│   │   ├── types/
│   │   ├── app.ts               # Express app
│   │   └── index.ts             # Start and graceful shutdown
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## ⚠️ Known Limitations

- Rate limit counters are kept in server memory. They reset on restart and are not shared between instances.
- The server must run behind a proxy on the same private network (such as the Vite proxy) to see each user's real IP for rate limiting.

---

## 📄 License
MIT License for the code. See [LICENSE](LICENSE).

The vocabulary data in `server/prisma/sample-data.sql` follows the terms of its sources. See [📚 Vocabulary Data](#-vocabulary-data).
