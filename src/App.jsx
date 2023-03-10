import { useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import styled from "styled-components";
const { VITE_OPENAI_API_KEY } = import.meta.env;
const configuration = new Configuration({
  organization: "org-9JBEVqJjH8HwHXngMVcz1NWX",
  apiKey: VITE_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const ChatGptComponent = styled.div`
  padding: 20px;
  .input {
    width: 100%;
    min-height: 200px;
  }
  .btn_box {
    margin-top: 10px;
    display: flex;
    width: 100%;
    button {
      &:nth-child(1) {
        margin-right: 10px;
      }
      flex: 1;
      height: 36px;
    }
  }
  .result {
    margin-top: 10px;
    border: 1px solid #ddd;
    padding: 10px;
    li {
      margin-bottom: 30px;
    }
  }
`;

function App() {
  const [maxLength, setmaxLength] = useState(3700);
  const onChangeMax = (e) => {
    setmaxLength(e.target.value);
  };

  const [titleText, setTitleText] = useState();
  const [resTitle, setResTitle] = useState();
  const onChangeTitle = (e) => {
    setTitleText(e.target.value);
  };
  const onTitle = () => {
    let res = titleText.split("\n");
    console.log(res);
  };
  const [requestText, setRequestText] = useState();
  const onChangeReq = (e) => {
    setRequestText(e.target.value);
  };
  const saveAsFile = (str, filename) => {
    let fileName = `${filename}.txt`;
    let output = str;
    const element = document.createElement("a");
    const file = new Blob([output], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element); // FireFox
    element.click();
  };
  const [resultList, setResultList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getResponse = async () => {
    let leng = maxLength > 3900 ? 3900 : parseInt(maxLength);
    setIsLoading(true);
    let summary = requestText.split("\n");
    const promiseList = await summary.map(async (el) => {
      const list = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Write a blog post on the topic of ${el} in html format, including subheadings. Write at least 2500 words. Select a word from each subheading and use the unsplash api to insert an image of that word after the subheading.`,
        temperature: 0.9,
        max_tokens: leng,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: [" Human:", " AI:"],
      });
      let result = list.data.choices[0].text;
      saveAsFile(result, el);
      return result;
    });
    const allList = await Promise.all(promiseList);
    setResultList(allList);
    setIsLoading(false);
  };

  const onClear = () => {
    setResultList([]);
  };
  const getList = () => {
    console.log(resultList);
  };
  return (
    <ChatGptComponent className="App">
      {/* <textarea
        className="input"
        value={titleText}
        onChange={onChangeTitle}
      ></textarea>
      <div className="btn_box">
        <button className="btn_clear" type="button" onClick={onTitle}>
          ?????? ????????? ?????????
        </button>
      </div>
      <div>{resTitle && resTitle}</div> */}
      <textarea
        className="input"
        value={requestText}
        onChange={onChangeReq}
      ></textarea>
      <div className="option_box">
        ?????? ?????? ??? :{" "}
        <input type="number" value={maxLength} onChange={onChangeMax} />
        (0~3900)
      </div>
      <div className="btn_box">
        <button className="btn_clear" type="button" onClick={onClear}>
          clear
        </button>
        <button className="btn_submit" type="button" onClick={getResponse}>
          submit
        </button>
        <button className="btn_submit" type="button" onClick={getList}>
          list
        </button>
      </div>
      {isLoading ? (
        <>loading....</>
      ) : (
        <>
          new
          <ul className="result">
            {resultList &&
              resultList.map((el, idx) => (
                <li key={idx} dangerouslySetInnerHTML={{ __html: el }}></li>
              ))}
          </ul>
        </>
      )}
    </ChatGptComponent>
  );
}

export default App;
