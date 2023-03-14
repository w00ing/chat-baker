import type { ParsedUrlQuery } from "querystring";
import { useCallback, useEffect, useRef, useState } from "react";
import { type GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { cn } from "@/libs/cn";
import type { ChatMessage } from "@/pages/api/chat";
import { AnimatePresence, motion } from "framer-motion";
import { Send } from "lucide-react";
import { isMobile } from "react-device-detect";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { v4 as uuid } from "uuid";

import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import LoadingDots from "@/components/ui/loading-dots";

type PageProps = { query: ParsedUrlQuery };

type FormData = {
  input: string;
};

type Message = ChatMessage & { id: string };

const scrollToBottom = (element: HTMLElement) => {
  element.scroll({
    behavior: "auto",
    top: element.scrollHeight,
  });
};

const Chat: NextPage<PageProps> = ({ query }) => {
  const source = (query.source || "sss") as string;
  const title = `Chatting with ${source}`;

  const [messages, setMessages] = useState<Message[]>([]);
  const [fetchingAnswer, setFetchingAnswer] = useState<boolean>(false);

  const chatContainerRef = useRef<HTMLParagraphElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<FormData>({
    defaultValues: {
      input: "",
    },
    shouldUnregister: true,
  });

  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      scrollToBottom(chatContainerRef.current);
    }
  }, []);

  useEffect(() => {
    handleScroll();
  }, [messages, handleScroll]);

  const fetchAnswer = async (input: string) => {
    setFetchingAnswer(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ input }),
      }).then((data) => data.json());
      const answer = res.answer as ChatMessage;
      const answerMessage = { ...answer, id: uuid() };

      console.log("res", res);
      setMessages((prev) => [...prev, answerMessage]);
      setFetchingAnswer(false);
    } catch (e) {
      console.error(e);
      setFetchingAnswer(false);
    }
  };

  const onSubmit = async (formData: FormData) => {
    if (fetchingAnswer) return;
    setMessages((prev) => [
      ...prev,
      { id: uuid(), role: "user", content: formData.input.trim() },
    ]);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    handleScroll();
    fetchAnswer(formData.input.trim());
  };

  useEffect(() => {
    reset({ input: "" }, {});
  }, [isSubmitSuccessful, reset]);

  return (
    <Layout>
      <Head>
        <title>{title}</title>
      </Head>
      <Header title={source} />
      <section className="overflow-hidden w-full mx-auto flex h-full flex-1 justify-between  flex-col pt-20 pb-16 sm:max-w-lg">
        <div ref={chatContainerRef} className="flex flex-col overflow-auto">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.45 } }}
                className={cn(
                  `m-4 flex`,
                  message.role === "user" ? "justify-end" : ""
                )}
              >
                <p
                  className={cn(
                    "py-2 px-3 rounded-t-xl max-w-xs whitespace-pre-wrap",
                    message.role === "user"
                      ? "rounded-bl-xl bg-blue-500 "
                      : "rounded-br-xl bg-slate-600"
                  )}
                >
                  {message.content}
                </p>
              </motion.div>
            ))}
            {fetchingAnswer ? (
              <motion.div className="m-4 bg-slate-500 py-5 rounded-t-xl rounded-br-xl w-16 flex justify-center items-center">
                <LoadingDots color="white" size="large" />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </section>

      <div className="w-full max-w-lg mx-auto border-t-white/20 border-t pt-2 flex absolute bottom-0 left-auto px-2 mb-2 sm:mb-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full items-end flex justify-end"
        >
          <TextareaAutosize
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.altKey && isMobile) {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
              if (e.key === "Enter" && !e.shiftKey && !isMobile) {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
            className={cn(
              "dark:bg-slate-700 flex w-full outline-none border-none focus:outline-none focus:ring-0 focus:ring-offset-0",
              "flex h-20 w-full rounded-md border border-slate-300 bg-transparent py-3 pl-3 pr-14 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900"
            )}
            placeholder={`Ask ${source} anything!`}
            maxLength={100}
            {...register("input", {
              required: true,
              minLength: 1,
              maxLength: 1000,
            })}
          />
          <Button
            disabled={fetchingAnswer}
            className="absolute right-2 bottom-0.5 self-end items-center flex"
          >
            {fetchingAnswer ? <LoadingDots /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
      {/* <Footer /> */}
    </Layout>
  );
};

export default Chat;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  return {
    props: { query },
  };
};
