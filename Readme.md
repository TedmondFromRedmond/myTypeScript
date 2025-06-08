
This is the form submission for the Qwikfi procedure.

Audience: General Public and bank users. @Robert, do we need to integrate this form to bank members after they have logged into their accounts?

if so, how do we integrate, what systems do we modify, who do we partner with and what technology is preferred?


Overview:
Built with html and typescript.
Built to assist an mvp - minimum viable product

#---
Next Steps:
Setup:
Let’s walk through the process and verify what’s required, and what’s optional.


✅ 1. Create the Directory

mkdir C:\test
No issues here — basic filesystem setup.

✅ 2. Copy Required Files and Folders
You should copy the following exact structure:

C:\test\
C:\test\
├── index.html                📄 Main browser file (or index3.html)
├── script.ts                 📄 TypeScript source file (user input, API call, etc.)
├── dist\                     📁 Compiled JS output
│   └── script.js             📄 Output from TypeScript
├── code\                     📁 TypeScript config folder
│   └── tsconfig.json         📄 Compiler settings
├── package.json              📄 (Optional) NPM setup file
├── package-lock.json         📄 (Auto-generated on install)
└── node_modules\             📁 (Auto-created if you run `npm install`)Also copy:

Any additional .ts files you want compiled


✅ 3. Compile with TypeScript
In your new folder (C:\test), run:

npx tsc -p .\code
This uses code\tsconfig.json to compile all .ts files in C:\test and outputs .js files into C:\test\dist.

✅ You should now see:

C:\test\dist\script.js
✅ 4. Open index.html in Browser
in vscode, rt. click, open with live server



✅ Summary
Everything will work as long as:

Your relative paths in index.html point to ./dist/script.js

You run npx tsc -p code from C:\test

You maintain the expected directory structure

#---


Testing:
1. Validate the credit score is returned. (Which credit reporting agency?)
2. Confirm data entered on screen is inserted into mongoDB.
3. Identify random, unique submission tracking number generated in mongoDB.
4. Using a py script, retreive the date of submission from MongoDB




