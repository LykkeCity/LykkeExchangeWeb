import {Socket} from '@lykkex/subzero';
import {
  IWampMessageOptions,
  WampConnection,
  WampMessageType
} from '@lykkex/subzero-wamp';
import {IConnectionOptions, OnChallengeHandler} from 'autobahn';
import {Backoff, createBackoff} from '../api/backoffApi';
import * as StorageUtils from '../utils/storageUtils';
import RootStore from './rootStore';

const TOKEN_KEY = 'lww-token';
const tokenStorage = StorageUtils.withKey(TOKEN_KEY);

class SocketStore {
  readonly rootStore: RootStore;
  private socket: Socket | null;
  private listeners: Map<string, () => void> = new Map();
  private backoff: Backoff;

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

    const wampProxy = new WampConnection(options);

    wampProxy.onopen = () => {
      this.onConnectionOpen();
    };

    wampProxy.onclose = () => {
      this.onConnectionClose();
      this.backoff.backoff();
    };

    this.socket = new Socket(wampProxy);
    await this.socket.connect();
    this.backoff = createBackoff(() => this.onBackoffReady());
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

  onBackoffReady = async () => {
    await this.socket!.connect();
    this.socket!.send({type: WampMessageType.SubscribeToAll});
  };

  set onConnectionOpen(callback: () => void) {
    this.listeners.set('onConnectionOpen', callback);
  }
  get onConnectionOpen() {
    return this.listeners.get('onConnectionOpen') || (() => null);
  }

  set onConnectionClose(callback: () => void) {
    this.listeners.set('onConnectionClose', callback);
  }
  get onConnectionClose() {
    return this.listeners.get('onConnectionClose') || (() => null);
  }

  isSocketOpen = () => this.socket!.isSocketConnected();

  private handleChallenge: OnChallengeHandler = (session, method) => {
    if (method === 'ticket') {
      return tokenStorage.get() as string;
    }
    return '';
  };
}

export default SocketStore;
