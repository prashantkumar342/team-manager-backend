import { countTokens } from '@/utils/tokenCounter';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { Ollama, OllamaEmbeddings } from '@langchain/ollama';

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
    console.log(vectorStore, 'check vector store');
    vectorStore = await Chroma.fromExistingCollection(embeddings, {
      collectionName: 'team_manager_embeddings',
      url: 'http://localhost:8000',
    });
  }
  return vectorStore;
}

export async function askAssistant(question: string): Promise<string> {
  const store = await getVectorStore();

  const results = await store.similaritySearchWithScore(question, 4);

  const relevantDocs = results.filter(([_, score]) => score >= RELEVANCE_THRESHOLD);

  if (!relevantDocs.length) {
    return 'Sorry, I can only answer questions related to the Team Manager application.';
  }

  const context = relevantDocs.map(([doc]) => doc.pageContent).join('\n');

  const prompt = `
  You are a support assistant for the Team Manager application.

  Behavior rules:
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
  ${context}

  User question:
  ${question}
  `;

  const tokenCount = countTokens(prompt);
  console.log('[AI] Prompt tokens:', tokenCount);

  const response = await llm.invoke(prompt);
  console.log('response ready');
  return response;
}
