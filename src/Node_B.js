//Imports
var io = require("socket.io-client");
var ss = require("socket.io-stream");
const fs = require("fs");

//Connect to Node A at Port 1000 and create a client
console.log("Creating Node B...");
var socket = io.connect("http://localhost:3000");
var stream = ss.createStream();

//Emit a message calling for the file
ss(socket).emit("sendfile_NodeB", stream);

//Ouput the contents of the file to a new STL file

stream.pipe(fs.createWriteStream("./output.stl"));

//Upon finishing file transfer, return the file with a new connection
stream.on("finish", () => {
  console.log("Copied contents of cad_mesh.stl to output.stl...");
  returnFile();
});

//Return the file to Node A at Port 3001
function returnFile() {
  const { Server } = require("socket.io");
  const io = new Server(3001, {});

  console.log("Hosting output.stl on Node B at Port 3001...");
  //Host the file at Node B at Port 3001
  io.on("connection", (socket) => {
    //Create a listener to respond to Node A
    ss(socket).on("sendfile_NodeA", function (stream) {
      //Send the file recieved from Node A back to Node A
      console.log("Returning output.stl back to Node A from Node B...");
      fs.createReadStream("./output.stl").pipe(stream);
      console.log(
        "Finished file transfer! Copied contents of output.stl to cad_mesh_output.stl"
      );
    });
  });
}
