
## Project Overview

This project is a RAG (Retrieval-Augmented Generation) application that answers questions about UAE law documents. It has a Python backend and a React frontend.

**Backend:**

*   The backend is a Python application that uses LangChain to create an agent that can answer questions about UAE law documents.
*   The `document_processing.py` script reads PDF documents from the `doc` directory, chunks them, and indexes them into a LanceDB vector store.
*   The `AgenticRag.py` script creates a LangChain agent that uses the LanceDB vector store to retrieve relevant documents and a Google Generative AI model to generate answers.
*   The backend uses a number of open-source libraries, including `langchain`, `lancedb`, `sentence-transformers`, and `streamlit`.

**Frontend:**

*   The frontend is a React application that provides a chat interface to the backend.
*   The frontend is built with Vite and uses a number of open-source libraries, including `react`, `react-router-dom`, `@tanstack/react-query`, and `shadcn-ui`.

## Building and Running

**Backend:**

1.  Install the required Python packages:
    ```
    pip install -r requirements.txt
    ```
2.  Run the document processing script:
    ```
    python document_processing.py
    ```
3.  Run the Streamlit application:
    ```
    streamlit run AgenticRag.py
    ```

**Frontend:**

1.  Install the required Node.js packages:
    ```
    cd ua-law-chat
    npm install
    ```
2.  Run the development server:
    ```
    npm run dev
    ```

## Development Conventions

*   The Python code follows the PEP 8 style guide.
*   The React code follows the standard React conventions.
*   The project uses Git for version control.

