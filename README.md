# [Chat Baker](https://chat-baker.com)

Type in any URL to bake a personal chatbot!

https://user-images.githubusercontent.com/29723695/225512660-53d449dd-adce-4c92-a6a5-9dbe06f2f6ac.mov

## How it works

It uses Embeddings and ChatGPT API provided by [OpenAI](https://platform.openai.com/docs/models/gpt-3). First, it loads and converts the data from the source url to text using custom HTML parser. Then, it uses Embedings to index the text data and stores the results locally. Finally, when it takes an input from user, it queries that input from the previously made embeddings index to find the most relevant context, then sends the user input along with the context over the ChatGPT API.



## Running Locally

### Cloning the repository the local machine.

```bash
git clone
```

### Creating a account on OpenAI to get an API key.

1. Go to [OpenAI](https://openai.com/api/) to make an account.
2. Click on your profile picture in the top right corner, and click on "View API Keys".
3. Click on "Create new secret key". Copy the secret key.

### Storing API key in .env file.

Create a file in root directory of project with env. And store your API key in it, as shown in the .example.env file.

### Installing the dependencies.

```bash
yarn install
```

### Running the application.

Then, run the application in the command line and it will be available at `http://localhost:3000`.

```bash
yarn dev
```
