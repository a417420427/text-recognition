/**
 * 把用户传过来的 prompt 和 keywords 拼接成 AI 可用的指令
 */
export function buildAiPrompt(
  keywords: string[],
  style: string,
  length: "short" | "medium" | "long"
): string {
  return `请帮我写一篇产品介绍文案，风格是${style}，篇幅为${
    length === "short" ? "简短" : length === "long" ? "较长" : "中等长度"
  }。请务必自然地包含以下关键词：${keywords.join("，")}。`;
}
