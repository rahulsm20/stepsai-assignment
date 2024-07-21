import { ArrowRight, RotateCw } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { getUser, sendQuery } from "../api";
import { RootState } from "../App";
import { setUser } from "../store/authSlice";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

const ChatbotWidget = () => {
  const messages = useSelector((state: RootState) => state.auth.user.messages);
  const profileData = useSelector((state: RootState) => state.auth.user);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const [sendingQuery, setSendingQuery] = useState(false);
  const dispatch = useDispatch();
  const [chatOpen, setChatOpen] = useState(false);
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, chatOpen]);

  const [query, setQuery] = useState("");
  const submitQuery = async (e: FormEvent) => {
    e.preventDefault();
    setSendingQuery(true);
    setQuery("Loading...");
    try {
      const data = {
        query,
        interactionId: undefined,
      };
      const response = await sendQuery(data);

      if (response) {
        setQuery("");
        const profile = await getUser();
        dispatch(setUser(profile));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSendingQuery(false);
    }
  };
  return (
    <>
      <Button
        className="fixed bottom-5 right-5"
        onClick={() => setChatOpen(!chatOpen)}
      >
        {chatOpen ? "Close Chat" : "Open Chat"}
      </Button>
      {chatOpen && (
        <div className="fixed z-10 right-10 bottom-32 h-96 bg-transparent w-80 flex flex-col">
          <div className="border p-5 backdrop-blur-xl rounded-t-xl">
            {profileData.firstName}
          </div>
          <div className="flex flex-col gap-4 overflow-auto p-5 mb-2 border-b border-x rounded-b-xl w-full h-full backdrop-blur-xl">
            {messages.map((message) => (
              <Markdown
                className={`${
                  message.isResponse ? "" : "self-end right-0"
                } max-w-40 text-xs text-wrap text-start bg-slate-100 dark:bg-slate-700 dark:text-slate-200 rounded-xl p-4`}
              >
                {message.content}
              </Markdown>
            ))}
            <div ref={messageEndRef} />
          </div>
          <form
            className="flex z-10 justify-center items-center bottom-10 w-full max-w-lg self-center"
            onSubmit={submitQuery}
          >
            <Textarea
              placeholder={sendingQuery ? "Loading..." : "Ask anything"}
              disabled={sendingQuery}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            ></Textarea>
            <Button className="absolute right-1 rounded-xl p-2" size={"sm"}>
              {sendingQuery ? (
                <RotateCw className="animate-spin" />
              ) : (
                <ArrowRight size={"sm"} />
              )}
            </Button>
          </form>{" "}
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
