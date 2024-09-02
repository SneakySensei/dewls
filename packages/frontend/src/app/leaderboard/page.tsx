import {
  MappedLeaderboard,
  MappedSeason,
  ResponseWithData,
} from "@/utils/types";
import { API_BASE_URL } from "@/utils/constants/api.constant";
import { Leaderboard } from "../components/leaderboard/leaderboard";

export default async function LeaderboardPage() {
  const seasonsRes = await fetch(`${API_BASE_URL}/seasons`, {
    cache: "no-cache",
  });
  const seasonsResponse = (await seasonsRes.json()) as ResponseWithData<
    MappedSeason[]
  >;
  const seasons = seasonsResponse.success ? seasonsResponse.data : [];

  let leaderboard: MappedLeaderboard[] = [];

  if (seasons.length) {
    const leaderboardRes = await fetch(
      `${API_BASE_URL}/leaderboard/${seasons[0].season_id}`,
      {
        cache: "no-cache",
      }
    );
    const leaderboardResponse =
      (await leaderboardRes.json()) as ResponseWithData<MappedLeaderboard[]>;
    if (leaderboardResponse.success) {
      leaderboard = leaderboardResponse.data;
    }
  }

  return <Leaderboard leaderboard={leaderboard} seasons={seasons} />;
}
