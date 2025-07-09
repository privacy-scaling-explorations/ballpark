import z from 'zod';
import { createContext, useContext } from 'react';
import UsableField from './UsableField';
import Emitter from './Emitter';
import AsyncQueue from './AsyncQueue';
import runProtocol from './runProtocol';
import { makeZodChannel } from './ZodChannel';
import { MessageInit, MessageReady, MessageStart } from './MessageTypes';
import { Key, RtcPairSocket } from 'rtc-pair-socket';

type PageKind =
  | 'Home'
  | 'About'
  | 'HostOrJoin'
  | 'Setup'
  | 'Share'
  | 'Host'
  | 'Join'
  | 'CheckTolerance'
  | 'Connecting'
  | 'Input'
  | 'Waiting'
  | 'Calculating'
  | 'Result'
  | 'Error';

const rtcConfig = (() => {
  const envVar = import.meta.env.VITE_RTC_CONFIGURATION;

  if (!envVar) {
    console.log(`Using ${envVar ? 'custom' : 'default'} RTC config`);
    return undefined;
  }

  return JSON.parse(envVar);
})();

export default class Ctx extends Emitter<{ ready(comp: number): void }> {
  page = new UsableField<PageKind>('Home');
  mode: 'Host' | 'Join' = 'Host';
  tolerancePct = new UsableField(15);
  key = new UsableField(Key.random());
  socket = new UsableField<RtcPairSocket | undefined>(undefined);
  msgQueue = new AsyncQueue<unknown>();
  friendReady = false;
  result = new UsableField<'less' | 'same' | 'more' | undefined>(undefined);
  errorMsg = new UsableField<string>('');
  comp = new UsableField<number | undefined>(undefined);
  mpcProgress = new UsableField<number>(0);

  constructor() {
    super();
  }

  async connect(): Promise<RtcPairSocket> {
    if (this.socket.value) {
      if (this.socket.value.pairingCode === this.key.value.base58()) {
        return this.socket.value;
      }

      this.socket.value.close();
    }

    console.log('connecting', this.key.value.base58(), this.mode);

    const socket = new RtcPairSocket(
      this.key.value.base58(),
      this.mode === 'Host' ? 'alice' : 'bob',
      rtcConfig,
    );

    this.socket.set(socket);

    return new Promise<RtcPairSocket>((resolve, reject) => {
      // Only set a timeout if in Join mode
      let connectionTimeout: ReturnType<typeof setTimeout> | undefined;

      if (this.mode === 'Join') {
        // Set a timeout to prevent getting stuck in connecting state
        connectionTimeout = setTimeout(() => {
          console.error('WebRTC connection timeout');
          socket.close();
          reject(new Error('Connection timeout. Please try again.'));
        }, 15000); // 15 seconds timeout
      }

      socket.on('open', () => {
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
        }

        resolve(socket);
      });

      socket.on('error', err => {
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
        }

        console.error('WebRTC connection error:', err);
        reject(err);
      });
    }).catch(error => {
      // Only handle error with UI updates if in Join mode
      if (this.mode === 'Join') {
        this.errorMsg.set(`Connection error: ${error instanceof Error ? error.message : String(error)}`);
        this.page.set('Error');
      }

      throw error;
    });
  }

  async host() {
    this.mode = 'Host';
    const socket = await this.connect();

    socket.removeAllListeners('message');

    socket.on('message', message => {
      if (!MessageInit.safeParse(message).error) {
        socket.send({
          from: 'host',
          type: 'start',
          tolerancePct: this.tolerancePct.value,
        });

        this.runProtocol(socket).catch(this.handleProtocolError);
      }
    });
  }

  async join(keyBase58: string) {
    if (this.key.value.base58() === keyBase58) {
      return;
    }

    this.page.set('Connecting');

    this.mode = 'Join';
    this.key.set(Key.fromBase58(keyBase58));
    const socket = await this.connect();
    socket.send({ from: 'joiner', type: 'init' });

    const listener = (message: unknown) => {
      const parseResult = MessageStart.safeParse(message);
      
      if (parseResult.success) {
        socket.off('message', listener);
        this.tolerancePct.set(parseResult.data.tolerancePct);
        this.runProtocol(socket).catch(this.handleProtocolError);
      }
    };

    socket.on('message', listener);
  }

  async runProtocol(socket: RtcPairSocket) {
    if (this.mode === "Join") {
      this.page.set('CheckTolerance');
    } else {
      this.page.set('Input');
    }

    const FriendMsg = z.object({
      from: z.literal(this.mode === 'Host' ? 'joiner' : 'host'),
    });

    const msgListener = (msg: unknown) => {
      if (!FriendMsg.safeParse(msg).error) {
        this.msgQueue.push(msg);
      }
    };

    socket.removeAllListeners('message');
    socket.on('message', msgListener);

    const channel = makeZodChannel(
      (msg: unknown) => socket.send(msg),
      () => this.msgQueue.shift(),
    );

    const [comp, _readyMsg] = await Promise.all([
      new Promise<number>(resolve => {
        this.once('ready', resolve);
      }),
      channel.recv(MessageReady).then(msg => {
        this.friendReady = true;
        return msg;
      }),
    ]);

    this.page.set('Calculating');
    socket.off('message', msgListener);

    const result = await runProtocol(
      this.mode,
      socket,
      comp,
      this.tolerancePct.value,
      percentage => {
        this.mpcProgress.set(percentage);
      },
    );

    this.result.set(result);

    // This allows us to capture the ready event for the next game if the next
    // player sets up a new game while we're on the result page.
    socket.on('message', msgListener);

    // Don't close the socket, keep it open for potential replay
    // socket.close();

    this.page.set('Result');
  }

  handleProtocolError = (error: unknown) => {
    console.error('Protocol error:', error);
    this.errorMsg.set(`Protocol error: ${JSON.stringify(error)}`);
    this.page.set('Error');
  };

  async setComp(comp: number) {
    this.emit('ready', comp);
    this.comp.set(comp);

    if (!this.friendReady) {
      this.page.set('Waiting');
    }

    this.socket.value!.send({
      from: this.mode === 'Host' ? 'host' : 'joiner',
      type: 'ready',
    });
  }

  reset() {
    window.location.reload();
  }

  private static context = createContext<Ctx>(
    {} as Ctx,
  );

  static Provider = Ctx.context.Provider;

  static use() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useContext(Ctx.context);
  }
}
