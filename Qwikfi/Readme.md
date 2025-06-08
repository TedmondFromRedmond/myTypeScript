Purpose:
Example of typescript with html form.


copy all files into a directory such as c:\mySandbox

Since you have copied a package.json and a tsconfig.json, you only need to run one command.

npm install

when you make a change to the .ts files you must compile 
npx tsc -p ./code

I used cursor and installed live server.

To Test:
- change .ts files
- compile with npx tsc and point to path for tsconfig
- npx tsc -p ./code
- In cursor, right click on .html file and click on Open with Live Server.

  
