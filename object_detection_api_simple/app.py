import openai
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import io
from PIL import Image
import numpy as np
import cv2
from ultralytics import YOLO
from openai import OpenAI
import json
import os
from dotenv import load_dotenv

app = FastAPI()

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load YOLOv11 model
model = YOLO("my_model.pt")

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize OpenAI client
client = OpenAI(
  api_key=OPENAI_API_KEY
)


def get_dominant_color(image: Image.Image):
    image = np.array(image)
    if len(image.shape) == 2:
        return (0, 0, 0)
    image = cv2.resize(image, (50, 50), interpolation=cv2.INTER_AREA)
    pixels = image.reshape(-1, 3)
    avg_color = np.mean(pixels, axis=0)
    return tuple(map(int, avg_color))


def predict_image(image: Image.Image):
    results = model.predict(image)
    detected_objects = []
    largest_detection = None
    max_area = 0

    for result in results:
        for box in result.boxes:
            x_min, y_min, x_max, y_max = map(int, box.xyxy[0].tolist())
            width, height = x_max - x_min, y_max - y_min
            area = width * height
            center_x, center_y = (x_min + x_max) // 2, (y_min + y_max) // 2
            crop_width = max(width // 9, 1)
            crop_height = max(height // 9, 1)
            crop_x_min = max(center_x - crop_width // 2, 0)
            crop_y_min = max(center_y - crop_height // 2, 0)
            crop_x_max = min(center_x + crop_width // 2, image.width)
            crop_y_max = min(center_y + crop_height // 2, image.height)
            cropped_region = image.crop((crop_x_min, crop_y_min, crop_x_max, crop_y_max))
            dominant_color = get_dominant_color(cropped_region)
            obj_data = {
                "class": model.names[int(box.cls)],
                "confidence": float(box.conf),
                "bbox": [x_min, y_min, x_max, y_max],
                "color": dominant_color
            }
            detected_objects.append(obj_data)
            if area > max_area:
                max_area = area
                largest_detection = obj_data

    return {
        "largest_object": largest_detection,
        "all_objects": detected_objects
    }


def generate_description(object_data, status, price, currency, location, language, generating_style):
    if not object_data:
        return "No object detected in the image."

    class_name = object_data["class"]
    color = object_data["color"]

    prompt = (
        f"""
        You are the ads manager at ReTrove Market, an online second-hand store, where you will be generating a catchy description and a title in {language}, using a {generating_style} communication style, based on product details following strictly the instructions below.
        
        Instructions:
        Return the description and the title in a JSON Object without formatting, only the plain JSON object.
        MUST include the COLOR, but not add the RGB code in the description.
        Generate a unique and engaging description that has to be between 100-200 words, along with a catchy title based on the following product details, add also emoji's in description for more color to the text:

        Class Name: {class_name}
        Color: {color}
        Status: {status}
        Price: {price}
        Currency: {currency}
        Location: {location}
        """
    )

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            store=True,
            messages=[{"role": "user", "content": prompt}]
        )

        response_text = completion.choices[0].message.content

        # Ensure the response is properly parsed as JSON
        return json.loads(response_text)

    except (openai.OpenAIError, json.JSONDecodeError) as e:
        return {"title": "Error", "description": str(e)}


@app.post("/predict/")
async def predict(
        file: List[UploadFile] = File(...),
        status: str = Form(...),
        price: float = Form(...),
        currency: str = Form(...),
        location: str = Form(...),
        language: str = Form(...),
        generating_style: str = Form(...),
):
    results = []
    for f in file:
        image = Image.open(io.BytesIO(await f.read())).convert("RGB")
        detection_result = predict_image(image)
        largest_object = detection_result["largest_object"]
        content = generate_description(largest_object, status, price, currency, location, language, generating_style)

        results.append({
            "filename": f.filename,
            "status": status,
            "price": price,
            "currency": currency,
            "location": location,
            "detection": largest_object,
            "title": content.get("title", "No title available"),
            "description": content.get("description", "No description available")
        })

    return {"results": results} if len(results) > 1 else results[0]
