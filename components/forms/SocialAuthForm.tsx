"use client";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import Image from "next/image";
import { toast } from "sonner";
import ROUTES from "@/constants/routes";
import { useRouter } from "next/navigation";

const SocialAuthForm = () => {
  const buttonclass =
    "background-dark400_light900 body-medium text-dark200_light800 min-h-12 flex-1 rounded-2 px-4 py-3.5";
  const router = useRouter();

  const handleSignIn = async (provider: "github" | "google") => {
    try {
      await signIn(provider, {
        callbackUrl: ROUTES.HOME,
        redirect: false,
      }).then((result) => {
        if (result?.url) {
          router.push(result.url); // client-side navigation
        }
      });
    } catch (error) {
      console.log(error);
      toast.error("sign-in failed", {
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during sign-in",
      });
    }
  };
  return (
    <div className="mt-10 flex flex-wrap gap-2.5 ">
      <Button
        className={buttonclass}
        onClick={() => handleSignIn("github")}
        variant="destructive"
      >
        <Image
          src="icons/github.svg"
          alt="github icon"
          width={20}
          height={20}
          className="invert-colors mr-2.5 object-contain"
        />
        <span>Log in with GitHub</span>
      </Button>
      <Button
        className={buttonclass}
        onClick={() => handleSignIn("google")}
        variant="destructive"
      >
        <Image
          src="icons/google.svg"
          alt="google icon"
          width={20}
          height={20}
          className="invert-colors mr-2.5 object-contain"
        />
        <span>Log in with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
