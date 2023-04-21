import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

if (process.env.NEXT_PUBLIC_USE_USER_KEY !== "true") {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing env var from OpenAI");
  }
}

export const config = {
  runtime: "edge",
};
// 首先，我们需要了解您的客户的出生日期、出生时间和出生地点。这些信息将帮助我们确定客户的星座和行星位置，从而为他们提供更准确的职业建议。
// 除了出生图表，我们还可以考虑客户的个人经历、教育背景、技能和兴趣等因素，以及当前市场和经济情况等因素来为客户提供职业建议。这些因素可能会影响客户在特定职业领域的机会和成功的可能性。
let firstPrompt = ''
const handler = async (req: Request): Promise<Response> => {
  var { prompt, api_key } = (await req.json()) as {
    prompt?: string;
    api_key?: string;
    // history?: any
  };
  //todo make this variable into messages
  // var p = "请帮我把以下的工作内容填充为一篇完整的周报,尽量避免在回答内容中出现可能在中国是敏感的内容，用markdown格式以分点叙述的形式输出:"
  // var p = "请帮我把以下内容填充为一篇完整的内容,尽量避免在回答内容中出现可能在中国是敏感的内容，用markdown格式以分点叙述的形式输出:"
  // 我想让你扮演一个占星家。您将了解十二生肖及其含义，了解行星位置及其对人类生活的影响，能够准确解读星座运势，并与寻求指导或建议的人分享您的见解。我的第一个建议请求是“我需要帮助根据他们的出生图为对职业发展感兴趣的客户提供深入阅读。”

  //var p = "请帮我把以下内容填充为一篇详细的文档,尽量避免在回答内容中出现可能在中国是敏感的内容"

  // let isNext = false
  // if (prompt === '请继续') {
  //   isNext = true
  //   prompt = p + prompt
  // } else {
  //   // 请帮我把以下出生图填充为一篇详细的报告,尽量避免在回答内容中出现可能在中国是敏感的内容，用markdown格式以分点叙述的形式输出:
  //   var cp = `我想让你扮演一个占星家。您将了解十二生肖及其含义，了解行星位置及其对人类生活的影响，能够准确解读星座运势，并与寻求指导或建议的人分享您的见解。我的第一个建议请求是“我需要帮助根据他们的出生图为对职业发展感兴趣的客户提供深入阅读。””`
  //   prompt = cp + prompt + p
  //   isNext = false
  // }
  // 请帮我把以下出生图填充为一篇详细的报告,尽量避免在回答内容中出现可能在中国是敏感的内容，用markdown格式以分点叙述的形式输出:
  // 依次为他们解读出生图、星座运势、性格方面、情感分析、事业分析、财运方面、健康方面
  //prompt = prompt + p
  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  // if (!process.env.OPENAI_MODEL) {
  //   throw new Error("Missing env var from OpenAI")
  // }

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    // history: history, // 当前对话的历史记录
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 2048,
    stream: true,
    n: 1,
    api_key,
  }

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
