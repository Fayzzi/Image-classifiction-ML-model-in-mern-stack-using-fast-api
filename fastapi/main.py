from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import joblib
import cv2
import numpy as np

app = FastAPI()

# Middleware for handling CORS requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the pickle model
model = joblib.load("./model/image_classification.joblib")

# Define your updated label dictionary
label_dict = {
    0: 'Sunflower',
    1: 'Rugby Ball',
    2: 'Ice cream',
}

@app.get('/')
async def root():
    return {'example': "This is a simple example", 'data': 0}

@app.post("/predict")
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Resize the image to (150, 150) and flatten
        resized_image = cv2.resize(image, (150, 150))
        flattened_image = resized_image.flatten()

        # Make predictions using the loaded model
        predictions = model.predict([flattened_image])
        predicted_class = predictions[0]
        class_label = label_dict[predicted_class]

        return JSONResponse(content={"message": "File uploaded successfully", "predicted_class": class_label})
    except Exception as e:
        return JSONResponse(content={"message": "Error processing the file", "error": str(e)})
