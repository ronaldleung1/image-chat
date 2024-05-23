from dotenv import load_dotenv
from openai import OpenAI


from PIL import Image
import io

load_dotenv(dotenv_path="../.env")
client = OpenAI()


def generate_image(prompt):
    try:
        response = client.images.generate(
            model="dall-e-2",
            prompt=prompt,
            n=1,
            size="1024x1024",
            response_format="url",
        )
        return response.data[0].url
    except Exception as e:
        return str(e)


def make_image_square(image):
    width, height = image.size
    new_size = max(width, height)
    new_image = Image.new("RGBA", (new_size, new_size), (255, 255, 255, 0))
    new_image.paste(image, ((new_size - width) // 2, (new_size - height) // 2))
    return new_image


def create_mask(image):
    width, height = image.size
    mask = Image.new("RGBA", (width, height), (0, 0, 0, 255))  # Fully opaque black mask
    transparent_square = Image.new(
        "RGBA", (width // 2, height // 2), (0, 0, 0, 0)
    )  # Fully transparent square
    mask.paste(
        transparent_square, (width // 4, height // 4)
    )  # Paste the transparent square onto the mask
    return mask


def edit_image(prompt, image_file):
    try:
        image = Image.open(image_file)
        square_image = make_image_square(image)
        mask = create_mask(square_image)

        image_byte_arr = io.BytesIO()
        square_image.save(image_byte_arr, format="PNG")
        image_byte_arr = image_byte_arr.getvalue()

        mask_byte_arr = io.BytesIO()
        mask.save(mask_byte_arr, format="PNG")
        mask_byte_arr = mask_byte_arr.getvalue()

        response = client.images.edit(
            prompt=prompt,
            image=image_byte_arr,
            mask=mask_byte_arr,
            n=1,
            size="1024x1024",
        )

        return response.data[0].url
    except Exception as e:
        return str(e)
