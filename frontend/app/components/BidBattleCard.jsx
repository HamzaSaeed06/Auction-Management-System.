"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Minus,
  Plus,
  Clock,
  Gavel,
  CheckCircle,
  MonitorPlay,
  Handbag,
} from "@phosphor-icons/react";
import { cn } from "../lib/format";
import { formatCurrency } from "../lib/format";
import { Button, SectionCard, Badge } from "./UI";
import { BACKEND_URL } from "../lib/socket";


/**
 * BidBattleCard Component
 * Displays live player bidding interface with player stats, bid controls, and team tracker
 */
export function BidBattleCard({
  currentPlayer,
  highestBid,
  highestBidder,
  bidAmount,
  setBidAmount,
  timeLeft,
  isActive,
  myTeam,
  recentlySold,
  teamStats,
  onPlaceBid,
  loading,
  onAdjustBid,
  bidHistory = [],
}) {
  const isUrgent = timeLeft <= 10 && isActive;
  const isWarning = timeLeft <= 30 && isActive;
  const isLeading = highestBidder?.team_id === myTeam?.team_id;

  if (!currentPlayer) {
    return (
      <div className="surface bg-white py-16 px-10 flex flex-col items-center justify-center text-center border border-slate-100 shadow-sm rounded-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-50" />
        <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center mb-5">
          <MonitorPlay size={28} weight="duotone" className="text-slate-400" />
        </div>
        <h2 className="text-ui-semibold text-slate-900 capitalize mb-1.5">
          Auction floor is currently idle
        </h2>
        <p className="text-slate-400 max-w-sm mx-auto text-[11px] leading-relaxed">
          The session is waiting for the administrator to introduce the next
          player. Live bid updates will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* MAIN BID BATTLE SECTION */}
      <div className="grid gap-8 lg:grid-cols-12 items-stretch min-h-[520px]">
        {/* LEFT: PLAYER PROFILE CARD */}
        <div className="lg:col-span-4">
          <SectionCard
            padded={false}
            className="surface h-full flex flex-col bg-white overflow-hidden shadow-sm group"
          >
            {/* Player Image */}
            <div className="flex-1 p-8 pb-4 flex flex-col items-center">
              <div className="h-44 w-44 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 shadow-md overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500">
                {currentPlayer.image_url ? (
                  <motion.img
                    key={currentPlayer.player_id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={currentPlayer.image_url.startsWith('http') ? currentPlayer.image_url : `${BACKEND_URL}/uploads/${currentPlayer.image_url}`}
                    alt={currentPlayer.name}
                    className="h-full w-full object-contain drop-shadow-lg"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-300">
                    <User size={64} weight="light" />
                  </div>
                )}
              </div>

              {/* Player Info */}
              <div className="mt-8 text-center">
                <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mb-2">
                  Current Bid Target
                </p>
                <h2 className="text-2xl font-bold text-slate-900 leading-tight mb-2 uppercase tracking-tight">
                  {currentPlayer.name}
                </h2>
                <Badge variant="neutral" className="inline-flex">
                  {currentPlayer.role_name || currentPlayer.role}
                </Badge>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="px-6 pb-6">
              <div className="grid grid-cols-4 border border-slate-200 rounded-lg overflow-hidden bg-white divide-x divide-slate-100">
                {[
                  { label: "Matches", val: currentPlayer.matches, short: "M" },
                  { label: "Wickets", val: currentPlayer.wickets, short: "W" },
                  {
                    label: "Economy",
                    val: currentPlayer.economy ? Number(currentPlayer.economy).toFixed(2) : null,
                    short: "EC",
                  },
                  { label: "Best", val: currentPlayer.best_bowling, short: "B" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="py-4 px-2 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-[9px] font-bold text-slate-400 uppercase mb-1.5 tracking-wider">
                      {stat.short}
                    </span>
                    <span className="text-ui-semibold font-bold text-slate-900">
                      {stat.val || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Base Price Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Base Price
              </span>
              <span className="text-ui-semibold text-slate-950 font-bold">
                {formatCurrency(currentPlayer.base_price)}
              </span>
            </div>
          </SectionCard>
        </div>

        {/* RIGHT: BIDDING ARENA */}
        <div className="lg:col-span-8">
          <SectionCard
            padded={false}
            className="surface h-full bg-white flex flex-col items-center justify-center p-10 relative overflow-hidden shadow-sm"
          >
            <div className="w-full h-full flex flex-col items-center justify-center text-center">
              {/* Current Bid Amount - Large Display */}
              <motion.div
                key={highestBid}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Current Bid
                </p>
                <h1 className="text-7xl font-black text-slate-950 tracking-tighter leading-none tabular-nums">
                  {formatCurrency(highestBid)}
                </h1>
              </motion.div>

              {/* Bid History / Recent Bids from Teams */}
              <div className="w-full max-w-sm mb-8 space-y-1.5 min-h-[120px] flex flex-col justify-center">
                {bidHistory.length > 0 ? (
                  bidHistory.map((bid, idx) => (
                    <motion.div
                      key={`${bid.amount}-${idx}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "flex items-center justify-between px-4 py-2 rounded-lg border text-[11px]",
                        idx === 0 ? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-slate-50 text-slate-600 border-slate-100"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {bid.team_logo && (
                           <img 
                            src={bid.team_logo.startsWith('http') ? bid.team_logo : `${BACKEND_URL}/uploads/${bid.team_logo}`} 
                            className="h-4 w-4 rounded-full object-cover" 
                            alt=""
                           />
                        )}
                        <span className="font-bold">{bid.team_name}</span>
                      </div>
                      <span className={cn("font-semibold", idx === 0 ? "text-white" : "text-slate-900")}>
                        {formatCurrency(bid.amount)}
                      </span>
                      <span className={cn("text-[9px] uppercase font-bold", idx === 0 ? "text-slate-400" : "text-slate-400")}>
                        {idx === 0 ? "Current Lead" : "Previous"}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-[10px] text-slate-400 font-medium py-4">
                    Waiting for initial bid...
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="w-32 h-1 bg-slate-200 rounded-full mb-8" />

              {/* Bid Input Section */}
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Your Bid Amount
              </p>

              {/* Bid Adjustment Controls */}
              <div className="flex items-center gap-3 mb-8 w-full max-w-sm">
                <button
                  onClick={() => onAdjustBid(false)}
                  className="h-14 w-14 rounded-lg border-2 border-slate-300 flex items-center justify-center font-bold transition-all shadow-sm active:scale-95 hover:bg-slate-50 hover:border-slate-400"
                  title="Decrease bid"
                >
                  <Minus size={24} weight="bold" className="text-slate-600" />
                </button>

                <div className="flex-1 h-14 rounded-lg border-2 border-slate-900 bg-white flex items-center justify-center shadow-md">
                  <motion.span
                    key={bidAmount}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-black text-slate-900 tabular-nums"
                  >
                    {formatCurrency(bidAmount)}
                  </motion.span>
                </div>

                <button
                  onClick={() => onAdjustBid(true)}
                  className="h-14 w-14 rounded-lg border-2 border-slate-300 flex items-center justify-center font-bold transition-all shadow-sm active:scale-95 hover:bg-slate-50 hover:border-slate-400"
                  title="Increase bid"
                >
                  <Plus size={24} weight="bold" className="text-slate-600" />
                </button>
              </div>

              {/* Timer */}
              <div className="w-full max-w-sm mb-8">
                <div className="relative h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-sm mb-3">
                  <motion.div
                    className={cn(
                      "absolute top-0 left-0 h-full transition-colors duration-500 rounded-full",
                      isUrgent
                        ? "bg-red-500 shadow-red-500/50"
                        : isWarning
                          ? "bg-amber-500 shadow-amber-500/50"
                          : "bg-blue-600 shadow-blue-600/50"
                    )}
                    initial={{ width: "100%" }}
                    animate={{ width: `${(timeLeft / 60) * 100}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </div>

                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={isUrgent ? { scale: [1, 1.2, 1] } : {}}
                    transition={{
                      duration: 0.6,
                      repeat: isUrgent ? Infinity : 0,
                    }}
                  >
                    <Clock
                      size={16}
                      weight="bold"
                      className={cn(
                        isUrgent
                          ? "text-red-500"
                          : isWarning
                            ? "text-amber-500"
                            : "text-slate-500"
                      )}
                    />
                  </motion.div>
                  <span
                    className={cn(
                      "text-xs font-black uppercase tracking-[0.1em]",
                      isUrgent
                        ? "text-red-600"
                        : isWarning
                          ? "text-amber-600"
                          : "text-slate-600"
                    )}
                  >
                    {timeLeft} Seconds Remaining
                  </span>
                </div>
              </div>

              {/* Place Bid Button */}
              <Button
                variant="primary"
                disabled={isLeading || timeLeft <= 0 || loading}
                loading={loading}
                onClick={onPlaceBid}
                className={cn(
                  "w-full max-w-sm h-16 text-lg font-black tracking-[0.1em] uppercase rounded-lg shadow-lg transition-all active:scale-[0.98]",
                  isLeading
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-not-allowed"
                    : "bg-slate-950 hover:bg-slate-900 text-white"
                )}
              >
                <span>
                  {isLeading
                    ? "🎯 You're Leading"
                    : `BID ${formatCurrency(bidAmount)}`}
                </span>
                <Gavel size={20} weight="fill" className="opacity-70" />
              </Button>
            </div>
          </SectionCard>
        </div>
      </div>

      {/* BOTTOM SECTION: RECENTLY SOLD & TEAM STATS */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recently Sold */}
        <SectionCard
          title="Recently Auctioned"
          sub="Last players sold"
          className="surface bg-white lg:col-span-1"
          padded={false}
        >
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {recentlySold && recentlySold.length > 0 ? (
              recentlySold.map((p, i) => (
                <div
                  key={i}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[9px] font-bold overflow-hidden shadow-sm border border-slate-700">
                      {p.team_logo ? (
                        <img
                          src={p.team_logo.startsWith('http') ? p.team_logo : `${BACKEND_URL}/uploads/${p.team_logo}`}
                          alt="team"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        p.team_name?.substring(0, 1).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-ui-xs font-bold text-slate-900 truncate capitalize">
                        {p.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate capitalize">
                        {p.team_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      Sold
                    </span>
                    <span className="text-ui-xs font-bold text-slate-900">
                      {formatCurrency(p.amount)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-[11px]">
                <Handbag size={24} className="mx-auto mb-2 opacity-50" />
                No players auctioned yet
              </div>
            )}
          </div>
        </SectionCard>

        {/* Team Stats */}
        <SectionCard
          title="IPL Team Stats"
          sub="Live squad distribution"
          className="surface bg-white lg:col-span-2"
          padded={false}
        >
          {teamStats && teamStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      Team
                    </th>
                    <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      Squad
                    </th>
                    <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      Batsmen
                    </th>
                    <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      Bowlers
                    </th>
                    <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      All-rounders
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teamStats.map((team, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 transition-colors border-slate-100"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[7px] font-bold overflow-hidden shadow-sm">
                            {team.logo_url ? (
                              <img
                                src={team.logo_url.startsWith('http') ? team.logo_url : `${BACKEND_URL}/uploads/${team.logo_url}`}
                                alt="team"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              team.team_name?.substring(0, 1).toUpperCase()
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-slate-900 truncate">
                            {team.team_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge variant="neutral" className="inline-flex justify-center text-[9px]">
                          {team.count || 0}/16
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-center text-[11px] font-bold text-slate-600">
                        {team.batsmen || 0}
                      </td>
                      <td className="px-4 py-3 text-center text-[11px] font-bold text-slate-600">
                        {team.bowlers || 0}
                      </td>
                      <td className="px-4 py-3 text-center text-[11px] font-bold text-slate-600">
                        {team.allrounders || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-[11px]">
              No team data available
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
