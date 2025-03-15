"use client";

import { Download, Folder, Play, PlaySquare, Upload, ZoomIn } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const languages = [
  "javascript",
  "typescript",
  "python",
  "java",
  "c",
  "cpp",
  "node",
  "html",
];


const languageExtensions: any = {
  javascript: "js",
  typescript: "ts",
  python: "py",
  java: "java",
  c: "c",
  cpp: "cpp",
  node: "js",
  html: "html",
};

export default function Editor() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Code en " + language);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("code");

  const customConsoleLog = (...args: any[]) => {
    setOutput((prevOutput) => prevOutput + "\n" + args.join(" "));
  };

  const executeCode = async () => {
    setIsLoading(true);
    setOutput("");

    try {
      const response = await fetch("http://localhost:3000/api/runcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          code,
        }),
      });

      const result = await response.json();
      setOutput(result.output || "Erreur dans l'exécution du code.");


      if (language === "html") {
        const newWindow = window.open();
        newWindow?.document.write(result.output);
        newWindow?.document.close();
      }

    } catch (error) {
      setOutput("Erreur de communication avec le serveur.");
    } finally {
      setIsLoading(false);
    }
  };


  const downloadFile = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");


    const extension = languageExtensions[language] || "txt";
    link.href = url;
    link.download = `${fileName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleRename = () => {
    const newName = prompt("Entrez un nouveau nom pour le fichier:", fileName);
    if (newName && newName.trim() !== "") {
      setFileName(newName.trim());
    }
  };

  return (
    <div className="w-full" style={{ height: "100vh" }}>
      <div className="flex justify-between items-center">
        <select
          className=" p-2 rounded bg-blue-900 text-white"
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            setCode("");
          }}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>

        <button
          className="p-1 rounded bg-blue-600 text-white"
          onClick={handleRename}
        >
          Renommer
        </button>
      </div>

      <MonacoEditor
        height="60%"
        language={language}
        value={code}
        onChange={(newValue: any) => setCode(newValue)}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />
      <div className="p-1 bg-blue-800 flex gap-5 justify-between items-center">
        <button 
          className=" p-2 px-6 border-none text-xs rounded rounded-b-none bg-blue-500 text-white"
          onClick={executeCode}
          disabled={isLoading}
        >
          {isLoading ? "Exécution..." : <div className="flex  justify-center items-center"><Play size={15}></Play>Exécuter</div>}
        </button>
       
        <button
          className="  p-2 px-6 border-none text-xs rounded rounded-b-none flex justify-center items-center  bg-blue-500 text-white ml-2"
          onClick={downloadFile}
        >
          <Download size={15}></Download>
          Télécharger
        </button>
        <button
          className="  p-2 px-6 border-none text-xs rounded rounded-b-none flex justify-center items-center  bg-blue-500 text-white ml-2"
          onClick={downloadFile}
        >
          <Folder size={15}></Folder>
          charger un fichier
        </button>
        <button
          className="  p-2 px-6 border-none text-xs rounded rounded-b-none flex justify-center items-center  bg-blue-500 text-white ml-2"
          onClick={downloadFile}
        >
          <ZoomIn size={15}></ZoomIn>
          Zoomer
        </button>
      </div>
      {language !== "html" && (
        <div className="mt-1 p-4 w-full h-40 overflow-y-scroll bg-slate-950 text-white">
          <h3>Resultat :</h3>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
}
