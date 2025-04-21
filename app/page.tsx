'use client';
import { useState } from 'react';
import { airdropTokens } from '@/actions/airdrop';
import { HyperText } from "@/components/magicui/hyper-text";
import { AuroraText } from '@/components/magicui/aurora-text';
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

export default function Home() {
  const [userAdd, setUserAdd] = useState('');
  const [tokens, setTokens] = useState('');
  const [sig, setSig] = useState('');
  const [finalLabel, setFinalLabel] = useState<number>(2);
  const [loader, setLoader] = useState(false);

  const submitHandler = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!userAdd || !tokens) return;
    setLoader(true);
    const res = await airdropTokens(userAdd, tokens);
    if (res.ok) {
      setSig(res.sig);
      setFinalLabel(1);
    } else {
      setFinalLabel(0);
    }
    setLoader(false);
  };

  return (
    <div className="bg-black p-10 h-screen text-white text-center">
      <h1 className="text-7xl mb-10 rounded-md w-3/6 mx-auto p-10 font-black">
      <HyperText>Karthik Coins free</HyperText>
      <AuroraText>AIRDROP</AuroraText> <span className="text-3xl"> on devnet </span>
      </h1>
      <form className="">
        <label className="me-4 mb-3">Select your address</label>
        <input
          onChange={(e) => setUserAdd(e.target.value)}
          type="text"
          className="border rounded p-2"
        ></input>
        <br></br>
        <select
          onChange={(e) => setTokens(e.target.value)}
          className="m-3 text-2xl"
        >
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
          <option>7</option>
          <option>8</option>
          <option>9</option>
          <option>10</option>
        </select>
        <br></br>

        {!loader ? (
          <div
            onClick={submitHandler}
            className="px-5 py-1.5 font-bold text-3xl rounded m-7 cursor-pointer hover:-translate-y-0.5 transition-all"
          >
            <InteractiveHoverButton>Print money</InteractiveHoverButton>
          </div>
        ) : (
          'loading...'
        )}

        {finalLabel == 1 && (
          <p className="m-5 text-green-500">
            Congrats, tokens are sent - {sig}
          </p>
        )}
        {finalLabel == 0 && (
          <p className="m-5 text-red-500">
            Bad luck, something went wrong. prolly check your inputs
          </p>
        )}
      </form>
    </div>
  );
}
