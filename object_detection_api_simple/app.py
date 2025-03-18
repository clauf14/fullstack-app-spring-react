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
import math
import re

app = FastAPI()
categories_subcategories_list = [
    ("Cars", 1, "Vehicles", 1),
    ("Bikes", 2, "Vehicles", 1),
    ("Bicycle", 3, "Vehicles", 1),
    ("Apartment", 4, "Real Estate", 2),
    ("House", 5, "Real Estate", 2),
    ("Lands", 6, "Real Estate", 2),
    ("Phone", 7, "Electronics and Appliances", 3),
    ("Appliances", 8, "Electronics and Appliances", 3),
    ("TV", 9, "Electronics and Appliances", 3),
    ("Laptop-Desktop", 10, "Electronics and Appliances", 3),
    ("Women clothes", 11, "Clothes", 4),
    ("Men clothes", 12, "Clothes", 4),
    ("Accessories", 13, "Clothes", 4),
    ("Shoes", 14, "Clothes", 4),
    ("Internal engine parts", 16, "Auto Parts", 5),
    ("Exterior parts", 17, "Auto Parts", 5),
    ("Interior parts", 18, "Auto Parts", 5),
    ("Furniture", 19, "Home and Garden", 6),
    ("Decorations", 20, "Home and Garden", 6),
    ("Garden", 21, "Home and Garden", 6),
    ("Kitchen Tools", 40, "Home and Garden", 6),
    ("Football", 22, "Sports, Art", 7),
    ("Basketball", 23, "Sports, Art", 7),
    ("Tenis", 24, "Sports, Art", 7),
    ("Box", 25, "Sports, Art", 7),
    ("Books", 26, "Sports, Art", 7),
    ("Art - Collection Objects", 27, "Sports, Art", 7),
    ("Dogs", 28, "Animals", 8),
    ("Cats", 29, "Animals", 8),
    ("Food for animals", 30, "Animals", 8),
    ("Agricultural machinery", 31, "Agriculture and Industrial", 9),
    ("Cereals - Plants - Trees", 32, "Agriculture and Industrial", 9),
    ("Transport", 33, "Services", 10),
    ("Skilled Workers", 34, "Services", 10),
    ("Cleaning Services", 35, "Services", 10),
    ("Courses - Learning Services", 36, "Services", 10),
    ("Medical Services", 37, "Services", 10),
    ("Fruits", 38, "Food", 11),
    ("Vegetables", 39, "Food", 11)
]

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


def extract_objects_from_yolo_output(yolo_output: str):
    pattern = r"(\d+) ([a-zA-Z ]+)"
    matches = re.findall(pattern, yolo_output)

    objects = {obj.strip(): int(count) for count, obj in matches if
               obj.strip().lower() not in ["ms", "speed", "preprocess", "inference", "postprocess", "per", "image",
                                           "at", "shape"]}

    return objects


