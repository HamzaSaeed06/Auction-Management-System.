"use client";

import React from "react";
import { List, ShieldCheck } from "@phosphor-icons/react";

export default function MobileHeader({ onOpenSidebar }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-900 text-white">
          <ShieldCheck size={18} weight="fill" />
        </div>
        <span className="text-sm font-bold tracking-tight text-slate-900">
          Auction OS
        </span>
      </div>

      <button
        onClick={onOpenSidebar}
        className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-50 active:bg-slate-100"
      >
        <List size={22} weight="bold" />
      </button>
    </header>
  );
}
