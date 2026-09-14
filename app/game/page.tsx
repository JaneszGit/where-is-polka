import GameCanvas from "@/components/GameCanvas";

export default function GamePage() {
  return (
    <div className="pt-6">
      <p className="mb-6 text-center text-sm text-ink/50">
        Polka szökik a lime rollerek előtt, amíg nincs nálad.
      </p>
      <GameCanvas />
    </div>
  );
}
