import { last, toString } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";

type T_MsgType = "bot" | "user";
enum E_MsgType {
    Bot = "bot",
    User = "user",
}
type T_Message = {
    text: string;
    type: T_MsgType;
};

const SSEComponent = () => {
    const endpoint =
        "https://us-central1-tablesmart-e4593.cloudfunctions.net/sse";
    // Create a ref to store the EventSource instance and Create the EventSource when the component mounts
    const eventSourceRef = useRef<EventSource | null>(null);

    const [messages, setMessages] = useState<T_Message[]>([
        {
            text: "Hi, I'm a Abdulla. Founder of the myaiclone. What I can assist you? Can I assist you more ?",
            type: "user",
        },
    ]);
    const [error, setError] = useState("");

    const processToken = (token: string): string => {
        return token.replace(/\\n/g, "\n").replace(/\"/g, "");
    };
    const [startSubmit, setStartSubmit] = useState<boolean>(false);

    const handleClose = useCallback(() => {
        setStartSubmit(false);
    }, []);

    const handleError = useCallback(
        (event: Event) => {
            const errorEvent = event as Event & { error: DOMException | null };
            const error = errorEvent.error;

            if (eventSourceRef.current) eventSourceRef.current.close(); // Close the SSE connection on error (optional)
            setStartSubmit(false);
            setError(toString(error));
        },
        [eventSourceRef]
    );

    const handleNewToken = useCallback((event: MessageEvent) => {
        var msgList: T_Message[] = JSON.parse(JSON.stringify(messages));
        const lastMsg = last(msgList);
        const isUser = lastMsg?.type === E_MsgType.User;
        const newestText = lastMsg?.text ?? "";
        const token = processToken(event.data);

        //create bot msg if not exist
        if (isUser) {
            msgList[msgList.length] = { type: E_MsgType.Bot, text: "" };
        }

        // Update messages by creating a new message object
        msgList[msgList.length - 1].text = newestText + token;
        setMessages(msgList);
        // Log the processed token (optional)
        console.log("Processed Token:", token, msgList, isUser);
    }, []);

    useEffect(() => {
        eventSourceRef.current = new EventSource(endpoint);
        let eventSource: EventSource = eventSourceRef.current;

        if (startSubmit) {
            eventSource = new EventSource(endpoint);

            eventSource.addEventListener("newToken", handleNewToken);
            eventSource.addEventListener("error", handleError);
            eventSource.addEventListener("close", handleClose);
            eventSource.addEventListener("end", handleClose);
        }

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [startSubmit, handleNewToken, handleError, handleClose]);

    return (
        <div className="container">
            <button onClick={() => setStartSubmit(true)}>Submit</button>
            <p> hello form chat page {toString(JSON.stringify(messages))}</p>
            <p>{error}</p>
        </div>
    );
};

export default SSEComponent;