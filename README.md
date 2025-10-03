# UAE Law RAG Chat

A Retrieval-Augmented Generation (RAG) application to answer questions about UAE law documents, featuring a Python backend and a React frontend.

## Features

*   **Natural Language Queries:** Ask questions about UAE law in plain English.
*   **Accurate Answers:** Get answers based on a knowledge base of UAE law documents.
*   **User-Friendly Interface:** A simple chat interface for interacting with the application.
*   **Scalable Architecture:** Built with a modern and scalable architecture.

## Technologies

*   **Backend:**
    *   Python
    *   FastAPI
    *   LangChain
    *   LanceDB
    *   Sentence-Transformers
    *   `uv` for package management

*   **Frontend:**
    *   React
    *   Vite
    *   TypeScript
    *   Tailwind CSS
    *   shadcn-ui

## Model Usage

This project uses the `google/embeddinggemma-300m` model from Hugging Face. Before using the model, you must agree to the terms of use on the [model's page](https://huggingface.co/google/embeddinggemma-300m).

You will also need a Hugging Face token with access to the model.

## Project Structure

```
RAG_overLawDocuemnts/
├── backend/
│   ├── src/
│   │   ├── agent/
│   │   ├── api/
│   │   ├── doc/
│   │   ├── lancedb/
│   │   ├── prompts/
│   │   ├── scripts/
│   │   └── main.py
│   ├── pyproject.toml
│   └── uv.lock
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   ├── lib/
    │   └── pages/
    ├── package.json
    └── ...
```

## Prerequisites

*   Python 3.9+
*   Node.js 18+
*   `uv` installed (`pip install uv`)

## Installation and Running

### Backend

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create the virtual environment:**
    ```bash
    uv venv
    ```

3.  **Activate the virtual environment:**
    *   On Windows:
        ```bash
        .venv\Scripts\activate
        ```
    *   On macOS/Linux:
        ```bash
        source .venv/bin/activate
        ```

4.  **Install the dependencies:**
    ```bash
    uv pip install -e .
    ```

5.  **Run the document processing script to build the vector store:**
    ```bash
    python -m src.scripts.document_processing
    ```

6.  **Run the FastAPI application:**
    ```bash
    python -m src.main
    ```

### Frontend

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install the dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173`.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.


