"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import ROUTES from "@/constants/routes";
import { toast } from "sonner";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { updateUser } from "@/lib/actions/user.action";
import { ProfileSchema } from "@/lib/validations";
import { Textarea } from "../ui/textarea";

interface Params {
  user: User;
}

const ProfileForm = ({ user }: Params) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name || "",
      username: user?.username || "",
      portfolio: user?.portfolio || "",
      location: user?.location || "",
      bio: user?.bio || "",
    },
  });

  const handleUpdaateUser = async (values: z.infer<typeof ProfileSchema>) => {
    startTransition(async () => {
      const result = await updateUser({ ...values });
      if (result.success) {
        toast("Success", {
          description: "Your Profile has been updated successfully",
        });
        router.push(ROUTES.PROFILE(user?._id));
      } else {
        toast(`Error ${result.status}`, {
          description: result.error?.message || "Something went wrong",
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="mt-9 flex w-full flex-col gap-9"
        onSubmit={form.handleSubmit(handleUpdaateUser)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                name <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  placeholder="Your Name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Username <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  placeholder="Your username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Portfolio Link
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="url"
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  placeholder="Your Portfolio link"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Location <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  placeholder="Where do you live?"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Bio <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  placeholder="What's special about you?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-16 flex justify-end">
          <Button
            type="submit"
            disabled={isPending}
            className="primary-gradient w-fit !text-light-900"
          >
            {isPending ? (
              <>
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                <span>Submitting</span>
              </>
            ) : (
              <>Submit</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
