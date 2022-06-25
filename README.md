# CAD Networking Project

## Instructions
First, download this repository and cd into the directory you have downloaded it to. Run the following command to install all dependencies:

    npm install
Next, run the following script to run the project. This navigates to the src directory and concurrently runs `node Node_A.js` and `node Node_B.js`.

    npm run start
This should have the following output:

    Creating Node B...
    Creating Node A...
    Hosting cad_mesh.stl on Node A at Port 1000...
    Received file transfer request from Node B...
    Transfering cad_mesh.stl from Node A to Node B...
    Copied contents of cad_mesh.stl to output.stl...
    Hosting output.stl on Node B at Port 3001...
    Returning output.stl back to Node A from Node B...
    Finished file transfer! Copied contents of output.stl to cad_mesh_output.stl
Upon completion, you should see two new files in the src directory. One is `output.stl` which was the file Node B recieved from Node A, and one file is `cad_mesh_output.stl` which is the file Node A received back from Node B. 

## Explanation
This project uses Socket.IO and Node Streams for establishing communication between Node A and Node B. 

Initially, Node A acts as a server, waiting for a connection from Node B, the client. Node B emits a message and receives the file. In order to reduce memory consumption and optimize performance, Node Streams is use to create a pipe between the two Nodes, where a readable and writable stream on both nodes is made. **When Node B asks for the STL file, Node A streams it one chunk at a time as binary, which means the program doesn't buffer it in memory at all. This means that this file transfer approach can easily be scaled to larger file sizes without scaling memory consumption.**

Upon receiving the file, Node B writes the file's binary data to an output STL file. Node A and B both trigger their own respective functions upon completion of the file transfer to switch their roles as client and server, respectively. Node B initiates a read stream on `output.stl` and Node A initiates a write stream to output that data to `cad_mesh_output.stl`. The file transfer completes, and Node B has successfully returned its file data back to Node A. 

I have commented on each part of the code and placed `console.log` statements along the way to display the order Node A and Node B interact. 
