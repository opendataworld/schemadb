# Deployment Environment Variables

## Required
```
AUTH_SECRET=your-secret-key
```

## LLM Providers (pick one or more)

### Local (Priority: llama.cpp first)
```
LLAMA_CPP_HOST=http://localhost:8080
HF_HOST=http://localhost:8001
OLLAMA_HOST=http://localhost:11434
LMSTUDIO_HOST=http://localhost:1234
```

### Free Cloud APIs
```
OPENROUTER_KEY=
GROQ_KEY=
TOGETHER_KEY=
HF_TOKEN=
```

### Paid Cloud APIs
```
OPENAI_KEY=
ANTHROPIC_KEY=
GOOGLE_KEY=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
GCLOUD_KEY=
```

## Optional
```
MAX_HISTORY=20
TAVILY_API_KEY=
```
