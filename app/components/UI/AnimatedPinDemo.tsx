"use client";
import React from "react";
import { PinContainer } from "./3d-pin";

export function AnimatedPinDemo() {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap p-4">
      <PinContainer
        title="github.com/chayanoon17"
        href="https://github.com/chayanoon17"
      >
        <div className="flex flex-col p-4 tracking-tight text-slate-100/50 w-[16rem] h-[16rem] sm:w-[20rem] sm:h-[20rem]">
          <h3 className="font-bold text-base text-slate-100">Github</h3>
          <div className="text-base font-normal">
            <span className="text-slate-500">Contact channels.</span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
        </div>
      </PinContainer>
      <PinContainer
        title="facebook.com"
        href="https://www.facebook.com/ken.sakura.3950?locale=th_TH"
      >
        <div className="flex flex-col p-4 tracking-tight text-slate-100/50 w-[16rem] h-[16rem] sm:w-[20rem] sm:h-[20rem]">
          <h3 className="font-bold text-base text-slate-100">Facebook</h3>
          <div className="text-base font-normal">
            <span className="text-slate-500">Contact channels.</span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-blue-500 via-sky-500" />
        </div>
      </PinContainer>
      <PinContainer
        title="Instagram.com"
        href="https://www.instagram.com/ken.chayanoon/"
      >
        <div className="flex flex-col p-4 tracking-tight text-slate-100/50 w-[16rem] h-[16rem] sm:w-[20rem] sm:h-[20rem]">
          <h3 className="font-bold text-base text-slate-100">Instagram</h3>
          <div className="text-base font-normal">
            <span className="text-slate-500">Contact channels.</span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-pink-500 via-purple-500 to-yellow-500" />
        </div>
      </PinContainer>
    </div>
  );
}
