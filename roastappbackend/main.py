import base64

from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import openai
import requests
# from PIL import Image
# from transformers import BlipProcessor, BlipForConditionalGeneration
# import pytesseract

app = FastAPI()

# Configure OpenAI API Key
#openai.api_key = 'sk-proj-QcFy0UGdb8EFfBJaKZ2fT3BlbkFJ9zhygX0fmxTxSuXqOxFw'
client = openai.OpenAI(api_key='sk-proj-QcFy0UGdb8EFfBJaKZ2fT3BlbkFJ9zhygX0fmxTxSuXqOxFw')
api_key = "sk-proj-QcFy0UGdb8EFfBJaKZ2fT3BlbkFJ9zhygX0fmxTxSuXqOxFw"
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
# model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

# def generate_caption(image_path):
#     image = Image.open(image_path)
#     inputs = processor(image, return_tensors="pt")
#     out = model.generate(**inputs)
#     caption = processor.decode(out[0], skip_special_tokens=True)
#     return caption
#
# def extract_text_from_image(image_path):
#     image = Image.open(image_path)
#     text = pytesseract.image_to_string(image)
#     return text
@app.post("/generate-roast")
async def generate_roast(
    description: str = Form(...),
    roast_level: int = Form(...),
    language: str = Form("en"),  # Default to English if not provided
    file: UploadFile = File(None)
):
    try:
        prompt = "Create a fun, sassy roast of 250 characters for " + description
        if file:
            content = await file.read()
            prompt = f"Roast this person: {content.decode('utf-8')}"

        roast_level_text = ["a light tease", "a good ribbing", "a fiery burn", "scorching hot"]
        prompt += f" Make it {roast_level_text[roast_level]}."
        print(language)
        # Add language-specific instructions
        prompt += f" Write the roast in {language}."

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="gpt-3.5-turbo",
        )

        roast = chat_completion.choices[0].message.content.strip()

        return JSONResponse(content={"roast": roast})

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

@app.post("/generate-roast-from-image")
async def generate_roast_from_image(
    roast_level: int = Form(...),
    language: str = Form("en"),  # Default to English if not provided
    file: UploadFile = File(...)
):
    try:
        # Save the uploaded image to a temporary file
        temp_image_path = f"/tmp/{file.filename}"
        with open(temp_image_path, "wb") as f:
            f.write(await file.read())

        # Encode the image in base64
        base64_image = encode_image(temp_image_path)

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }

        roast_level_text = ["a light tease", "a good ribbing", "a fiery burn", "scorching hot"]
        prompt = f"Create a fun, sassy roast of 250 characters for this image. Make it {roast_level_text[roast_level]}. Write the roast in {language}. If it's a screenshot of conversation then write a roast to reply to last message"

        payload = {
            "model": "gpt-4o-mini",  # Hypothetical model that can handle images and text
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{base64_image}"
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 300
        }

        # Make the request to OpenAI API
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

        # Handle the API response
        if response.status_code == 200:
            roast = response.json()["choices"][0]["message"]["content"].strip()
            return JSONResponse(content={"roast": roast})
        else:
            return JSONResponse(content={"error": response.json()}, status_code=response.status_code)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
# @app.post("/generate-roast-from-image")
# async def generate_roast_from_image(
#         roast_level: int = Form(...),
#         language: str = Form("en"),  # Default to English if not provided
#         file: UploadFile = File(...)
# ):
#     try:
#         # Save the uploaded image to a temporary file
#         temp_image_path = f"/tmp/{file.filename}"
#         with open(temp_image_path, "wb") as f:
#             f.write(await file.read())
#
#         # Try to extract text from the image using OCR
#         text_from_image = extract_text_from_image(temp_image_path)
#
#         if text_from_image.strip():
#             description = text_from_image.strip()
#         else:
#             # If no text is found, generate a description using BLIP
#             description = generate_caption(temp_image_path)
#
#         prompt = f"Create a fun, sassy roast of 250 characters for {description}"
#
#         roast_level_text = ["a light tease", "a good ribbing", "a fiery burn", "scorching hot"]
#         prompt += f" Make it {roast_level_text[roast_level]}."
#
#         # Add language-specific instructions
#         prompt += f" Write the roast in {language}."
#
#         chat_completion = client.chat.completions.create(
#             messages=[
#                 {
#                     "role": "user",
#                     "content": prompt,
#                 }
#             ],
#             model="gpt-3.5-turbo",
#         )
#
#         roast = chat_completion.choices[0].message.content.strip()
#
#         return JSONResponse(content={"roast": roast})
#
#     except Exception as e:
#         return JSONResponse(content={"error": str(e)}, status_code=500)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=8003)
# @app.post("/generate-roast")
# async def generate_roast(
#     description: str = Form(...),
#     roast_level: int = Form(...),
#     file: UploadFile = File(None)
# ):
#     try:
#         prompt = "Create a fun, sassy roast of 250 characters for" + description
#         if file:
#             content = await file.read()
#             prompt = f"Roast this person: {content.decode('utf-8')}"
#
#         roast_level_text = ["a light tease", "a good ribbing", "a fiery burn", "scorching hot"]
#         prompt += f" Make it {roast_level_text[roast_level]}."
#         # prompt = "Generate a roast for" + description
#         # if file:
#         #     content = await file.read()
#         #     prompt = f"Generate a roast for the following person: {content.decode('utf-8')}"
#         #
#         # roast_level_text = ["mild", "medium", "hot", "extra hot"]
#         # prompt += f" The roast should be {roast_level_text[roast_level]}."
#
#         chat_completion = client.chat.completions.create(
#             messages=[
#                 {
#                     "role": "user",
#                     "content": prompt,
#                 }
#             ],
#             model="gpt-3.5-turbo",
#         )
#
#         # Print the response for debugging
#         print(chat_completion)
#
#         # Correctly access the response content
#         roast = chat_completion.choices[0].message.content.strip()
#         return JSONResponse(content={"roast": roast})
#
#     except Exception as e:
#         return JSONResponse(content={"error": str(e)}, status_code=500)
#
# if __name__ == '__main__':
#     import uvicorn
#     uvicorn.run(app, host='127.0.0.1', port=8003)
