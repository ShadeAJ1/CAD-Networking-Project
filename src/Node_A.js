//Imports
const { Server } = require("socket.io");
const io = new Server(3001, {});
const fs = require("fs");
var ss = require("socket.io-stream");

console.log("Creating Node A...");
console.log("Hosting cad_mesh.stl on Node A at Port 1000...");

//Host the file at Node A at Port 1000
io.on("connection", (socket) => {
  //Create a listener to respond to Node B
  console.log("Received file transfer request from Node B...");
  ss(socket).on("sendfile_NodeB", function (stream) {
    //Send the file to Node B
    console.log("Transfering cad_mesh.stl from Node A to Node B...");
    fs.createReadStream("./cad_mesh.stl").pipe(stream);

    //Upon finishing file transfer, prepare to call the file back
    returnFile();
  });
});

//Handle file return from Node B at Port 3001
function returnFile() {
  //Create a Client to receive the file
  var io = require("socket.io-client");
  var socket = io.connect("http://localhost:3001");
  var stream = ss.createStream();

  //Emit a message calling for the file
  ss(socket).emit("sendfile_NodeA", stream);

  //Ouput the contents of the file to a new STL file

  stream.pipe(fs.createWriteStream("./cad_mesh_output.stl"));
}
