import { useEffect, useState } from "react";
import { type NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import logoBlack from "@public/logo-black.svg";
import logoWhite from "@public/logo.svg";
import { useForm } from "react-hook-form";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormData = {
  url: string;
};

const Home: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { isSubmitSuccessful, errors },
  } = useForm<FormData>({
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    const res = await fetch("/api/prepare-chatbot", {
      method: "POST",
      body: JSON.stringify({ url: formData.url }),
    }).then((data) => data.json());
    setLoading(false);
    router.push(`/chat?source=${res.hostname}`);
  };

  useEffect(() => {
    if (router.isReady) {
      setFocus("url");
    }
  }, [router.isReady, setFocus]);

  useEffect(() => {
    reset({ url: "" });
  }, [isSubmitSuccessful, reset]);

  return (
    <Layout>
      <section className="mx-auto flex h-full justify-center items-center flex-1 w-full max-w-6xl flex-col pb-2 pt-24 sm:max-w-lg">
        <Image src={logoWhite} alt="logo" className="h-6 w-6" />
        <h1 className="text-2xl text-white font-bold tracking-tight sm:mt-1.5 sm:text-3xl">
          Chat Baker
        </h1>
        <p className="mt-2 text-slate-300">Bake a chatbot from any url!</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-4 px-4 flex flex-col gap-4 w-full max-w-lg items-center space-x-2"
        >
          <Input
            className="flex-1"
            placeholder="Paste any url..."
            maxLength={100}
            {...register("url", {
              required: true,
              minLength: 1,
              pattern: {
                value: /^(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
                message: "Please enter a valid url",
              },
            })}
          />
          {errors.url && (
            <span className="text-sm text-red-500">{errors.url.message}</span>
          )}
          <Button size="lg" disabled={loading}>
            <Image src={logoBlack} alt="logo" className="h-6 w-6" />
            {loading ? (
              <p className="ml-2">Baking...</p>
            ) : (
              <p className="ml-2">Start Baking!</p>
            )}
          </Button>
        </form>
      </section>
      {/* <Footer /> */}
    </Layout>
  );
};

export default Home;
