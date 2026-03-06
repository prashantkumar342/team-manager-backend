import { countTokens } from '@/utils/tokenCounter';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { Ollama, OllamaEmbeddings } from '@langchain/ollama';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

const RELEVANCE_THRESHOLD = 0.75;

const embeddings = new OllamaEmbeddings({
  model: 'nomic-embed-text',
  baseUrl: 'http://localhost:11434',
});

const llm = new Ollama({
  model: 'smollm2:latest',
  baseUrl: 'http://localhost:11434',
});

let vectorStore: Chroma | null = null;

async function getVectorStore(): Promise<Chroma> {
  if (!vectorStore) {
    vectorStore = await Chroma.fromExistingCollection(embeddings, {
      collectionName: 'team_manager_embeddings',
      url: 'http://localhost:8000',
    });
  }
  return vectorStore;
}

/**
 * Custom function to handle retrieval logic:
 * 1. Fetches from Chroma
 * 2. Applies your RELEVANCE_THRESHOLD
 * 3. Returns combined context string or throws "NOT_FOUND"
 */
async function performSearch(question: string) {
  const store = await getVectorStore();
  const results = await store.similaritySearchWithScore(question, 3); // Increased k slightly for better context

  const relevantDocs = results.filter(([_, score]) => score >= RELEVANCE_THRESHOLD);

  if (relevantDocs.length === 0) {
    throw new Error('NOT_FOUND');
  }

  return relevantDocs.map(([doc]) => doc.pageContent).join('\n');
}

export async function askAssistant(question: string): Promise<string> {
  // 1. Define the Template using PromptTemplate for better variable handling
  const template = `
You are a support assistant for the Team Manager application.

Behavior rules:
- Your name is Team Manager Assistant.
- Keep responses extremely short.
- Answer briefly, clearly, and accurately.
- Use ONLY the information provided below.
- Do NOT reference or mention the source of information.
- If the user goes outside the app scope, gently steer the conversation back to Team Manager.
- You may respond with simple, friendly conversation only if it aligns with the app.
- Do NOT invent or assume anything.

If the answer is NOT found in the information below, reply EXACTLY with:
"Sorry, I can only answer questions related to the Team Manager application."

Information:
{context}

User question:
{question}
  `;

  const prompt = PromptTemplate.fromTemplate(template);

  // 2. Build the LCEL Chain
  const chain = RunnableSequence.from([
    {
      // Prepare variables for the prompt
      context: async (input: { question: string }) => await performSearch(input.question),
      question: new RunnablePassthrough(),
    },
    // Middleware-like step to log tokens before hitting the LLM
    async (input) => {
      const formattedPrompt = await prompt.format(input);
      console.log('[AI] Prompt tokens:', countTokens(formattedPrompt));
      return input;
    },
    prompt,
    llm,
    new StringOutputParser(),
  ]);

  try {
    // 3. Execute the chain
    const response = await chain.invoke({ question });
    console.log('response ready');
    return response;
  } catch (error: any) {
    // 4. Handle the custom threshold rejection
    if (error.message === 'NOT_FOUND') {
      return 'Sorry, I can only answer questions related to the Team Manager application.';
    }
    console.error('Chain Error:', error);
    throw error;
  }
}
