import { useMultiplayer } from "@/src/context/MultiplayerContext";
import { Users, Crown } from "lucide-react";

export default function RoomStatus() {
  const { isInRoom, roomCode, isHost, members } = useMultiplayer();
  if (!isInRoom) return null;
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl mb-1"
      style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}>
      <Users className="w-4 h-4 text-indigo-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-mono font-semibold">
          Room <span className="text-indigo-300">{roomCode}</span>
          <span className="text-white/30 ml-2">· {members.length} watching</span>
        </p>
      </div>
      {isHost && (
        <div className="flex items-center gap-1 text-yellow-400 flex-shrink-0">
          <Crown className="w-3 h-3" />
          <span className="text-[10px] font-mono">Host</span>
        </div>
      )}
    </div>
  );
}
