const randomString = () => ({
  mixed: (length: number) => {
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';

    for (let i = 0; i < length; i++) {
      str += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return str;
  }
});

export default randomString;
