import fs from 'fs';
import path from 'path';
import { ChromaClient } from 'chromadb';
// import { OllamaEmbeddings } from '@langchain/community/embeddings/o';
import { chunkText } from '../../utils/chunker';
import { OllamaEmbeddings } from '@langchain/ollama';

const chromaClient = new ChromaClient({
  host: 'localhost',
  port: 8000,
  ssl: false,
});

async function runSeeder() {
  try {
    // use the docs file of context to make vectors
    const docsPath = path.join(__dirname, 'docs.md');
    const raw = fs.readFileSync(docsPath, 'utf-8');

    // make chunks of the text from docs file
    const chunks = chunkText(raw, 400);

    // create or get collection from vector db
    const collection = await chromaClient.getOrCreateCollection({
      name: 'team_manager_embeddings',
      embeddingFunction: null,
    });

    // use a model to make embeddings
    const embeddingsModel = new OllamaEmbeddings({
      model: 'nomic-embed-text',
      baseUrl: 'http://localhost:11434',
    });

    const embeddings = await embeddingsModel.embedDocuments(chunks);

    await collection.add({
      ids: chunks.map((_, i) => `docs-${i}`),
      documents: chunks,
      embeddings,
    });

    console.log('Embeddings created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeder failed:', error);
    process.exit(1);
  }
}

runSeeder();
