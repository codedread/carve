import { CarveAction } from './actions.js';
import { ToolbarButton, ToolbarModeButton } from './toolbar-button.js';

export class CarveNewButton extends ToolbarButton {
  getAction(): CarveAction { return CarveAction.NEW_DOCUMENT; }
  getButtonDOM(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>New Document</title>
      <g stroke="black" stroke-width="1" stroke-linejoin="bevel">
        <path d="M20,5 h40 v20 h20 v70 h-60 z" fill="white" />
        <path d="M60,5 l20,20 h-20 z" fill="#ffffbf" />
      </g>
    </svg>`;
  }
}

export class CarveOpenButton extends ToolbarButton {
  getAction(): CarveAction { return CarveAction.OPEN_DOCUMENT; }
  getButtonDOM(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>Open Document</title>
      <g stroke="black" stroke-width="1" stroke-linejoin="bevel">
        <path d="M7.5,20 h25 v10 h55 v15 h-70 l-10,45 z" fill="#F8D775" />
        <path d="M20,47.5 h75 l-20,45 h-65 z" fill="#FFE9A2" />
        <path d="M47.5,5 l17.5,17.5 h-7.5 v20 h-20 v-20 h-7.5 z" fill="green" />
      </g>
    </svg>`;
  }
}

export class CarveRectangleButton extends ToolbarModeButton {
  getAction(): CarveAction { return CarveAction.RECTANGLE_MODE; }
  getButtonDOM(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>Rectangle Tool</title>
      <rect x="15" y="30" width="70" height="40" fill="red" stroke-width="4" stroke="black" />
    </svg>`;
  }
}

export class CarveEllipseButton extends ToolbarModeButton {
  getAction(): CarveAction { return CarveAction.ELLIPSE_MODE; }
  getButtonDOM(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <title>Rectangle Tool</title>
      <ellipse cx="50" cy="50" rx="40" ry="20" fill="green" stroke-width="4" stroke="black" />
    </svg>`;
  }
}
