# kanji-practice

## Getting started

```sh
cp .env.example .env   # then set PG_PASSWORD and JWT_SECRET
docker compose up -d --build
```

The containers stay idle, so start each app inside its container:

```sh
docker exec -it kanji-practice-server sh
npm start
```

```sh
docker exec -it kanji-practice-client sh
npm start
```

- Web: http://localhost:3000
- API: http://localhost:3001/api/v1/health

After pulling changes that add packages, run `npm ci` inside the container.

Run `git` from the project folder on your machine, not inside a container.
