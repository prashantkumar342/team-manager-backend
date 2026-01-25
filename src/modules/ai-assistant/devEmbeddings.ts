import { Embeddings } from '@langchain/core/embeddings';

export class DevEmbeddings extends Embeddings {
  constructor() {
    super({});
  }

  async embedQuery(text: string): Promise<number[]> {
    return fake(text);
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    return texts.map(fake);
  }
}

function fake(text: string, size = 384): number[] {
  const vector = new Array(size).fill(0);
  for (let i = 0; i < text.length; i++) {
    vector[i % size] += text.charCodeAt(i) / 255;
  }
  return vector;
}
