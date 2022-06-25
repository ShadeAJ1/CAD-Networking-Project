var THREE = require("three");

//starting point for implementing a function to get all matrices
module.exports = {
  vertices: () => {
    var loader = new THREE.STLLoader();
    var myModel = new THREE.Object3D();

    loader.load("./cad_mesh.stl", function (geometry) {
      var mat = new THREE.MeshLambertMaterial({ color: 0x7777ff });
      var geo = new THREE.Geometry().fromBufferGeometry(geometry);
      myModel = new THREE.Mesh(geo, mat);
      return myModel.geometry.vertices;
    });
  },
};
