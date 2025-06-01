from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os

load_dotenv()


def get_response(prompt: str, user_input: str, page_content: str, model="llama3-70b-8192"):
    full_user_input= f"Page contant:\n{page_content}\n\n User_query:\n{user_input}"
    llm=ChatGroq(model=model)

    messages= [
        ("system", f"{prompt}"),
        ("user", f"{full_user_input}")
    ]


    return llm.invoke(messages).content
