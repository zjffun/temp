import "./App.css";
import { useState } from "react";
import parseURI from "./parseURI";
import { encode, decode } from "html-entities";

import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import parserHtml from "prettier/parser-html";

import YAML from "yaml";
import { CSV, TSV } from "./convert/dsv";
import XML from "./convert/xml";

import PrettierOption, { defaultOptions } from "./options/prettier-options";
import { Select } from "./options/inputs";

const convert: any = { JSON, YAML, CSV, TSV, XML };

function App() {
  const [tool, _setTool] = useState("");
  const [input, setInput] = useState("");
  const [output, _setOutput] = useState("");
  const [error, setError] = useState("");

  const [prettierOptions, setPrettierOptions] = useState(defaultOptions);
  const [convertOption, setConvertOption] = useState({
    from: "JSON",
    to: "YAML",
  });

  function setTool(tool: string) {
    _setTool(tool);
    setOutput(tool, input);
  }

  function setOutput(tool: string, input: string) {
    try {
      switch (tool) {
        case "url-encode":
          _setOutput(window.encodeURI(input));
          break;
        case "url-decode":
          _setOutput(window.decodeURI(input));
          break;
        case "url-parse":
          _setOutput(parseURI(input));
          break;
        case "html-encode":
          _setOutput(encode(input));
          break;
        case "html-decode":
          _setOutput(decode(input));
          break;
        case "base64-encode":
          _setOutput(btoa(input));
          break;
        case "base64-decode":
          _setOutput(atob(input));
          break;
        case "prettier":
          _setOutput(
            prettier.format(input, {
              ...prettierOptions,
              plugins: [parserBabel, parserHtml],
            })
          );
          break;
        case "convert":
          console.log(
            input,
            convert[convertOption.from],
            convert[convertOption.from].parse(input)
          );
debugger
          _setOutput(
            convert[convertOption.to].stringify(
              convert[convertOption.from].parse(input)
            )
          );
          break;
        default:
          break;
      }
      setError("");
    } catch (error: any) {
      _setOutput("");
      setError(error?.toString() || "unknow error");
    }
  }

  return (
    <div className="App">
      <aside>
        <ul>
          <li>
            web
            <ul>
              <li
                onClick={() => {
                  setTool("url-encode");
                }}
                className={tool === "url-encode" ? "active" : ""}
              >
                URL Encode
              </li>
              <li
                onClick={() => {
                  setTool("url-decode");
                }}
                className={tool === "url-decode" ? "active" : ""}
              >
                URL Decode
              </li>
              <li
                onClick={() => {
                  setTool("url-parse");
                }}
                className={tool === "url-parse" ? "active" : ""}
              >
                URL Parse
              </li>

              <li
                onClick={() => {
                  setTool("html-encode");
                }}
                className={tool === "html-encode" ? "active" : ""}
              >
                HTML Encode
              </li>
              <li
                onClick={() => {
                  setTool("html-decode");
                }}
                className={tool === "html-decode" ? "active" : ""}
              >
                HTML Decode
              </li>

              <li
                onClick={() => {
                  setTool("base64-encode");
                }}
                className={tool === "base64-encode" ? "active" : ""}
              >
                Base64 Encode
              </li>
              <li
                onClick={() => {
                  setTool("base64-decode");
                }}
                className={tool === "base64-decode" ? "active" : ""}
              >
                Base64 Decode
              </li>

              <li
                onClick={() => {
                  setTool("prettier");
                }}
                className={tool === "prettier" ? "active" : ""}
              >
                Prettier
              </li>
            </ul>
          </li>
          <li>
            Conversion
            <ul>
              <li
                onClick={() => {
                  setTool("convert");
                }}
                className={tool === "convert" ? "active" : ""}
              >
                Convert JSON YAML XML CSV TSV
              </li>
            </ul>
          </li>
        </ul>
      </aside>
      <main>
        <textarea
          onChange={(e) => {
            setInput(e.target.value);
            setOutput(tool, e.target.value);
          }}
          value={input}
          cols={30}
          rows={10}
        ></textarea>
        <textarea value={output} readOnly cols={30} rows={10}></textarea>
        <PrettierOption
          options={prettierOptions}
          setOptions={setPrettierOptions}
        ></PrettierOption>
        <div>
          covert option
          <Select
            label="from"
            title="from"
            values={["JSON", "YAML", "CSV", "TSV", "XML"]}
            selected={convertOption.from}
            onChange={(from: any) => {
              setConvertOption((o) => {
                return { ...o, from: from };
              });
            }}
          ></Select>
          <Select
            label="to"
            title="to"
            values={["JSON", "YAML", "CSV", "TSV", "XML"]}
            selected={convertOption.to}
            onChange={(to: any) => {
              console.log(to);
              setConvertOption((o) => {
                return { ...o, to };
              });
            }}
          ></Select>
        </div>
        <div>error: {error}</div>
      </main>
    </div>
  );
}

export default App;
