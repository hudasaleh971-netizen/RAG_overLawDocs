from loguru import logger
from pathlib import Path
from typing import List

from dotenv import load_dotenv
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import LanceDB as LanceDBVectorStore
import lancedb
from langchain_docling.loader import ExportType
from langchain_docling import DoclingLoader
from docling.chunking import HybridChunker

from src.scripts.logging import setup_logger
# Configure Loguru: log to console and rotating file
setup_logger()
HUGGING_FACE_TOKEN = os.getenv("HUGGING_FACE_TOKEN")

# Login to Hugging Face
if HUGGING_FACE_TOKEN:
    login(token=HUGGING_FACE_TOKEN)

def get_embeddings() -> HuggingFaceEmbeddings:
    """Initialize Hugging Face embeddings to run locally."""
    try:
        embeddings = HuggingFaceEmbeddings(
            model_name="google/embeddinggemma-300m",
            query_encode_kwargs={"prompt_name": "query"},
            encode_kwargs={"prompt_name": "document"}
        )
        return embeddings
    except Exception as e:
        logger.error(f"Failed to initialize local embeddings: {e}")
        raise

def load_pdfs_with_docling(directory: str = "src/doc") -> List[Document]:
    """Load and chunk PDFs using DoclingLoader with HybridChunker."""
    try:
        pdf_paths = sorted(Path(directory).glob("**/*.pdf"))
        if not pdf_paths:
            raise ValueError(f"No PDF files found in directory: {directory}")
        
        all_docs: List[Document] = []
        for pdf_path in pdf_paths:
            loader = DoclingLoader(
                file_path=str(pdf_path),
                export_type=ExportType.DOC_CHUNKS,
                chunker=HybridChunker(
                    tokenizer="sentence-transformers/all-MiniLM-L6-v2",
                    max_chunk_size=512,
                    overlap=50
                )
            )
            docs = loader.load()

            for i, doc in enumerate(docs):
                dl_meta = (doc.metadata or {}).get("dl_meta", {})
                origin = dl_meta.get("origin", {})
                raw_headings = dl_meta.get("headings", [])

                # Normalize headings to a simple list of strings
                normalized_headings = []
                for h in raw_headings if isinstance(raw_headings, (list, tuple)) else []:
                    if isinstance(h, str):
                        normalized_headings.append(h)
                    elif isinstance(h, dict):
                        # Common fields seen in heading dicts
                        text = h.get("text") or h.get("title") or h.get("heading")
                        if isinstance(text, str) and text.strip():
                            normalized_headings.append(text.strip())

                filtered_metadata = {
                    "filename": origin.get("filename", str(pdf_path)),
                    "headings": normalized_headings,
                }

                new_doc = Document(page_content=doc.page_content, metadata=filtered_metadata)
                all_docs.append(new_doc)

            # Log a brief sample for verification
            # for i, doc in enumerate(all_docs[-3:], 1):  # sample last few from this file
            #     preview = doc.page_content
            #     logger.info(f"Sample chunk {i} from {pdf_path.name}: {preview}")
            #     logger.info(f"Filtered metadata: {doc.metadata}")
        
        logger.info(f"Loaded {len(all_docs)} chunks from {len(pdf_paths)} PDFs")
        return all_docs
    except Exception as e:
        logger.error(f"Failed to load PDFs: {e}")
        raise

def connect_lancedb(uri: str = "src/lancedb") -> lancedb.db.LanceDBConnection:
    """Connect to LanceDB database."""
    try:
        Path(uri).mkdir(parents=True, exist_ok=True)
        db = lancedb.connect(uri)
        logger.info(f"Connected to LanceDB at {uri}")
        return db
    except Exception as e:
        logger.error(f"Failed to connect to LanceDB: {e}")
        raise

def index_with_lancedb(
    docs: List[Document],
    embeddings,
    db_uri: str = "src/lancedb",
    table_name: str = "documents",
    overwrite: bool = True,
) -> LanceDBVectorStore:
    """Index documents into LanceDB."""
    try:
        db = connect_lancedb(db_uri)
        # Optionally drop the existing table to avoid schema mismatch
        if overwrite:
            try:
                existing = set(db.table_names())
                if table_name in existing:
                    logger.info(f"Dropping existing LanceDB table '{table_name}' to apply new schema")
                    db.drop_table(table_name)
            except Exception as drop_err:
                logger.warning(f"Could not drop existing table '{table_name}': {drop_err}")
        vectorstore = LanceDBVectorStore.from_documents(
            docs,
            embeddings,
            connection=db,
            table_name=table_name
        )
        logger.info(f"Indexed {len(docs)} documents into LanceDB table: {table_name}")
        return vectorstore
    except Exception as e:
        logger.error(f"Failed to index documents in LanceDB: {e}")
        raise

def main(docs_dir: str = "src/doc") -> None:
    """Main pipeline to process PDFs and index into LanceDB."""
    try:
        logger.info("Starting Docling-LanceDB pipeline")
        load_dotenv()
        embeddings = get_embeddings()
        chunks = load_pdfs_with_docling(docs_dir)
        index_with_lancedb(chunks, embeddings, overwrite=True)
        logger.info("Pipeline completed successfully")
    except Exception as e:
        logger.error(f"Pipeline failed: {e}")
        raise

if __name__ == "__main__":
    main()