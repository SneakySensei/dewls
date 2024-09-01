import { ProfileHero } from "../components/profile";
import { WalletDetails } from "../components/profile/WalletDetails";

const Profile: React.FC = () => {
  return (
    <main className="text-neutral-100 flex flex-col gap-y-4">
      <ProfileHero />
      <WalletDetails />
    </main>
  );
};

export default Profile;
