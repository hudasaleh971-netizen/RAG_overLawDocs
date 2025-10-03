from huggingface_hub import login
from langchain.agents import AgentExecutor, create_react_agent
from langchain.memory import ConversationSummaryMemory
from langchain.tools import Tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.vectorstores import LanceDB
from langchain_huggingface import HuggingFaceEmbeddings
import lancedb
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
from src.scripts.logging import setup_logger, logger
import os
load_dotenv()
setup_logger(log_file="agent_chat.log")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
HUGGING_FACE_TOKEN = os.getenv("HUGGING_FACE_TOKEN")

# Login to Hugging Face
if HUGGING_FACE_TOKEN:
    login(token=HUGGING_FACE_TOKEN)

# Embeddings and Vector Store Setup
# Download the model from the  Hub. Also specify to use the "query" and "document" prompts
# as defined in the model configuration, as LangChain doesn't automatically use them.
# See https://huggingface.co/google/embeddinggemma-300m/blob/main/config_sentence_transformers.json
# all huggingface login

embeddings = HuggingFaceEmbeddings(
    model_name="google/embeddinggemma-300m",
    query_encode_kwargs={"prompt_name": "query"},
    encode_kwargs={"prompt_name": "document"}
)
db_uri = "src/lancedb"
db = lancedb.connect(db_uri)
table_name = "documents"
vectorstore = LanceDB(connection=db, table_name=table_name, embedding=embeddings)


# Retriever Tool
def retrieve_docs(query: str) -> str:
    logger.info(f"Retrieving documents for query: {query}")
    results = vectorstore.similarity_search(query, k=5)
    if not results:
        logger.warning("No relevant documents found.")
        return "No relevant documents found."
    
    formatted_results = "\n\n".join(
        f"From {doc.metadata.get('filename', 'Unknown')}, Section: {doc.metadata.get('headings', 'No heading')}:\n{doc.page_content}"
        for doc in results
    )
    logger.info(f"Retrieved {len(results)} documents.")
    return formatted_results

retriever_tool = Tool(
    name="retrieve_docs",
    func=retrieve_docs,
    description="Retrieve and evaluate documents from the knowledge base. Input: query string."
)

# LLM and Agent Setup
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0,
    api_key=GOOGLE_API_KEY
)
memory = ConversationSummaryMemory(llm=llm, memory_key="chat_history", input_key="input")
# Load from a text file
prompt = PromptTemplate.from_file(
    "src/prompts/agent_prompt.txt",
    input_variables=["tools", "tool_names", "chat_history", "input", "agent_scratchpad"]
)

tools = [retriever_tool]
agent = create_react_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, memory=memory, verbose=True, handle_parsing_errors=True)

# Chat Function
def chat_with_agent(query: str) -> str:
    logger.info(f"Received query: {query}")
    response = agent_executor.invoke({"input": query})
    logger.info(f"Generated response: {response['output']}")
    return response["output"]
