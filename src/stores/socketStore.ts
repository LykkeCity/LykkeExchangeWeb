import {IConnectionOptions, OnChallengeHandler, Session} from 'autobahn';
import {Socket} from 'socket-connection';
import {
  IWampMessageOptions,
  WampConnection,
  WampMessageType
} from 'socket-connection-wamp';
import * as StorageUtils from '../utils/storageUtils';
import RootStore from './rootStore';

const TOKEN_KEY = 'lww-token';
const tokenStorage = StorageUtils.withKey(TOKEN_KEY);

class SocketStore {
  readonly rootStore: RootStore;
  private socket: Socket | null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  connect = async (url: string, realm: string, authId?: string) => {
    let options: IConnectionOptions = {url, realm, max_retries: -1};
    if (authId) {
      options = {
        ...options,
        authid: authId,
        authmethods: ['ticket'],
        onchallenge: this.handleChallenge
      };
    }

    this.socket = new Socket(new WampConnection(options));
    await this.socket.connect();
    return this.socket;
  };

  subscribe = async (topic: string, callback: any) => {
    const sendingOptions: IWampMessageOptions = {
      callback,
      topic,
      type: WampMessageType.Subscribe
    };
    return await this.socket!.send(sendingOptions);
  };

  unsubscribe = async (topic: string, id: string) => {
    await this.socket!.send({type: WampMessageType.Unsubscribe, topic, id});
  };

  reset = async () => {
    await this.socket!.close();
    this.socket = null;
  };

  private handleChallenge: OnChallengeHandler = (
    session: Session,
    method: string
  ) => {
    if (method === 'ticket') {
      return tokenStorage.get() as string;
    }
    return '';
  };
}

export default SocketStore;
