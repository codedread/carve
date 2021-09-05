import 'mocha';
import { expect } from 'chai';

import { Command } from './commands/command.js';
import { CommandStack } from './history.js';

describe('History tests', () => {
  describe('CommandStack tests', () => {
    /**
     * A Fake command that we can use to test that commands are executed, unexecuted, etc correctly.
     */
    class FakeCommand implements Command {
      static count = 0;
      constructor(private inc: number) {}
      apply() { FakeCommand.count += this.inc; }
      unapply() { FakeCommand.count -= this.inc; }
    }

    /* The CommandStack under test. */
    let stack: CommandStack = null;

    beforeEach(() => {
      FakeCommand.count = 0;
      stack = new CommandStack();
    });

    it('starts empty and cannot undo or redo', () => {
      expect(stack.getIndex()).equals(0);
      expect(stack.getLength()).equals(0);
      expect(stack.undo(null)).is.null;
      expect(stack.redo(null)).is.null;
    });

    it('increments pointer and length on addCommand() and applies commands', () => {
      stack.addCommand(null, new FakeCommand(1));
      expect(stack.getIndex()).equals(1);
      expect(stack.getLength()).equals(1);
      expect(FakeCommand.count).equals(1);

      stack.addCommand(null, new FakeCommand(100));
      expect(stack.getIndex()).equals(2);
      expect(stack.getLength()).equals(2);
      expect(FakeCommand.count).equals(101);
    });

    it('undoes commands properly', () => {
      const cmd1 = new FakeCommand(1);
      const cmd2 = new FakeCommand(100);
      stack.addCommand(null, cmd1);
      stack.addCommand(null, cmd2);

      expect(stack.undo(null)).equals(cmd2);
      expect(stack.getIndex()).equals(1);
      expect(stack.getLength()).equals(2);
      expect(FakeCommand.count).equals(1);

      expect(stack.undo(null)).equals(cmd1);
      expect(stack.getIndex()).equals(0);
      expect(stack.getLength()).equals(2);
      expect(FakeCommand.count).equals(0);
    });

    it('redoes commands properly', () => {
      const cmd1 = new FakeCommand(1);
      const cmd2 = new FakeCommand(100);
      stack.addCommand(null, cmd1);
      stack.addCommand(null, cmd2);

      stack.undo(null);
      stack.undo(null);

      expect(stack.redo(null)).equals(cmd1);
      expect(stack.getIndex()).equals(1);
      expect(stack.getLength()).equals(2);
      expect(FakeCommand.count).equals(1);

      expect(stack.redo(null)).equals(cmd2);
      expect(stack.getIndex()).equals(2);
      expect(stack.getLength()).equals(2);
      expect(FakeCommand.count).equals(101);
    });

    it('adds a command to a rewound stack properly', () => {
      // Add 5 commands.
      stack.addCommand(null, new FakeCommand(1));
      stack.addCommand(null, new FakeCommand(1));
      stack.addCommand(null, new FakeCommand(100));
      stack.addCommand(null, new FakeCommand(100));
      stack.addCommand(null, new FakeCommand(100));
      expect(stack.getLength()).equals(5);
      expect(FakeCommand.count).equals(302);

      // Undo 4 commands.
      for (let i = 0; i < 4; ++i) stack.undo(null);

      // Apply a new couple commands.
      stack.addCommand(null, new FakeCommand(1000));
      stack.addCommand(null, new FakeCommand(1000));
      expect(stack.getLength()).equals(3);
      expect(stack.getIndex()).equals(3);
      expect(FakeCommand.count).equals(2001);
    });
  });
});

