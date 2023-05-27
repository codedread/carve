
const useNative = ('showPicker' in HTMLInputElement.prototype);

/**
 * A dialog that lets the user choose a color.
 */
export class ColorDialog {
  topEl: HTMLElement;
  dialogEl: HTMLDialogElement;
  titleEl: HTMLElement;
  colorInput: HTMLInputElement;
  applyButton: HTMLButtonElement;
  cancelButton: HTMLButtonElement;

  constructor() {
    this.topEl = document.createElement('div');
    this.topEl.innerHTML = `
<style>
</style>
<dialog id="dialog">
  <h2 id="title"></h2>
  <input id="color-input" type="${useNative ? 'color' : 'text'}">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="#000000" color="red">
  <g transform="translate(4, 2)">
    <path fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10"
        d="M9.6,20.4l-5.1-5.1c-0.8-0.8-0.8-2,0-2.8L11,6.2 l6.4,6.4c0.8,0.8,0.8,2,0,2.8l-5.1,5.1C11.6,21.2,10.4,21.2,9.6,20.4z"></path>
    <path fill="#000" d="M22,20c0,1.1-0.9,2-2,2s-2-0.9-2-2s2-4,2-4S22,18.9,22,20z"></path>
    <path fill="#000" d="M4,14c0,0.5,0.2,1,0.5,1.4l5.1,5.1c0.8,0.8,2,0.8,2.8,0l5.1-5.1C17.8,15,18,14.5,18,14H4z"></path>
    <line fill="none" stroke="#000000" stroke-width="2" stroke-miterlimit="10" x1="7.5" y1="2.7" x2="15.4" y2="10.6"></line>
  </g>
  <line id="current" fill="none" stroke="currentColor" stroke-width="4" stroke-miterlimit="10" x1="2" y1="28" x2="28" y2="28"></line>
</svg></input>
  <div>
    <button id="apply-button" disabled>Apply</button>
    <button id="cancel-button">Cancel</button>
  </div>
</dialog>`;

    this.dialogEl = this.topEl.querySelector('#dialog');
    this.titleEl = this.topEl.querySelector('#title');
    this.colorInput = this.topEl.querySelector('#color-input');
    this.applyButton = this.topEl.querySelector('#apply-button');
    this.cancelButton = this.topEl.querySelector('#cancel-button');
    document.documentElement.appendChild(this.topEl);
  }

  /** The Promise resolves to null if the user cancelled. */
  async getColor(prevColor: string, title: string): Promise<string|null> {
    let curColor = prevColor;

    return new Promise<string>((resolve, reject) => {
      this.titleEl.innerHTML = title;
      this.colorInput.addEventListener('change', evt => {
        curColor = this.colorInput.value;
        this.applyButton.disabled = (curColor === prevColor);

        // If not using the native picker, we are using a text input and a change event occurs
        // when the user presses Enter, so we want to close the dialog.
        if (!useNative) {
          this.applyButton.click();
        }
      })
      this.applyButton.addEventListener('click', evt => {
        this.dialogEl['close']();
        resolve(curColor);
      });
      this.cancelButton.addEventListener('click', evt => {
        this.dialogEl['close']();
        resolve(null);
      });
      try {
        this.dialogEl['showModal']();
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }
}