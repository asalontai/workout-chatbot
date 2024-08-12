from flask import Flask, request, Response
from flask_cors import CORS
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_pinecone import PineconeVectorStore
from langchain.embeddings import OpenAIEmbeddings
from dotenv import load_dotenv
from pinecone import Pinecone
from openai import OpenAI
import os
import tiktoken
import re

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

load_dotenv()

pinecone_api_key = os.getenv('PINECONE_API_KEY')
openai_api_key = os.getenv('OPENAI_API_KEY')

primer = f"""
You are a knowledgeable fitness assistant specializing in workout routines, diet plans, and healthy food choices. Your role is to provide users with personalized advice based on their fitness goals, dietary preferences, and lifestyle.

1. You can suggest workout routines for various fitness levels, including strength training, cardio, flexibility exercises, and recovery strategies.

2. You can recommend certain exercises based on different muscles or muscles groups

3. You can explain how to do a certain exercise based on the exercise

4. You offer dietary guidance tailored to different goals, such as muscle gain, fat loss, or general wellness.

5. You can recommend specific foods, meal plans, and recipes that align with the user's nutritional needs, whether they are vegan, vegetarian, or follow a specific diet like keto or paleo.

6. If asked about supplements, provide general information and suggest consulting with a healthcare professional before starting any new supplement regimen.

7. Always encourage balanced and sustainable approaches to fitness and diet, avoiding extreme or potentially harmful recommendations.

8. Ensure that your advice respects the user's preferences, cultural considerations, and any dietary restrictions or allergies.

9. If you're unsure about any information, it's okay to say you don't know and offer to help the user find a reliable source.

10. Your goal is to help users achieve their fitness goals in a healthy and sustainable way, offering practical and actionable advice.

11. Format your response in a way where each thing is on a different line since your messages will be brodcasted on frontend.

12. Make sure after every sentence has a \n after its done.
"""

@app.route("/api/generate", methods=['POST'])
def generate():
    embeddings = OpenAIEmbeddings()
    embed_model = "text-embedding-3-small"
    openai_client = OpenAI()

    data = request.json
    if not data or not isinstance(data, list):
        return {"error": "Invalid input"}, 400
    
    print(data)

    data = data[len(data) - 1]

    query = data["content"]
    
    print(query)
    
    loader = PyPDFLoader("./content/WorkoutPDF.pdf")
    documents = loader.load()

    tokenizer = tiktoken.get_encoding('p50k_base')

    def tiktoken_len(text):
        tokens = tokenizer.encode(text, disallowed_special=())
        return len(tokens)

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=2000,
        chunk_overlap=100,
        length_function=tiktoken_len,
        separators=["\n\n", "\n", " ", ""]
    )

    texts = text_splitter.split_documents(documents)

    index_name = "chat-app"
    namespace = "pdf-data"

    vectorstore_from_texts = PineconeVectorStore.from_texts(
        [
            f"Source: {t.metadata.get('source', 'Unknown Source')}, Title: {t.metadata.get('title', 'Untitled')} \n\nContent: {t.page_content}"
            for t in texts
        ],
        embeddings,
        index_name=index_name,
        namespace=namespace
    )

    pc = Pinecone(api_key=pinecone_api_key)
    pinecone_index = pc.Index(index_name)

    raw_query_embedding = openai_client.embeddings.create(
        input=[query],
        model=embed_model
    )

    query_embedding = raw_query_embedding.data[0].embedding

    top_matches = pinecone_index.query(vector=query_embedding, top_k=10, include_metadata=True, namespace=namespace)

    contexts = [item['metadata']['text'] for item in top_matches['matches']]

    augmented_query = "<CONTEXT>\n" + "\n\n-------\n\n".join(contexts[:10]) + "\n-------\n</CONTEXT>\n\n\n\nMY QUESTION:\n" + query

    def generate_stream():
        response_stream = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": primer},
                {"role": "user", "content": augmented_query}
            ],
            stream=True
        )
        
        def decode_stream():
            for chunk in response_stream:
                content = chunk.choices[0].delta.content if hasattr(chunk, 'choices') else ''
                if content:
                    yield content

        return Response(decode_stream(), content_type='text/plain')

    return generate_stream()

if __name__ == '__main__':
    app.run(debug=True, port=8080)
