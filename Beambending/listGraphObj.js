function listGraphObj() {
    var self = this;
    this.list = new Array();
    this.add = function (graphObj) {
        self.list.push(graphObj);
        $(document).trigger("canvasChange");
    };

    this.delete = function (obj) {
        var index = self.list.indexOf(obj);
        self.list.splice(index, index + 1);
        $(document).trigger("canvasChange");
    
        // Object.is(value1, value2);
    };

    this.deleteAll = function () {
        self.list = new Array();
        $(document).trigger("canvasChange");
    };

    this.findByCord = function (x, y) {
        for (var i = 0; i < self.list.length; i++) {
            if (self.list[i].isInside(x, y)) {
                return self.list[i];
            }
        };

        return false;
    };

    this.findBeam = function () {
        var temp = [];
        for (var i = 0; i < self.list.length; i++) {
            if (self.list[i].type == 'beam') {
                temp.push(self.list[i]);
            }

        }
        return temp;
    };
    this.lengthBetwen = function (graphObj, tempBeam) {

        var x = graphObj.x;
        var y = graphObj.y;
        var bXMin = tempBeam.x;
        var bXMax = tempBeam.x + tempBeam.width;
        var bY = tempBeam.y;
        if (x < bXMin) {
            var bx = bXMin;
        } else if (x > bXMax) {
            var bx = bXMax;
        } else {
            var bx = x;
        }
        return Math.sqrt(Math.pow(x - bx, 2) + Math.pow(bY - y, 2));
    };
    

    this.findClosestBeam = function (graphObj) {
        var temp = 99999999;
        var tempBeam = null;
        var beams = self.findBeam();
        //console.log(self.lengthBetwen(graphObj, beam));
        for (var i = 0; i < beams.length; i++) {
            if (self.lengthBetwen(graphObj, beams[i]) < temp) {
                temp = self.lengthBetwen(graphObj, beams[i]);
                tempBeam = beams[i];

            }
        }

        return tempBeam;

    }


    this.fixCanvas = function () {
        for (var i = 0; i < self.list.length; i++) {
            if (self.list[i].type != 'beam') {
                var tempBeam = self.findClosestBeam(self.list[i]);
                self.list[i].moveClose(tempBeam);
            }
        }
    }

    this.intersect = function (obj) {
        var tempList = [];
        for (var i = 0; i < self.list.length; i++) {
            if (!Object.is(self.list[i], obj) && self.list[i].intersect(obj)) {
                tempList.push(self.list[i]);
            }
        };

        if (tempList.length) {
            return tempList;
        }
        return false;
    };

}
    