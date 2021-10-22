/**
 * An event that indicates the state of the command stack has changed.
 */
export class CommandStateChangedEvent extends Event {
    commandIndex;
    commandStackLength;
    static TYPE = 'carve-command-state-changed';
    constructor(
    /** The index of the pointer in the command stack. */
    commandIndex, 
    /** The length of the command stack. */
    commandStackLength) {
        super(CommandStateChangedEvent.TYPE);
        this.commandIndex = commandIndex;
        this.commandStackLength = commandStackLength;
    }
}
/** A class representing a stack of commands. */
export class CommandStack {
    /**
     * The pointer into the command history.
     * Any commands lower in the stack than this index have been applied.
     */
    commandIndex = 0;
    /** A stack of all commands in this document's memory. */
    commandHistory = [];
    constructor() { }
    addCommand(host, cmd) {
        cmd.apply(host);
        // Blow away all commands at the index and beyond.
        if (this.commandIndex < this.commandHistory.length) {
            this.commandHistory = this.commandHistory.slice(0, this.commandIndex);
        }
        this.commandHistory.push(cmd);
        this.commandIndex = this.commandHistory.length;
    }
    /** Returns the index of the pointer into the stack. */
    getIndex() { return this.commandIndex; }
    /** Returns the length of the command stack. */
    getLength() { return this.commandHistory.length; }
    /**
     * Re-applies the next command, incrementing the command index. Returns the command applied, or
     * null if there were no next commands.
     */
    redo(host) {
        if (this.commandIndex < this.commandHistory.length) {
            this.commandIndex = this.commandIndex + 1;
            const cmd = this.commandHistory[this.commandIndex - 1];
            cmd.apply(host);
            return cmd;
        }
        return null;
    }
    /**
     * Un-applies the previous command, decrementing the command index. Returns the command undone, or
     * null if there no previous commands.
     */
    undo(host) {
        if (this.commandIndex > 0) {
            this.commandIndex = this.commandIndex - 1;
            const cmd = this.commandHistory[this.commandIndex];
            cmd.unapply(host);
            return cmd;
        }
        return null;
    }
}
//# sourceMappingURL=history.js.map