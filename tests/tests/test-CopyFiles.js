/**
 * @author Donii Sergii <doniysa@gmail.com>
 */

const chai   = require('chai'),
      expect = chai.expect,
      fs     = require('fs'),
      helper = require("./../helper"),
      copy   = require("./../../helpers/CopyFiles");

chai.use(require('chai-fs'));

let prepareFiles = () => {
    let files = [],
        dests = [];

    for (let i = 1; i <= 4; i++) {
        let filename = __dirname + '/../data/src/' + i.toString() + '.txt',
            destName = __dirname + '/../data/destination/' + i.toString() + '.txt';
        files.push(filename);
        dests.push(destName);
    }

    helper.dropFiles(dests);
    helper.createEmptyFiles(files);

    return files;
};

describe('CopyFiles class tests', () => {
    let config   = {
            paths: [
                {
                    dest: __dirname + '/../data/destination',
                    src : __dirname + '/../data/src/*'
                }
            ]
        },
        copyInst = new copy(config),
        files    = prepareFiles();


    it('Check config instance', (done) => {
        expect(copyInst.paths).to.be.a('array');
        expect(copyInst.paths[0]).to.be.a('Object');
        done();
    });

    it('Files Creation', (done) => {
        copyInst.process();
        setTimeout(() => {
            files.forEach((path) => {
                expect(path.replace('/src', '/destination')).is.a.file();
            });

            files = prepareFiles();
            done();
        }, 200);
    });

    it('Files Creation With deleting', (done) => {
        copyInst.process(true);
        setTimeout(() => {
            done();
            files.forEach((path) => {
                expect(path).not.is.a.file();
                expect(path.replace('/src', '/destination')).is.a.file();
            });
            done();
        });
    });
})
;