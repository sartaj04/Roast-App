from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import openai

app = FastAPI()

# Configure OpenAI API Key
#openai.api_key = 'sk-proj-QcFy0UGdb8EFfBJaKZ2fT3BlbkFJ9zhygX0fmxTxSuXqOxFw'
client = openai.OpenAI(api_key='sk-proj-QcFy0UGdb8EFfBJaKZ2fT3BlbkFJ9zhygX0fmxTxSuXqOxFw')

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
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
