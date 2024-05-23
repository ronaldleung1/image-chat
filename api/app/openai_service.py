from dotenv import load_dotenv
from openai import OpenAI


from PIL import Image
import io

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


def edit_image(prompt, image_file):
    try:
        image = Image.open(image_file)
        byte_arr = io.BytesIO()
        image.save(byte_arr, format="PNG")  # Save the image as PNG in memory
        byte_arr = byte_arr.getvalue()

        response = client.images.edit(
            prompt=prompt, image=byte_arr, n=1, size="1024x1024"
        )

        return response.data[0].url
    except Exception as e:
        return str(e)
