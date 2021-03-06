#!/usr/bin/env node

import { existsSync, lstatSync, readFileSync } from 'fs';
import { dirname, join, normalize } from 'path';

import chokidar from 'chokidar';
import express from 'express';

const DEV_SAM_MAGIC_PORT_CONSTANT = 19815;

// Adapted from https://github.com/patrick-steele-idem/ignoring-watcher/blob/master/lib/ignore.js
const normalizeIgnorePatterns = (lines: readonly string[]): readonly string[] =>
  lines
    .map((originalLine) => {
      let line = originalLine.trim();
      if (line.length === 0) return [];

      const slashPos = line.indexOf('/');
      if (slashPos === -1) {
        // something like "*.js" which we need to interpret as [
        //  "**/*.js",
        //  "*.js/**", (in case it is a directory)
        //  "*.js"
        // ]
        return [`**/${line}`, `**/${line}/**`, `${line}/**`];
      }

      // something like "/node_modules" so we need to remove the leading slash
      if (slashPos === 0) line = line.substring(1);

      if (line.charAt(line.length - 1) === '/') {
        return [line.slice(0, -1), `${line}**`];
      } else {
        return [line];
      }
    })
    .flat();

const gitignoreAbsolutePath = (() => {
  let directory = process.cwd();
  while (directory !== '/') {
    const fullPath = join(directory, '.gitignore');
    if (existsSync(fullPath) && lstatSync(fullPath).isFile()) {
      return fullPath;
    }
    directory = dirname(directory);
  }
  throw new Error('No .gitignore found. Abort!');
})();
const projectRoot = dirname(gitignoreAbsolutePath);

const watcher = chokidar.watch('.', {
  persistent: true,
  cwd: projectRoot,
  ignoreInitial: true,
  ignored: [
    ...normalizeIgnorePatterns(readFileSync(gitignoreAbsolutePath).toString().split('\n')),
    '.git/**',
  ],
});
const server = express();

type FilesystemEvent = {
  readonly time: number;
  readonly filename: string;
  readonly type: 'changed' | 'deleted';
};

const events: FilesystemEvent[] = [];

watcher.on('all', (eventName, path) => {
  switch (eventName) {
    case 'add':
    case 'change':
      events.push({ time: new Date().getTime(), filename: path, type: 'changed' });
      break;
    case 'unlink':
      events.push({ time: new Date().getTime(), filename: path, type: 'deleted' });
      break;
    case 'addDir':
    case 'unlinkDir':
      break;
  }
});

server.get('/', (request, response) => {
  const rawSince = request.query.since;
  const rawPathPrefix = request.query.pathPrefix ?? '.';
  if (typeof rawSince !== 'string' || typeof rawPathPrefix !== 'string') throw new Error();
  const since = parseInt(rawSince, 10);
  let pathPrefix = normalize(rawPathPrefix);
  if (pathPrefix === '.') pathPrefix = '';
  const eventsToReport: FilesystemEvent[] = [];
  const mentionedFilenames = new Set<string>();
  for (let i = events.length - 1; i >= 0; i -= 1) {
    const event = events[i];
    if (event.time < since) {
      break;
    }
    if (event.filename.startsWith(pathPrefix) && !mentionedFilenames.has(event.filename)) {
      mentionedFilenames.add(event.filename);
      eventsToReport.push(event);
    }
  }
  response.json(eventsToReport.reverse());
});

server.listen(DEV_SAM_MAGIC_PORT_CONSTANT, () =>
  // eslint-disable-next-line no-console
  console.log(
    `[✓] \`@dev-sam/watcher-server\` is running on port ${DEV_SAM_MAGIC_PORT_CONSTANT}...`
  )
);
