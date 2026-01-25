import { countTokens } from '@/utils/tokenCounter';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { Ollama, OllamaEmbeddings } from '@langchain/ollama';

const RELEVANCE_THRESHOLD = 0.75;

const embeddings = new OllamaEmbeddings({
  model: 'nomic-embed-text',
  baseUrl: 'http://localhost:11434',
});

const llm = new Ollama({
  model: 'phi3:mini',
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

Rules:
- Answer ONLY using the provided context.
- Do not mention the word "context".
- Do not say phrases like "according to the context".
- If the answer is not explicitly present, respond EXACTLY with:
"Sorry, I can only answer questions related to the Team Manager application."

Context:
${context}

Question:
${question}
`;

  const tokenCount = countTokens(prompt);
  console.log('[AI] Prompt tokens:', tokenCount);

  const response = await llm.invoke(prompt);

  return response;
}
