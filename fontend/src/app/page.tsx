import HomePage from "@/components/layout/homepage";
import { Button } from "antd";
import { auth, signIn } from "@/auth"

export default async function Home() {
  const session = await auth();
  if (!session) return <div>Not authenticated</div>
  return (
    <div>
      <HomePage />
      <div>{JSON.stringify(session)}</div>
      <form
        action={async () => {
          "use server"
          await signIn()
        }}
      >
        <Button htmlType="submit">Sign in</Button>
      </form>
    </div >
  );
}
