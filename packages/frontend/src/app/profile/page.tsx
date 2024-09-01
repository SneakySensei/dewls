import {
  ProfileHero,
  WalletDetails,
  ChainSelector,
} from "../components/profile";

const Profile: React.FC = () => {
  return (
    <main className="text-neutral-100 flex flex-col gap-y-4">
      <ProfileHero />
      <WalletDetails />
      <ChainSelector />
    </main>
  );
};

export default Profile;
