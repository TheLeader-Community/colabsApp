import { NextRequest, NextResponse } from "next/server";
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');  // Importation de la bibliothèque os pour obtenir un répertoire temporaire

// Répertoire temporaire pour stocker les fichiers
const tempDir = path.join(os.tmpdir(), 'colabsapp_temp'); // Utilisation du répertoire temporaire du système

// Assurez-vous que le répertoire `colabsapp_temp` existe
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir); // Crée le répertoire si il n'existe pas
}

// Fonction pour exécuter du code C
const executeC = (code) => {
    return new Promise((resolve, reject) => {
        const fileName = 'temp.c';
        const filePath = path.join(tempDir, fileName); // Chemin du fichier temporaire

        // Sauvegarder le code dans un fichier temporaire
        fs.writeFileSync(filePath, code);

        // Compiler le code C
        exec(`gcc ${filePath} -o ${tempDir}/temp && ${tempDir}/temp`, (error, stdout, stderr) => {
            fs.unlinkSync(filePath); // Supprimer le fichier après exécution

            if (error) {
                console.error("Erreur d'exécution C:", stderr);
                reject(`Erreur d'exécution C : ${stderr || error.message}`);
            } else {
                resolve(stdout);
            }
        });
    });
};

// Fonction pour exécuter du code C++
const executeCpp = (code) => {
    return new Promise((resolve, reject) => {
        const fileName = 'temp.cpp';
        const filePath = path.join(tempDir, fileName); // Chemin du fichier temporaire

        // Sauvegarder le code dans un fichier temporaire
        fs.writeFileSync(filePath, code);

        // Compiler et exécuter le code C++
        exec(`g++ ${filePath} -o ${tempDir}/temp && ${tempDir}/temp`, (error, stdout, stderr) => {
            fs.unlinkSync(filePath); // Supprimer le fichier après exécution

            if (error) {
                console.error("Erreur d'exécution C++:", stderr);
                reject(`Erreur d'exécution C++ : ${stderr || error.message}`);
            } else {
                resolve(stdout);
            }
        });
    });
};

// Fonction pour exécuter du code Java
const executeJava = (code) => {
    return new Promise((resolve, reject) => {
        const fileName = 'Temp.java';
        const filePath = path.join(tempDir, fileName); // Chemin du fichier temporaire

        // Sauvegarder le code dans un fichier temporaire
        fs.writeFileSync(filePath, code);

        // Compiler le code Java
        exec(`javac ${filePath}`, (compileError, compileStdout, compileStderr) => {
            // Vérifier s'il y a une erreur lors de la compilation
            if (compileError) {
                console.error("Erreur de compilation Java:", compileStderr);
                return reject(`Erreur de compilation Java : ${compileStderr || compileError.message}`);
            }

            // Si la compilation est réussie, exécuter la classe Java compilée
            exec(`java -cp ${tempDir} Temp`, (execError, execStdout, execStderr) => {
                fs.unlinkSync(filePath); // Supprimer le fichier après exécution

                if (execError) {
                    console.error("Erreur d'exécution Java:", execStderr);
                    return reject(`Erreur d'exécution Java : ${execStderr || execError.message}`);
                }

                resolve(execStdout); // Retourner le résultat de l'exécution Java
            });
        });
    });
};

// Fonction pour exécuter du code Python
const executePython = (code) => {
    return new Promise((resolve, reject) => {
        const fileName = 'temp.py';
        const filePath = path.join(tempDir, fileName); // Chemin du fichier temporaire

        // Sauvegarder le code dans un fichier temporaire
        fs.writeFileSync(filePath, code);

        // Exécuter le code Python
        exec(`python ${filePath}`, (error, stdout, stderr) => {
            fs.unlinkSync(filePath); // Supprimer le fichier après exécution

            if (error) {
                console.error("Erreur d'exécution Python:", stderr);
                reject(`Erreur d'exécution Python : ${stderr || error.message}`);
            } else {
                resolve(stdout);
            }
        });
    });
};

// API POST pour exécuter le code
export async function POST(req: NextRequest) {
    const body = await req.json();
    const language = body.language;
    const code = body.code;

    try {
        let result;
        switch (language) {
            case 'c':
                result = await executeC(code);
                break;
            case 'cpp':
                result = await executeCpp(code);
                break;
            case 'java':
                result = await executeJava(code);
                break;
            case 'python':
                result = await executePython(code);
                break;
            case 'html':  // Ajout du cas pour HTML
                result = code;  // Le code HTML n'a pas besoin d'exécution, il est renvoyé tel quel
                break;
            default:
                return NextResponse.json({ output: 'Langage non supporté' });
        }

        // Renvoi de la réponse avec le résultat d'exécution
        return NextResponse.json({ output: result });
    } catch (error) {
        // Gestion des erreurs
        console.error(`Erreur d'exécution dans ${language}:`, error.message);
        return NextResponse.json({ output: `Erreur d'exécution dans ${language}: ${error.message}` });
    }
}
