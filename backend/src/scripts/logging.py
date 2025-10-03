# backend/core/logging.py

from loguru import logger
import os
from pathlib import Path

LOG_DIR = Path("backend/logs")
LOG_DIR.mkdir(parents=True, exist_ok=True)

def setup_logger(log_file: str = "docling_pipeline.log") -> None:
    logger.remove()  # Clear default handler
    logger.add(
        LOG_DIR / log_file,
        rotation="10 MB",
        level="INFO",
        enqueue=True  # Better for multi-threaded or async apps
    )
    logger.add(lambda msg: print(msg, end=""), level="INFO")
