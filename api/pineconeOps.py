import clip
import torch
from PIL import Image
import os
from dotenv import load_dotenv
from pinecone import Pinecone




load_dotenv()

pinecone_client = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pinecone_client.Index(os.getenv("PINECONE_INDEX_NAME"))

device = "cuda" if torch.cuda.is_available() else "cpu"
model, preprocess = clip.load('ViT-B/32', device)


def search_similar(input_image):

    top_k = int(os.getenv("PINECONE_TOP_K"))
    # Process query image using the same preprocess function
    image = preprocess(Image.open(input_image)).unsqueeze(0).to(device)
    
    with torch.no_grad():
        query_features = model.encode_image(image).cpu().numpy()
    
    # Search in Pinecone with include_metadata=True
    results = index.query(
        vector=query_features.flatten().tolist(), 
        top_k=top_k,
        include_metadata=True  # This ensures metadata is returned
    )
    return results["matches"]  # Return only the matches list