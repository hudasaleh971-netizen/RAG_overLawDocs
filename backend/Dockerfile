# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Install uv and git
RUN apt-get update && apt-get install -y git && pip install uv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies from lockfile (removes --system flag)
RUN uv sync --frozen --no-dev

# Copy app source
COPY src/ ./src/

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]