// @flow strict

import selectMove from './mcts';

// $FlowFixMe
const doWork = ({ data }) => postMessage({
  aiResponse: selectMove(data),
  board: data,
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('message', doWork);
