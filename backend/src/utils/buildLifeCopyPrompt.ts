type BuildParams = {
  scene: string;
  keywords: string;
  tone: string;
  emotion?: string;
  withImage?: boolean;
  withTags?: boolean;
};

export function buildLifeCopyPrompt({
  scene,
  keywords,
  tone,
  emotion,
  withImage,
  withTags
}: BuildParams): string {
  let prompt = `请根据以下信息生成3条适合发${scene}的短文案，风格为${tone}。`;

  if (emotion) prompt += ` 当前情绪：${emotion}。`;
  if (withImage) prompt += ` 该内容将配图，请让文案更具画面感。`;
  if (withTags) prompt += ` 请适当添加流行标签（如 #今日份日常）。`;

  prompt += ` 关键词：${keywords}。每条不超过100字，简洁有感染力。`;

  return prompt;
}
