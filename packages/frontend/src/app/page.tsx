import Footer from "./components/Footer";
import GameListing from "./components/GameListing";
import { API_REST_BASE_URL } from "@/utils/constants/api.constant";
import { MappedGame, ResponseWithData } from "@/utils/types";

export default async function GameListingPage() {
    const res = await fetch(`${API_REST_BASE_URL}/games`, {
        cache: "no-cache",
    });
    const gamesResponse = (await res.json()) as ResponseWithData<MappedGame[]>;

    const games = gamesResponse.success ? gamesResponse.data : [];
    return (
        <>
            <GameListing games={games} />
            <Footer />
        </>
    );
}
