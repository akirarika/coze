export type CozeOptions = {
  baseUrl?: string;
  accessToken: string;
}

export type CozeChat = | {
  role: "user",
  content: string,
  content_type: "text";
} | {
  role: "assistant",
  type: "answer" | "function_call" | "tool_response" | "follow_up" | "verbose",
  content: string,
  content_type: "text";
}

export type CozeChatOptions = {
  bot_id: string;
  conversation_id?: string;
  user: string;
  query: string;
  chat_history?: Array<CozeChat>;
  custom_variables?: Record<string, string>;
}

export type CozeChatResult = {
  success: true;
  code: 0;
  conversation_id: string;
  messages: Array<CozeChat>;
  msg: string;
  getMessages: () => Array<CozeChat>;
  getAnswers: () => Array<CozeChat>;
  getLastAnswer: () => CozeChat;
} | {
  success: false;
  code: number;
  msg: string;
}

const PUBLIC_HEADER = {
  "Content-Type": "application/json",
  "Accept": "*/*",
  "Host": "api.coze.cn",
  "Connection": "keep-alive",
}

export const createCoze = (cozeOptions: CozeOptions) => {
  if (!cozeOptions.baseUrl) cozeOptions.baseUrl = "https://api.coze.cn";

  const coze = {
    async chat(options: CozeChatOptions): Promise<CozeChatResult> {
      try {
        const response = await fetch(`${cozeOptions.baseUrl}/open_api/v2/chat`, {
          "method": "POST",
          headers: {
            ...PUBLIC_HEADER,
            "Authorization": `Bearer ${cozeOptions.accessToken}`
          },
          body: JSON.stringify({ ...options, stream: false })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: CozeChatResult = await response.json();

        if (result.code === 0) result.success = true;
        else result.success = false;

        if (result.success) {
          result.getMessages = () => result.messages;
          result.getAnswers = () => result.messages.filter(message => message.role === "assistant" && message.type === "answer");
          result.getLastAnswer = () => result.messages.filter(message => message.role === "assistant" && message.type === "answer").at(-1)!;
        }

        return result;
      } catch (error: any) {
        console.log(error);
        return {
          success: false,
          code: -1,
          msg: error.messages ?? 'Unknown error'
        }
      }
    },
  }

  return coze;
}