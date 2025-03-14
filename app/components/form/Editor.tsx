"use client";

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

// Map pour associer les langages avec les extensions appropriées
const languageExtensions = {
  javascript: "js",
  typescript: "ts",
  python: "py",
  java: "java",
  c: "c",
  cpp: "cpp",
  node: "js",  // Associe 'node' à '.js'
  html: "html",
};

export default function Editor() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Code en " + language);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("code");  // Nom par défaut du fichier

  const customConsoleLog = (...args) => {
    setOutput((prevOutput) => prevOutput + "\n" + args.join(" "));
  };

  const executeCode = async () => {
    setIsLoading(true);
    setOutput("");  // Réinitialiser la sortie à chaque nouvelle exécution

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

      // Si le langage est HTML, ouvrir un nouvel onglet avec le résultat
      if (language === "html") {
        const newWindow = window.open();
        newWindow.document.write(result.output);
        newWindow.document.close();
      }

    } catch (error) {
      setOutput("Erreur de communication avec le serveur.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour créer un fichier et le rendre téléchargeable avec un nom personnalisé
  const downloadFile = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Utilisation du nom de fichier saisi et de l'extension appropriée
    const extension = languageExtensions[language] || "txt"; // Défaut à '.txt' si aucune extension définie
    link.href = url;
    link.download = `${fileName}.${extension}`;  // Ajout de l'extension appropriée
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fonction pour modifier le nom du fichier
  const handleRename = () => {
    const newName = prompt("Entrez un nouveau nom pour le fichier:", fileName);
    if (newName && newName.trim() !== "") {
      setFileName(newName.trim());  // Mettre à jour le nom du fichier
    }
  };

  return (
    <div className="w-full" style={{ height: "100vh" }}>
      <div className="flex justify-between items-center mb-4">
        <select
          className="p-2 border rounded bg-black text-white"
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            setCode(""); // Réinitialiser le code lorsqu'on change de langage
          }}
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
        <button
          className="p-2 border rounded bg-blue-600 text-white"
          onClick={executeCode}
          disabled={isLoading}
        >
          {isLoading ? "Exécution..." : "Exécuter"}
        </button>
        <button
          className="p-2 border rounded bg-green-600 text-white ml-2"
          onClick={downloadFile}
        >
          Télécharger le fichier
        </button>
        <button
          className="p-2 border rounded bg-yellow-600 text-white ml-2"
          onClick={handleRename}
        >
          Renommer
        </button>
      </div>

      <MonacoEditor
        height="80%"
        language={language}
        value={code}
        onChange={(newValue) => setCode(newValue)}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />

      {output && language !== "html" && (
        <div className="mt-4 p-4 w-32 bg-gray-900 text-white">
          <h3>Sortie :</h3>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
}
