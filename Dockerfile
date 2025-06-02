# This Dockerfile is unused - we now use Vercel!
# It's kept here for reference.

FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# run the build
ENV NODE_ENV=production
RUN bun run build

FROM base AS release
WORKDIR /usr/src/app

COPY --from=install /temp/prod/node_modules node_modules

COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/dist ./dist

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
