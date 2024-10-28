import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Votingdapp} from '../target/types/votingdapp'
import { BankrunProvider, startAnchor } from 'anchor-bankrun'

const IDL = require('../target/idl/votingdapp.json');
const votingAddress = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

describe('votingdapp', () => {

  let context;
  let provider;
  let votingProgram;

  beforeAll(async () => {
    context = await startAnchor("", [{name: "votingdapp", programId: votingAddress}], []);
    provider = new BankrunProvider(context);
    votingProgram = new Program<Votingdapp>(IDL, provider);
  })

  it('Initialize Poll', async () => {
  

    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "What is your favorite tpye of peanut butter?",
      new anchor.BN(0),
      new anchor.BN(1830130043)
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress
    )

    const poll = await votingProgram.account.poll.fetch(pollAddress);
    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("What is your favorite tpye of peanut butter?");
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber());

  });

  it("initialize candidate", async () => {
    await votingProgram.methods.initializeCandidate(
      "Smooth",
      new anchor.BN(1)).rpc();
    await votingProgram.methods.initializeCandidate(
      "Crunchy",
      new anchor.BN(1)).rpc();
    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Crunchy")],
      votingAddress
    )
    const crunchCandidate = await votingProgram.account.candidate.fetch(crunchyAddress);
    console.log(crunchCandidate);

  });

  it("initialize voting", async () => {

  });


})
