import UserAside from '../components/user/UserAside';
import UserStats from '../components/user/UserStats';

export default function UserPage() {
  return (
    <div className="user-page">
      <div>
        <UserAside />
        <main className='user-main'>
          <UserStats />

        </main>
      </div>
    </div>
  );
}
