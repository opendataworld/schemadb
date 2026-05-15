// RAG (Retrieval-Augmented Generation) Configuration
export const RAG_CONFIG = {
  // Chunk settings
  CHUNK_SIZE: 512,
  CHUNK_OVERLAP: 50,
  
  // Embedding model
  EMBEDDING_MODEL: process.env.EMBEDDING_MODEL || "all-MiniLM-L6-v2",
  
  // Data source - schema.org JSON-LD
  DATA_SOURCE: "https://schema.org/docs-tree.jsonld",
  
  // Cache location
  CACHE_DIR: "./data/rag-cache/",
  
  // Index name
  INDEX_NAME: "schemaorg-types"
}
