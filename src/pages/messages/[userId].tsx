import ChatWindow from '@/components/Chat/ChatWindow';
import { useRouter } from 'next/router';

export default function ChatPage() {
  const router = useRouter();
  const { userId } = router.query;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      {userId && <ChatWindow receiverId={userId as string} />}
    </div>
  );
}