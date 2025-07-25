import z from 'zod';
import * as mpcf from 'mpc-framework';
import { EmpWasmEngine } from 'emp-wasm-engine';
import * as summon from 'summon-ts';
import { RtcPairSocket } from 'rtc-pair-socket';
import assert from './assert';
import AsyncQueue from './AsyncQueue';
import getCircuitFiles from './getCircuitFiles';

export default async function runProtocol(
  mode: 'Host' | 'Join',
  socket: RtcPairSocket,
  comp: number,
  tolerancePct: number,
  onProgress?: (progress: number) => void,
): Promise<'less' | 'same' | 'more'> {
  const msgQueue = new AsyncQueue<unknown>();

  const TOTAL_BYTES = 1228029;
  let currentBytes = 0;

  socket.on('message', (msg: Uint8Array) => {
    msgQueue.push(msg);

    currentBytes += msg.byteLength;

    if (onProgress) {
      onProgress(currentBytes / TOTAL_BYTES);
    }
  });

  await summon.init();

  const { circuit } = summon.compile({
    path: 'circuit/main.ts',
    boolifyWidth: 48,
    publicInputs: { tolerancePct },
    files: await getCircuitFiles(),
  });

  const protocol = new mpcf.Protocol(circuit, new EmpWasmEngine());

  const party = mode === 'Host' ? 'party0' : 'party1';
  const otherParty = mode === 'Host' ? 'party1' : 'party0';

  const session = protocol.join(
    party,
    { [`${party}Comp`]: comp },
    (to, msg) => {
      assert(to === otherParty);
      socket.send(msg);

      currentBytes += msg.byteLength;

      if (onProgress) {
        onProgress(currentBytes / TOTAL_BYTES);
      }
    },
  );

  const streamHandle = msgQueue.stream(msg => {
    if (!(msg instanceof Uint8Array)) {
      console.error(new Error('Expected Uint8Array'));
      return;
    }

    session.handleMessage(otherParty, msg);
  });

  const Output = z.object({
    result: z.number(),
  });

  const output = Output.parse(await session.output());

  streamHandle.stop();

  if (currentBytes !== TOTAL_BYTES) {
    console.error(
      [
        'Bytes sent & received was not equal to TOTAL_BYTES.',
        ' This causes incorrect progress calculations.',
        ` To fix, updated TOTAL_BYTES to ${currentBytes}.`,
      ].join(''),
    );
  }

  const outputMap: Record<number, 'less' | 'same' | 'more' | undefined> = {
    0: party === 'party0' ? 'more' : 'less',
    1: party === 'party1' ? 'more' : 'less',
    2: 'same',
  };

  const result = outputMap[output.result];

  if (result === undefined) {
    throw new Error('Invalid output');
  }

  return result;
}
