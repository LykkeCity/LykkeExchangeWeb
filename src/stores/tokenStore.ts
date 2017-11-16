export class TokenStore {
  private readonly TOKEN_KEY = 'lww-token';

  set = (value: any) =>
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(value));

  get = () => JSON.parse(localStorage.getItem(this.TOKEN_KEY)!);

  clear = () => localStorage.removeItem(this.TOKEN_KEY);
}

export default TokenStore;
