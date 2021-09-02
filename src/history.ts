
export const COMMAND_STATE_CHANGED_EVENT_TYPE = 'command-state-changed';

export class CommandStateChangedEvent extends Event {
  constructor(public commandIndex: number, public commandStackLength: number) {
    super(COMMAND_STATE_CHANGED_EVENT_TYPE);
  }
}
