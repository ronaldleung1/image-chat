# Image Chat

A chatbot that edits images and generates new images from text.

## Getting Started

This project requires an OpenAI API key. You can get one [here](https://platform.openai.com/account/api-keys).

Create a `.env` file in the root directory with the following content:

```bash
OPENAI_API_KEY=<your_api_key>
```

Next, install the dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

```bash
pip install -r requirements.txt
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Or, run the Next.js app and the Flask server in separate terminals:

```bash
npm run next-dev
# or
yarn next-dev
# or
pnpm next-dev
```

```bash
npm run flask-dev
# or
yarn flask-dev
# or
pnpm flask-dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The Flask server will be running on [http://127.0.0.1:5328](http://127.0.0.1:5328) – feel free to change the port in `package.json` (you'll also need to update it in `next.config.js`).
