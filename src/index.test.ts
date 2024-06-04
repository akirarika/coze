import { env } from "node:process";
import { createCoze } from ".";

const coze = createCoze({
    accessToken: env["ACCESS_TOKEN"]!
})

const result = await coze.chat({
    bot_id: "7376541647389212710",
    query: "你好世界",
    user: "your_user_id"
});

if (!result.success) throw new Error(result.msg);

console.log("原始响应", result);
console.log("获取消息", result.getMessages());
console.log("获取回复", result.getAnswers());
console.log("获取最后一条回复", result.getLastAnswer());
