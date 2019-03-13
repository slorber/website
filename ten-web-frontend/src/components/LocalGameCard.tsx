import React, { ReactElement } from 'react';
import { getGameStatus, makeMoveWithoutCheck, Board } from '../game/board';
// @ts-ignore
import AIEngineWorker from '../game/ai-engine.worker';
import StatefulGameCard, { initialGameState } from './StatefulGameCard';
import { Status } from './GameCard';
import { MctsResponse } from '../game/mcts';

// $FlowFixMe flow doesn't have support for worker yet...
const worker: any = new AIEngineWorker();

type EventType =  { data: { aiResponse: MctsResponse, board: Board } };

/**
 * The game card in local mode.
 */
export default function LocalGameCard(): ReactElement {
  const [gameState, setGameState] = React.useState(initialGameState);
  const [isWorkerListenerSet, setIsWorkerListenerSet] = React.useState(false);

  const aiResponseListener = (event: EventType) => {
    const { aiResponse, board } = event.data;
    const { move, winningPercentage, simulationCounter } = aiResponse;
    const newBoardAfterAI = makeMoveWithoutCheck(board, move);
    const gameStatus = getGameStatus(newBoardAfterAI);
    let newStatus: Status;
    if (gameStatus === 1) {
      newStatus = 'BLACK_WINS';
    } else if (gameStatus === -1) {
      newStatus = 'WHITE_WINS';
    } else {
      newStatus = 'PLAYER_MOVE';
    }
    setGameState({
      board: newBoardAfterAI,
      highlightedCell: move,
      status: newStatus,
      aiInfo: [winningPercentage, simulationCounter],
    });
  };

  React.useEffect(() => {
    if (!isWorkerListenerSet) {
      worker.addEventListener('message', aiResponseListener);
      setIsWorkerListenerSet(true);
    }
  });

  return (
    <StatefulGameCard
      gameState={gameState}
      setGameState={setGameState}
      aiResponder={b => worker.postMessage(b)}
    />
  );
}