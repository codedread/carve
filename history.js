export const COMMAND_STATE_CHANGED_EVENT_TYPE = 'command-state-changed';
export class CommandStateChangedEvent extends Event {
    commandIndex;
    commandStackLength;
    constructor(commandIndex, commandStackLength) {
        super(COMMAND_STATE_CHANGED_EVENT_TYPE);
        this.commandIndex = commandIndex;
        this.commandStackLength = commandStackLength;
    }
}
//# sourceMappingURL=history.js.map