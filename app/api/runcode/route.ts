import { NextRequest, NextResponse } from "next/server";
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os'); 


const tempDir = path.join(os.tmpdir(), 'colabsapp_temp'); 
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir); 
}


const executeC = (code) => {
    return new Promise((resolve, reject) => {
        const fileName = 'temp.c';
        const filePath = path.join(tempDir, fileName); 

        
        fs.writeFileSync(filePath, code);

        // Compiler le code C
        exec(`gcc ${filePath} -o ${tempDir}/temp && ${tempDir}/temp`, (error, stdout, stderr) => {
            fs.unlinkSync(filePath);

            if (error) {
                console.error("Erreur d'exécution C:", stderr);
                reject(`Erreur d'exécution C : ${stderr || error.message}`);
            } else {
                resolve(stdout);
            }
        });
    });
};


const executeCpp = (code) => {
    return new Promise((resolve, reject) => {
        const fileName = 'temp.cpp';
        const filePath = path.join(tempDir, fileName); 


        fs.writeFileSync(filePath, code);

        
        exec(`g++ ${filePath} -o ${tempDir}/temp && ${tempDir}/temp`, (error, stdout, stderr) => {
            fs.unlinkSync(filePath); 

            if (error) {
                console.error("Erreur d'exécution C++:", stderr);
                reject(`Erreur d'exécution C++ : ${stderr || error.message}`);
            } else {
                resolve(stdout);
            }
        });
    });
};


const executeJava = (code) => {
    return new Promise((resolve, reject) => {
        const fileName = 'Temp.java';
        const filePath = path.join(tempDir, fileName); 

        fs.writeFileSync(filePath, code);

        
        exec(`javac ${filePath}`, (compileError, compileStdout, compileStderr) => {
        
            if (compileError) {
                console.error("Erreur de compilation Java:", compileStderr);
                return reject(`Erreur de compilation Java : ${compileStderr || compileError.message}`);
            }


            exec(`java -cp ${tempDir} Temp`, (execError, execStdout, execStderr) => {
                fs.unlinkSync(filePath);

                if (execError) {
                    console.error("Erreur d'exécution Java:", execStderr);
                    return reject(`Erreur d'exécution Java : ${execStderr || execError.message}`);
                }

                resolve(execStdout); 
            });
        });
    });
};


const executePython = (code) => {
    return new Promise((resolve, reject) => {
        const fileName = 'temp.py';
        const filePath = path.join(tempDir, fileName); 


        fs.writeFileSync(filePath, code);


        exec(`python ${filePath}`, (error, stdout, stderr) => {
            fs.unlinkSync(filePath); 

            if (error) {
                console.error("Erreur d'exécution Python:", stderr);
                reject(`Erreur d'exécution Python : ${stderr || error.message}`);
            } else {
                resolve(stdout);
            }
        });
    });
};


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
            case 'html':  
                result = code;
                break;
            default:
                return NextResponse.json({ output: 'Langage non supporté' });
        }

    
        return NextResponse.json({ output: result });
    } catch (error) {
        
        console.error(`Erreur d'exécution dans ${language}:`, error.message);
        return NextResponse.json({ output: `Erreur d'exécution dans ${language}: ${error.message}` });
    }
}
