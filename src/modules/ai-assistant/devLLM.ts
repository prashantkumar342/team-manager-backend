export class DevLLM {
  async invoke(prompt: string) {
    return {
      content: `DEV MODE RESPONSE:\n${prompt.slice(0, 300)}`,
    };
  }
}