def predict_image(image: Image.Image):
    results = model.predict(image)
    detected_objects_str = results[0].verbose()
    detected_objects = []
    best_detection = None
    best_score = -float("inf")  # Initialize with a very low score

    image_center_x, image_center_y = image.width // 2, image.height // 2

    for result in results:
        for box in result.boxes:
            x_min, y_min, x_max, y_max = map(int, box.xyxy[0].tolist())
            width, height = x_max - x_min, y_max - y_min
            area = width * height
            center_x, center_y = (x_min + x_max) // 2, (y_min + y_max) // 2

            # Calculate Euclidean distance from the center of the image
            distance_to_center = math.sqrt((center_x - image_center_x) ** 2 + (center_y - image_center_y) ** 2)

            # Confidence score of detection
            confidence = float(box.conf)

            # Extract dominant color from the detected object's region
            crop_width = max(width // 9, 1)
            crop_height = max(height // 9, 1)
            crop_x_min = max(center_x - crop_width // 2, 0)
            crop_y_min = max(center_y - crop_height // 2, 0)
            crop_x_max = min(center_x + crop_width // 2, image.width)
            crop_y_max = min(center_y + crop_height // 2, image.height)
            cropped_region = image.crop((crop_x_min, crop_y_min, crop_x_max, crop_y_max))
            dominant_color = get_dominant_color(cropped_region)

            # Create an object dictionary
            obj_data = {
                "class": model.names[int(box.cls)],
                "confidence": confidence,
                "bbox": [x_min, y_min, x_max, y_max],
                "area": area,
                "distance_to_center": distance_to_center,
                "color": dominant_color,
                "detected_objects_str": detected_objects_str
            }
            detected_objects.append(obj_data)

            # Compute a score for ranking objects
            # Higher area = better, lower distance to center = better, higher confidence = better
            score = (area / (image.width * image.height)) * 2 - (
                        distance_to_center / max(image.width, image.height)) * 3 + confidence * 4

            # Select the best object based on the score
            if score > best_score:
                best_score = score
                best_detection = obj_data

    return {
        "best_object": best_detection,  # The most relevant object considering area, confidence, and center proximity
        "all_objects": detected_objects,
        "detected_objects_str": detected_objects_str
    }


def generate_description(object_data, status, price, currency, location, language, generating_style, file_name, detected_objects_str, categories_subcategories_list):
    if not object_data:
        return "No object detected in the image."

    class_name = object_data["class"]
    color = object_data["color"]

    prompt = (
        f"""
        You are the ads manager at ReTrove Market, an online second-hand store, where you will be generating a catchy description and a title in {language}, using a {generating_style} communication style, based on product details following strictly the instructions below.
        !ALWAYS YOU HAVE TO INCLUDE THE CATEGORY AND SUBCATEGORY NAME AND ID - add the fields as category_name and category_id and so on!
        Instructions:
        Return the description and the title in a JSON Object without formatting, only the plain JSON object.
        MUST include the COLOR, but not add the RGB code in the description.
        ONLY IF DETECTED OBJECTS ARE MULTIPLE VALUE keep in mind that you have to categorize as a set or a whole (ex: 2 apples, say there are 2 apples or a set of 2 apples). from here: {detected_objects_str}.
        (Optional)Use the file name to help correct the generated class name: {file_name}
        Add a - and a whitespace at the beginning of the description and title, only one, and one ® at the end of both.
        Add emoji's to make a colorful text.
        
        
        MUST Select the appropriate subcategory and category based on the object class - {class_name} - from the following list:
        The format of the list is the following: (subcategory_name, subcategory_id, category_name, category_id) - you should map the field found to the appropriate subcategory and category and ids.
        {categories_subcategories_list}
                
        
        Generate a unique and engaging description that has to be between 150-250 words, along with a catchy title based on the following product details:

        Class Name: {class_name}
        Color: {color}
        Status: {status}
        Price: {price}
        Currency: {currency}
        Location of the product: {location}
        """
    )

    try:
        completion = client.chat.completions.create(
            model="gpt-4o",
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
        best_object = detection_result["best_object"]
        detected_objects_str = detection_result["detected_objects_str"]
        file_name = f.filename
        content = generate_description(best_object, status, price, currency, location, language, generating_style, file_name, detected_objects_str, categories_subcategories_list)

        results.append({
            "filename": f.filename,
            "status": status,
            "price": price,
            "currency": currency,
            "location": location,
            "all_detections": detection_result["all_objects"],
            "detection": best_object,
            "language": language,
            "generating_style": generating_style,
            "title": content.get("title", "No title available"),
            "description": content.get("description", "No description available"),
            "subcategory_name": content.get("subcategory_name", "No subcategory available"),
            "subcategory_id": content.get("subcategory_id", "No subcategory id available"),
            "category_name": content.get("category_name", "No category name available"),
            "category_id": content.get("category_id", "No category id available"),
            "detected_objects_str" : detected_objects_str
        })

    return {"results": results} if len(results) > 1 else results[0]
