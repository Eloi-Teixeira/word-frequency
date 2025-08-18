import UserAside from "../components/user/UserAside";
import UserConfig from "../components/user/UserConfig";
import UserStats from "../components/user/UserStats";


export default function UserPage() {
  return (
    <div className="user-page">
      <main>
        <UserAside />
        <UserStats />
        {/* <UserConfig /> */}
      </main>
    </div>
  );
}
