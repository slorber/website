import { SanctionedColor } from './common-types';
import { TaskId } from './ids';

export type ReduxStoreTask = {
  readonly taskId: TaskId;
  readonly owner: string;
  readonly name: string;
  readonly color: SanctionedColor;
  readonly content: string;
  readonly completed: boolean;
  readonly dependencies: readonly TaskId[];
};

export type ReduxStoreTasksMap = { readonly [taskId: string]: ReduxStoreTask };
export type ReduxStoreState = {
  readonly dataLoaded: boolean;
  readonly tasks: ReduxStoreTasksMap;
};
