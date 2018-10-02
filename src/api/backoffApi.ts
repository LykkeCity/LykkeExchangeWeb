type CallbackFunction = () => void;

export class Backoff {
  private onReady: CallbackFunction;
  private attempts: number;
  private delay: number;

  constructor(onReady: CallbackFunction, initialDelay: number) {
    this.onReady = onReady;
    this.attempts = 0;
    this.delay = initialDelay;
  }

  backoff() {
    setTimeout(
      this.onReady,
      this.exponentialBackoffFunction(++this.attempts, this.delay)
    );
  }

  private exponentialBackoffFunction = (attempt: number, delay: number) => {
    return Math.floor(Math.random() * Math.pow(2, attempt) * delay);
  };
}

export const createBackoff = (
  onReady: CallbackFunction,
  initialDelay: number = 100
) => {
  return new Backoff(onReady, initialDelay);
};
