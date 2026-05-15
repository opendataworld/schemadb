// RAG (Retrieval-Augmented Generation) Configuration
// All settings via environment variables
export const RAG_CONFIG = {
  CHUNK_SIZE: parseInt(process.env.RAG_CHUNK_SIZE || "512"),
  CHUNK_OVERLAP: parseInt(process.env.RAG_CHUNK_OVERLAP || "50"),
  EMBEDDING_MODEL: process.env.EMBEDDING_MODEL || "all-MiniLM-L6-v2",
  DATA_SOURCE: process.env.RAG_DATA_SOURCE || "https://schema.org/docs-tree.jsonld",
  CACHE_DIR: process.env.RAG_CACHE_DIR || "./data/rag-cache/",
  INDEX_NAME: process.env.RAG_INDEX_NAME || "schemaorg-types"
}
