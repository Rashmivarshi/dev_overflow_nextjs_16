import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";

const Home = async () => {
  const session = await auth(); // Simulating session data
  console.log(session);

  return (
    <>
      <h1 className=" text-5xl text-light-500">welcome to next.js 16👋</h1>
      <form
        className="px-10 pt-[100px]"
        action={async () => {
          "use server";
          await signOut({ redirectTo: ROUTES.SIGN_IN });
        }}
      >
        <Button> Logout</Button>
      </form>
    </>
  );
};

export default Home;
