import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket/socket";
import { useRoomStore } from "../store/useRoomStore";
import { Room, Match } from "../types";

interface RoomCreated { room: Room; userId: string }
interface RoomJoined { room: Room; userId: string }
interface RoomUpdated { room: Room }
interface MatchFound { match: Match; allMatches: Match[] }
interface ErrorEvt { message: string }

export function useSocket() {
  const { setRoom, setUserId, setPendingMatch, setPartnerDisconnected, setConnectionError } =
    useRoomStore();
  const navigate = useNavigate();

  useEffect(() => {
    function onRoomCreated(payload: RoomCreated) {
      setUserId(payload.userId);
      setRoom(payload.room);
      // Persist for reconnect
      sessionStorage.setItem("roomCode", payload.room.code);
      sessionStorage.setItem("userId", payload.userId);
      navigate(`/room/${payload.room.code}`);
    }

    function onRoomJoined(payload: RoomJoined) {
      setUserId(payload.userId);
      setRoom(payload.room);
      sessionStorage.setItem("roomCode", payload.room.code);
      sessionStorage.setItem("userId", payload.userId);
      navigate(`/room/${payload.room.code}`);
    }

    function onRoomUpdated(payload: RoomUpdated) {
      setRoom(payload.room);
    }

    function onMatchFound(payload: MatchFound) {
      setRoom({ ...useRoomStore.getState().room!, matches: payload.allMatches });
      setPendingMatch(payload.match);
    }

    function onPartnerDisconnected() {
      setPartnerDisconnected(true);
    }

    function onError(payload: ErrorEvt) {
      setConnectionError(payload.message);
    }

    socket.on("room-created", onRoomCreated);
    socket.on("room-joined", onRoomJoined);
    socket.on("room-updated", onRoomUpdated);
    socket.on("match-found", onMatchFound);
    socket.on("partner-disconnected", onPartnerDisconnected);
    socket.on("error", onError);

    return () => {
      socket.off("room-created", onRoomCreated);
      socket.off("room-joined", onRoomJoined);
      socket.off("room-updated", onRoomUpdated);
      socket.off("match-found", onMatchFound);
      socket.off("partner-disconnected", onPartnerDisconnected);
      socket.off("error", onError);
    };
  }, [setRoom, setUserId, setPendingMatch, setPartnerDisconnected, setConnectionError, navigate]);
}
