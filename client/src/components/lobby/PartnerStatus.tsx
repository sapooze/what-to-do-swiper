import { User } from "../../types";

interface Props {
  users: User[];
  currentUserId: string;
}

export function PartnerStatus({ users, currentUserId }: Props) {
  const partner = users.find((u) => u.id !== currentUserId);

  if (!partner) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        Waiting for your partner to join...
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
      {partner.name} has joined!
    </div>
  );
}
