from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(dotenv_path="../.env")
client = OpenAI()


def generate_image(prompt):
    try:
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            n=1,
            size="1024x1024",
            response_format="url",
        )
        return response.data[0].url
    except Exception as e:
        return str(e)
