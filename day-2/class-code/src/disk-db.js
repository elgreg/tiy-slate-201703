let fs = require('fs');
let bluebird = require('bluebird');
let writeFile = bluebird.promisify(fs.writeFile);
let rmFile = bluebird.promisify(fs.unlink);

let mkdir = (path) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (err) => {
      if(err && err.code !== 'EEXIST'){
        return reject(err);
      }
      resolve();
    })
  });
};

class DiskDb {

  constructor(dirName){
    this._dir = dirName;
    this._madeDir = mkdir(this._dir);
  }

  save(fileName, json){
    return this._madeDir.then(
      () => {
        return writeFile(`${this._dir}/${fileName}`, json);
      }
    )
  }

  delete(fileName) {
    return rmFile(`${this._dir}/${fileName}`);
  }
  
}




module.exports = DiskDb