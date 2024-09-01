import {
  MappedLeaderboard,
  MappedSeason,
  ResponseWithData,
} from "@/utils/types";
import { API_BASE_URL } from "@/utils/constants/api.constant";
import { Leaderboard } from "../components/leaderboard/leaderboard";

export default async function LeaderboardPage() {
  const leaderboardRes = await fetch(
    `${API_BASE_URL}/seasons/current/leaderboard`,
    {
      cache: "no-cache",
    }
  );
  const leaderboardResponse = (await leaderboardRes.json()) as ResponseWithData<
    MappedLeaderboard[]
  >;

  const seasonsRes = await fetch(`${API_BASE_URL}/seasons`, {
    cache: "no-cache",
  });
  const seasonsResponse = (await seasonsRes.json()) as ResponseWithData<
    MappedSeason[]
  >;

  const leaderboard = leaderboardResponse.success
    ? leaderboardResponse.data
    : [];

  const seasons = seasonsResponse.success ? seasonsResponse.data : [];

  return (
    <Leaderboard
      leaderboard={leaderboard}
      seasons={[
        ...seasons,
        ...seasons,
        ...seasons,
        ...seasons,
        ...seasons,
        ...seasons,
        ...seasons,
        ...seasons,
      ]}
    />
  );
}
