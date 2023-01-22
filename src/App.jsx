import { useState } from "react";
const { VITE_OPENAI_EMAIL, VITE_OPENAI_PASSWORD } = import.meta.env;

function App() {
  async function example() {
    // use puppeteer to bypass cloudflare (headful because of captchas)
    const api = new ChatGPTAPIBrowser({
      email: process.env.OPENAI_EMAIL,
      password: process.env.OPENAI_PASSWORD,
    });

    await api.initSession();

    const result = await api.sendMessage("Hello World!");
    console.log(result.response);
  }

  return <div className="App">{VITE_TEST}</div>;
}

export default App;
