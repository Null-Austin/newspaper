FROM oven/bun:latest

WORKDIR /app

COPY . .

RUN apt-get update

RUN apt-get install -y ca-certificates wget

RUN bun install --frozen-lockfile

RUN bun run build

ENTRYPOINT ["bun", "start"]