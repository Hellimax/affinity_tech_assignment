# main.py
from math import ceil
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
import uvicorn
from typing import List, Optional, Dict, Any

import os

from fastapi import FastAPI, Query, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, JSONResponse

from firebaseOps import DB, COLLECTION_NAME, _apply_filters, _count_query, _sanitize
from pineconeOps import search_similar
from fastapi import Body
from pydantic import BaseModel, Field
load_dotenv()  


# ---------------------------
# App
# ---------------------------
app = FastAPI(
    title="E-Commerce Catalog API",
    version="1.0.0",
    description="""API to fetch catalog data from Firestore with server-side pagination (9 per page)
and simple equality filters (gender, masterCategory, subCategory, articleType, baseColour, season, year, usage).
Use the `pages` array to render number buttons in your UI.""",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten for prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Product(BaseModel):
    # Keep this permissive; your schema can be stricter if you wish
    id: str
    gender: Optional[str] = ""
    masterCategory: Optional[str] = ""
    subCategory: Optional[str] = ""
    articleType: Optional[str] = ""
    baseColour: Optional[str] = ""
    season: Optional[str] = ""
    year: Optional[int] = None
    usage: Optional[str] = ""
    productDisplayName: Optional[str] = ""
    imageURL: Optional[str] = Field(default="", alias="image")  # adapt to your column if different

    class Config:
        validate_by_name = True
        extra = "allow"  # allow extra fields if present


class PageResponse(BaseModel):
    page: int
    page_size: int
    total_count: int
    total_pages: int
    pages: List[int]
    items: List[Dict[str, Any]]
# ---------------------------
# Routes
# ---------------------------

@app.get("/")
async def root():
    return RedirectResponse(url="/docs")  

@app.get(
    "/products",
    response_model=PageResponse,
    tags=["Catalog"],
)
def list_products(
    page: int = Query(1, ge=1, description="1-based page number"),
    page_size: int = Query(int(os.getenv("DEFAULT_PAGE_SIZE")), ge=1, le=100, description=f"Defaults to {os.getenv("DEFAULT_PAGE_SIZE")}; UI shows {os.getenv("DEFAULT_PAGE_SIZE")} per page"),
    gender: Optional[str] = Query(None),
    masterCategory: Optional[str] = Query(None),
    subCategory: Optional[str] = Query(None),
    articleType: Optional[str] = Query(None),
    baseColour: Optional[str] = Query(None),
    season: Optional[str] = Query(None),
    year: Optional[int] = Query(None, description="Full year, e.g., 2017"),
    usage: Optional[str] = Query(None),
):

    col = DB.collection(COLLECTION_NAME)

    # Build base query with filters
    q = _apply_filters(
        col,
        gender=gender,
        masterCategory=masterCategory,
        subCategory=subCategory,
        articleType=articleType,
        baseColour=baseColour,
        season=season,
        year=year,
        usage=usage,
    )

    # Count total with same filters
    total_count = _count_query(q)
    total_pages = max(1, ceil(total_count / page_size)) if total_count else 1
    page = min(page, total_pages) if total_count else 1
    pages_list = list(range(1, total_pages + 1)) if total_count else [1]

    # Page slice
    offset = (page - 1) * page_size
    docs = q.offset(offset).limit(page_size).stream()
    items = [_sanitize({**d.to_dict(), "id": d.id if "id" not in d.to_dict() else d.to_dict()["id"]}) for d in docs]

    return PageResponse(
        page=page,
        page_size=page_size,
        total_count=total_count,
        total_pages=total_pages,
        pages=pages_list,
        items=items,
    )


@app.get(
    "/products/{doc_id}",
    response_model=Product,
    summary="Get a single product by document ID",
    tags=["Catalog"],
)
def get_product(doc_id: str):
    doc = DB.collection(COLLECTION_NAME).document(str(doc_id)).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Product not found")
    return _sanitize({**doc.to_dict(), "id": doc.id})


def get_products_for_multiple_ids(doc_ids: List[str]) -> List[Dict[str, Any]]:
    """
    Fetch multiple products by their document IDs in a single Firestore request.
    Returns a list of sanitized product dictionaries.
    """
    doc_refs = [DB.collection(COLLECTION_NAME).document(str(doc_id)) for doc_id in doc_ids]
    docs = DB.get_all(doc_refs)

    # # Validate: Ensure no missing documents
    # missing = [doc.id for doc in docs if not doc.exists]
    # if missing:
    #     raise HTTPException(
    #         status_code=404,
    #         detail=f"Products not found for IDs: {', '.join(missing)}"
    #     )

    # Process all valid docs using list comprehension
    return [_sanitize({**doc.to_dict(), "id": doc.id}) for doc in docs]


@app.post("/getSimilarImages")
async def get_similar_images(file: UploadFile = File(...)):
    """
    Endpoint to upload an image and return its filename.
    """
    results = search_similar(file.file)
    file_ids = [match['id'] for match in results]
    similar_products = get_products_for_multiple_ids(file_ids)
    return JSONResponse(content={"items": similar_products})

@app.post("/getrecommendations")
async def getrecommendations(product: Product = Body(...)):
    """
    Endpoint to upload an image and return its filename.
    """
    file_path = os.getenv("FILE_PATH_PREFIX") + product.id + ".jpg"
    results = search_similar(file_path)
    file_ids = [match['id'] for match in results]
    file_ids = [x for x in file_ids if x != product.id] # Exclude the input product itself
    similar_products = get_products_for_multiple_ids(file_ids)

    # Applying filters on Recommendataions
    similar_products = [x for x in similar_products if x["masterCategory"]==product.masterCategory and x["subCategory"]==product.subCategory]
    return JSONResponse(content={"items": similar_products})


# Run: uvicorn main:app --reload --port 8000

if __name__ == "__main__":
    uvicorn.run(
            "app:app",
            host="localhost",
            port=8000,
            log_level="debug",
            reload=True,
        )