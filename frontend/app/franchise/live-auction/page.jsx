"use client";

import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useToast, Toast } from "../../components/UI";
import { BidBattleCard } from "../../components/BidBattleCard";
import { formatCurrency } from "../../lib/format";
import { getSocket } from "../../lib/socket";
import { apiFetch } from "../../lib/api";

export default function FranchiseLiveAuction() {
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [highestBid, setHighestBid] = useState(0);
  const [highestBidder, setHighestBidder] = useState(null);
  const [bidAmount, setBidAmount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [myTeam, setMyTeam] = useState(null);
  const [teamStats, setTeamStats] = useState([]);
  const [recentlySold, setRecentlySold] = useState([]);
  const [bidHistory, setBidHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  
  const socketRef = useRef(null);
  const [auction, setAuction] = useState(null);

  useEffect(() => {
    const loadAuctionData = async () => {
      try {
        const liveStatus = await apiFetch('/franchise/live-status');
        setAuction(liveStatus.auction);
        
        if (liveStatus.auction) {
          const socket = getSocket();
          socketRef.current = socket;
          socket.emit('join_auction', liveStatus.auction.auction_id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    loadAuctionData();
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!auction) return;

    const socket = socketRef.current || getSocket();

    socket.on('auction_sync', (data) => {
      setCurrentPlayer(data.currentPlayer);
      setHighestBid(data.highestBid || (data.currentPlayer?.base_price || 0));
      setHighestBidder(data.highestBidder);
      setBidAmount((data.highestBid || (data.currentPlayer?.base_price || 0)) + (data.currentPlayer?.bid_increment || 50000));
      setTimeLeft(data.timeLeft);
      setIsActive(data.isActive);
      setBidHistory(data.bidHistory || []);
    });

    socket.on('player_changed', (player) => {
      setCurrentPlayer(player);
      setHighestBid(player?.base_price || 0);
      setHighestBidder(null);
      setBidAmount((player?.base_price || 0) + (player?.bid_increment || 50000));
      setTimeLeft(60);
      setIsActive(false);
      setBidHistory([]);
    });

    socket.on('bid_updated', (data) => {
      setHighestBid(data.highestBid);
      setHighestBidder(data.highestBidder);
      setBidAmount(data.highestBid + (currentPlayer?.bid_increment || 50000));
      setBidHistory(data.bidHistory || []);
      if (data.highestBidder?.team_id === myTeam?.team_id) {
        addToast("Your bid is currently leading!", "success");
      }
    });

    socket.on('timer_update', (data) => {
      setTimeLeft(data.timeLeft);
      setIsActive(data.isActive);
    });

    socket.on('player_sold', (data) => {
      addToast(`${data.player.name} sold to ${data.team_name || data.team?.team_name} for ${formatCurrency(data.amount)}`, "success");
      fetchInitialData();
    });

    socket.on('player_unsold', (data) => {
      addToast(`${data.player.name} went unsold`, "info");
      fetchInitialData();
    });

    return () => {
      socket.off('auction_sync');
      socket.off('player_changed');
      socket.off('bid_updated');
      socket.off('timer_update');
      socket.off('player_sold');
      socket.off('player_unsold');
    };
  }, [myTeam, currentPlayer, auction]);

  const fetchInitialData = async () => {
    try {
      const [statsRes, soldRes, teamRes] = await Promise.all([
        apiFetch('/franchise/squad-stats'),
        apiFetch('/franchise/recently-sold'),
        apiFetch('/franchise/my-team')
      ]);
      setTeamStats(statsRes || []);
      setRecentlySold(soldRes || []);
      setMyTeam(teamRes);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceBid = async () => {
    if (!currentPlayer || loading) return;
    setLoading(true);
    try {
      const res = await apiFetch('/franchise/bid', {
        method: 'POST',
        body: JSON.stringify({
          player_id: currentPlayer.player_id,
          auction_id: currentPlayer.auction_id,
          bid_amount: bidAmount
        })
      });
      if (res.success) {
        addToast("Bid placed successfully", "success");
      } else {
        addToast(res.error || res.message || "Failed to place bid", "error");
      }
    } catch (err) {
      addToast(err.message || "Connection error", "error");
    } finally {
      setLoading(false);
    }
  };

  const adjustBid = (increment) => {
    const step = currentPlayer?.bid_increment || 50000;
    const nextBid = increment ? bidAmount + step : Math.max(highestBid + step, bidAmount - step);
    setBidAmount(nextBid);
  };

  return (
    <DashboardLayout title="Live Auction War Room">
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>

      <BidBattleCard
        currentPlayer={currentPlayer}
        highestBid={highestBid}
        highestBidder={highestBidder}
        bidAmount={bidAmount}
        setBidAmount={setBidAmount}
        timeLeft={timeLeft}
        isActive={isActive}
        myTeam={myTeam}
        recentlySold={recentlySold}
        teamStats={teamStats}
        onPlaceBid={handlePlaceBid}
        loading={loading}
        onAdjustBid={adjustBid}
        bidHistory={bidHistory}
      />
    </DashboardLayout>
  );
}
