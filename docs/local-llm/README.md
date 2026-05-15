# Local LLM Setup

## Priority Order
1. **llama.cpp** (port 8080) - fastest, C++
2. HF TGI (port 8001)
3. Ollama (port 11434)
4. LM Studio (port 1234)
5. Docker Ollama
6. Podman Ollama

## llama.cpp (C++)
```bash
# Run server
docker run -d -p 8080:8080 ghcr.io/ggerganov/llama.cpp:server-cuda

# Or direct
./server -m model.gguf --port 8080
```

## Environment
```
LLAMA_CPP_HOST=http://localhost:8080
HF_HOST=http://localhost:8001
OLLAMA_HOST=http://localhost:11434
LMSTUDIO_HOST=http://localhost:1234
```
