export class Logger {
  constructor(private readonly serviceName: string) {}

  _color = (code: number, ended = false, ...messages: any[]) =>
    `\x1b[${code}m${messages.join(' ')}${ended ? '\x1b[0m' : ''}`;

  coloredText = {
    black: this._color.bind(this, 30, true),
    red: this._color.bind(this, 31, true),
    green: this._color.bind(this, 32, true),
    yellow: this._color.bind(this, 33, true),
    blue: this._color.bind(this, 34, true),
    magenta: this._color.bind(this, 35, true),
    cyan: this._color.bind(this, 36, true),
    white: this._color.bind(this, 37, true),
    bgBlack: this._color.bind(this, 40, true),
    bgRed: this._color.bind(this, 41, true),
    bgGreen: this._color.bind(this, 42, true),
    bgYellow: this._color.bind(this, 43, true),
    bgBlue: this._color.bind(this, 44, true),
    bgMagenta: this._color.bind(this, 45, true),
    bgCyan: this._color.bind(this, 46, true),
    bgWhite: this._color.bind(this, 47, true),
  };

  private getFormattedDatetime(): string {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return formatter.format(date);
  }

  success(message: string) {
    const formattedDate = this.getFormattedDatetime();

    console.log(
      this.coloredText.white(formattedDate) +
        ' ' +
        this.coloredText.yellow(`[${this.serviceName}]`) +
        ' ' +
        this.coloredText.green(message),
    );
  }

  info(message: string) {
    const formattedDate = this.getFormattedDatetime();

    console.log(
      this.coloredText.white(formattedDate) +
        ' ' +
        this.coloredText.yellow(`[${this.serviceName}]`) +
        ' ' +
        this.coloredText.yellow(message),
    );
  }

  error(message: string) {
    const formattedDate = this.getFormattedDatetime();

    console.log(
      this.coloredText.white(formattedDate) +
        ' ' +
        this.coloredText.yellow(`[${this.serviceName}]`) +
        ' ' +
        this.coloredText.red(message),
    );
  }
}
