import { spawnSync } from 'child_process';
import * as http from 'http';

export type ChangedFilesQueryResults = {
  readonly changedFiles: readonly string[];
  readonly deletedFiles: readonly string[];
};

export const parseGitDiffWithStatus_EXPOSED_FOR_TESTING = (
  diffString: string
): ChangedFilesQueryResults => {
  const changedFiles: string[] = [];
  const deletedFiles: string[] = [];

  diffString
    .trim()
    .split('\n')
    .forEach((line) => {
      const parts = line
        .trim()
        .split(/\s/)
        .filter((it) => it.trim().length > 0);
      if (parts.length === 0) {
        return;
      }
      const type = parts[0];
      if (type === 'A' || type === 'M') {
        changedFiles.push(parts[1]);
      } else if (type === 'D') {
        deletedFiles.push(parts[1]);
      } else if (type.startsWith('R')) {
        deletedFiles.push(parts[1]);
        changedFiles.push(parts[2]);
      }
    });

  return { changedFiles, deletedFiles };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getJson = (url: string): Promise<any> =>
  new Promise((resolve, reject) => {
    http
      .get(url, (res) => {
        let body = '';

        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (error) {
            reject(error);
          }
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });

const queryChangedFilesFromDevSamWatcherServerSince = async (
  since: number,
  pathPrefix = '.'
): Promise<ChangedFilesQueryResults> => {
  const events: readonly {
    type: 'changed' | 'deleted';
    filename: string;
  }[] = await getJson(`http://localhost:19815/?since=${since}&pathPrefix=${pathPrefix}`);
  const changedFiles: string[] = [];
  const deletedFiles: string[] = [];

  events.forEach(({ type, filename }) => {
    if (type === 'changed') {
      changedFiles.push(filename);
    } else {
      deletedFiles.push(filename);
    }
  });

  return { changedFiles, deletedFiles };
};

const queryChangedFilesSince = async (
  since: number,
  pathPrefix = '.'
): Promise<ChangedFilesQueryResults> => {
  const queryFromGitDiffResult = (base: string, head?: string): ChangedFilesQueryResults => {
    const gitDiffResponse = spawnSync('git', [
      'diff',
      base,
      ...(head ? [head] : []),
      '--name-status',
      '--diff-filter=ADRM',
      '--',
      pathPrefix,
    ]).stdout.toString();
    return parseGitDiffWithStatus_EXPOSED_FOR_TESTING(gitDiffResponse);
  };

  if (process.env.CI) {
    return queryFromGitDiffResult('HEAD^', 'HEAD');
  }
  try {
    return await queryChangedFilesFromDevSamWatcherServerSince(since, pathPrefix);
  } catch {
    // In case the server is dead, run the git command locally, assuming origin/master is always good.
    return queryFromGitDiffResult('origin/master');
  }
};

export default queryChangedFilesSince;
