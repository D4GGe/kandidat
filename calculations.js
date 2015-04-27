<script>

</script>









<!DOCTYPE HTML>
<html>

<head>
    <style>
        body {
            margin: 0px;
            padding: 0px;
        }
    </style>
</head>

<body>
    <canvas id="myCanvas" width="1000" height="1000" style="border-style: solid;
    border-width: 5px;"></canvas>

    <script src="http://349.se/gauss.js"></script>
    <script src="http://code.jquery.com/jquery-2.1.3.min.js"></script>
    <script src="http://numericjs.com/lib/numeric-1.2.6.min.js"></script>
    <script>
        /*
            ------------------info------------------
            For matrix operations and so on. http://numericjs.com/documentation.html
            For basic math http://www.w3schools.com/jsref/jsref_obj_math.asp


             the '/' in matlab or gauss elemenitation  is preformd like folows:

             * Solves this system:
             * x + y + z = 6
             * 2x + y + 2z = 10
             * x + 2y + 3z = 14
                A = [[1, 1, 1],
                      [2, 1, 2],
                      [1, 2, 3]];

                x = [6, 10, 14];
                result = gauss($A, $x);
            */






        ////////////  helpers by Daniel ////////////////////////////////////
        function plotLine(can, matrix) {

            var context = can.getContext('2d');
            context.beginPath();
            context.moveTo(mathToWebCord(matrix[0], can.height)[0], mathToWebCord(matrix[0], can.height)[1]);
            for (var i = 0; i <= matrix.length - 1; i++) {
                context.lineTo(mathToWebCord(matrix[i], can.height)[0], mathToWebCord(matrix[i], can.height)[1]);
            };
            context.stroke();
        }

        function plotPoints(can, matrix, size) {
            var context = can.getContext('2d');
            for (var i = 0; i <= matrix.length - 1; i++) {
                context.beginPath();
                context.arc(mathToWebCord(matrix[i], can.height)[0], mathToWebCord(matrix[i], can.height)[1], size, 0, 2 * Math.PI, true);

                context.fill();

            };

        }

        function mathToWebCord(cord, ySize) {
            x = cord[0];
            y = cord[1];
            return [x, ySize - y];
        }

        function webToMathCord(cord, ySize) {
            x = cord[0];
            y = cord[1];
            return [x, y - ySize];

        }




        ///////////////////////////////////////////////////////////////////////////
        var calc = calc || {};
        (function(o) {
            o.createMatrix = function (start, end, inc, func) {
                var ans = [];
                for (var i = start; i <= end; i = i + inc) {
                    ans.push([i, func(i)]);
                    console.log(i);
                };
                return ans;
            }

            o.happening = function(type, xCord, load, EI) {
                self = this;
                this.M = load[0];
                this.T = load[1];
                this.xCord = xCord;
                this.type = type;
                this.length = length;
                this.EI = EI;
                this.ekv = [
                    [EI, 0, 0, 0],
                    [xCord * EI, EI, 0, 0],
                    [xCord * xCord / 2 * EI, xCord * EI, EI, 0],
                    [xCord * xCord * xCord / 6 * EI, xCord * xCord / 2 * EI, xCord * EI, EI]
                ];
                switch (type) {
                    case "fixedSupport":
                        this.vecEnd = [self.ekv[2], self.ekv[3]];
                        this.fEnd = [0, 0];
                        this.vecMid = null;
                        this.fMid = null;
                        break;
                    case "momentFreeSupport":
                        this.vecEnd = [self.ekv[1], self.ekv[3]];
                        this.fEnd = [-this.M * this.EI, 0];
                        //vec 3 - vec 4
                        this.vecMid = [self.ekv[3].concat([0, 0, 0, 0]), ([0, 0, 0, 0]).concat(self.ekv[3]), self.ekv[2].concat(numeric.neg(self.ekv[2])), self.ekv[1].concat(self.ekv[1])];
                        this.fMid = [0, 0, 0, -this.M * this.EI];
                        break;
                    case "load":
                        this.vecEnd = [self.ekv[0], self.ekv[1]];
                        this.fEnd = [-this.T * EI, -this.M * EI];
                        this.vecMid = [self.ekv[3].concat(numeric.neg(self.ekv[3])), self.ekv[2].concat(numeric.neg(self.ekv[2])), self.ekv[1].concat(numeric.neg(self.ekv[1])), self.ekv[0].concat(numeric.neg(self.ekv[0]))];
                        this.fMid = [0, 0, -this.M * EI, -this.T * EI];
                        break;
                    case "moment":
                        this.vecMid = [self.ekv[3].concat(numeric.neg(self.ekv[3])), self.ekv[2].concat(numeric.neg(self.ekv[2])), self.ekv[1].concat(numeric.neg(self.ekv[1])), self.ekv[0].concat(numeric.neg(self.ekv[0]))];
                        //this.vecMid = [self.ekv[3].concat(numeric.neg(self.ekv[3])), self.ekv[2].concat(numeric.neg(self.ekv[2])), self.ekv[1].concat(numeric.neg(self.ekv[1])), self.ekv[0].concat(numeric.neg(self.ekv[0]))];
                        this.fMid = [0, 0, -this.M * EI, -this.T * EI];
                        this.vecEnd = [self.ekv[1], self.ekv[0]];
                        this.fEnd = [-this.M * EI, -this.T * EI];
                        break;
                    case "joint":
                        this.vecMid = [self.ekv[3].concat(numeric.neg(self.ekv[3])), self.ekv[0].concat(numeric.neg(self.ekv[0])), self.ekv[1].concat([0, 0, 0, 0]), ([0, 0, 0, 0]).concat(self.ekv[1])];
                        this.fMid = [0, -this.T * EI, 0, 0];
                        this.vecEnd = [self.ekv[1], self.ekv[0]];
                        this.fEnd = [0, -this.T * EI];
                        break;
                    case "end":
                        this.vecEnd = [self.ekv[1], self.ekv[0]];
                        this.fEnd = [-this.M * EI, -this.T * EI];
                        break;
                    case "fixedRollSupport":
                        this.vecEnd = [self.ekv[2], self.ekv[0]];
                        this.fEnd = [0, -this.T * EI];
                        break;
                }
            }

            o.addZeroes = function (index, vec, len) {
                var before = [];
                var after = [];
                for (var i = 0; i < 4 * (index - 1); i++) {
                    before.push(0);
                };
                for (var i = 0; i < 4 * (len - index - 2); i++) {
                    after.push(0);
                };
                return before.concat(vec.concat(after));
            }

            o.createMatrix = function (has) {
                var len = has.length;
                var matrix = [];
                var fVec = [];
                for (var i = 0; i < len; i++) {
                    var hap = has[i];
                    if (i == 0 || i == len - 1) {

                        matrix.push(o.addZeroes(i, hap.vecEnd[0], len));
                        fVec.push(hap.fEnd[0]);
                        matrix.push(o.addZeroes(i, hap.vecEnd[1], len));
                        fVec.push(hap.fEnd[1]);
                    } else {

                        matrix.push(o.addZeroes(i, hap.vecMid[0], len));
                        fVec.push(hap.fMid[0]);
                        matrix.push(o.addZeroes(i, hap.vecMid[1], len));
                        fVec.push(hap.fMid[1]);
                        matrix.push(o.addZeroes(i, hap.vecMid[2], len));
                        fVec.push(hap.fMid[2]);
                        matrix.push(o.addZeroes(i, hap.vecMid[3], len));
                        fVec.push(hap.fMid[3]);
                    };


                };

                var ainv = numeric.inv(matrix);
                var ans = numeric.dot(ainv, fVec);
                return ans;

            }

            o.deflection =  function (k, func_has, h) {
                w = [];
                T = [];
                M = [];
                console.log(k);
                for (var i = 0; i < func_has.length - 1; i++) {
                    constVec = [k[4 * i], k[4 * i + 1], k[4 * i + 2], k[4 * i + 3]];


                    var EI = func_has[i].EI;

                    var count = 0;
                    for (var x = func_has[i].xCord; x < func_has[i + 1].xCord; x = x + h) {
                        count++;
                        var wEkv = [EI * x * x * x / 6, EI * x * x / 2, EI * x, EI];
                        var TEkv = [-x, -1, 0, 0];
                        var MEkv = [-1, 0, 0, 0];
                        w.push(numeric.dot(wEkv, constVec));
                        M.push(numeric.dot(TEkv, constVec));
                        T.push(numeric.dot(MEkv, constVec));
                    };
                };
                return [w, M, T];
            }

            o.sortHappenings = function (allHappenings) {
                allHappenings.sort(function(a, b) {
                    return a.xCord - b.xCord;
                });
                for (var i = 0; i < allHappenings.length - 2; i++) {
                    if (allHappenings[i].xCord == allHappenings[i + 1].xCord) {
                        if (allHappenings[i].type == "momentFreeSupport" && allHappenings[i + 1].type == "moment") {
                            allHappenings[i].M = allHappenings[i + 1].M;
                            allHappenings.splice(i + 1, 1);
                            allHappenings[i] = new o.happening(allHappenings[i].type, allHappenings[i].xCord, [allHappenings[i].M, allHappenings[i].T], allHappenings[i].EI);
                        } else if (allHappenings[i].type == "moment" && allHappenings[i + 1].type == "momentFreeSupport") {
                            allHappenings[i + 1].M = allHappenings[i].M;
                            allHappenings.splice(i, 1);
                            allHappenings[i] = new o.happening(allHappenings[i].type, allHappenings[i].xCord, [allHappenings[i].M, allHappenings[i].T], allHappenings[i].EI);
                        } else if (allHappenings[i].type == "joint" && allHappenings[i + 1].type == "load") {
                            allHappenings[i].T = allHappenings[i + 1].T;
                            allHappenings.splice(i + 1, 1);
                            allHappenings[i] = new o.happening(allHappenings[i].type, allHappenings[i].xCord, [allHappenings[i].M, allHappenings[i].T], allHappenings[i].EI);
                        } else if (allHappenings[i].type == "load" && allHappenings[i + 1].type == "joint") {
                            allHappenings[i + 1].T = allHappenings[i].T;
                            allHappenings.splice(i, 1);
                            allHappenings[i] = new o.happening(allHappenings[i].type, allHappenings[i].xCord, [allHappenings[i].M, allHappenings[i].T], allHappenings[i].EI);
                        } else if (allHappenings[i].type == "fixedRollSupport" && allHappenings[i + 1].type == "load") {
                            allHappenings[i].T = allHappenings[i + 1].T;
                            allHappenings.splice(i + 1, 1);
                            allHappenings[i] = new o.happening(allHappenings[i].type, allHappenings[i].xCord, [allHappenings[i].M, allHappenings[i].T], allHappenings[i].EI);
                        } else if (allHappenings[i].type == "load" && allHappenings[i + 1].type == "fixedRollSupport") {
                            allHappenings[i + 1].T = allHappenings[i].T;
                            allHappenings.splice(i, 1);
                            allHappenings[i] = new o.happening(allHappenings[i].type, allHappenings[i].xCord, [allHappenings[i].M, allHappenings[i].T], allHappenings[i].EI);
                        } else if (allHappenings[i].type == "moment" && allHappenings[i + 1].type == "load") {
                            allHappenings[i].T = allHappenings[i + 1].T;
                            allHappenings.splice(i + 1, 1);
                            allHappenings[i] = new o.happening(allHappenings[i].type, allHappenings[i].xCord, [allHappenings[i].M, allHappenings[i].T], allHappenings[i].EI);
                        } else if (allHappenings[i].type == "load" && allHappenings[i + 1].type == "moment") {
                            allHappenings[i].M = allHappenings[i + 1].M;
                            allHappenings.splice(i + 1, 1);
                            allHappenings[i] = new o.happening(allHappenings[i].type, allHappenings[i].xCord, [allHappenings[i].M, allHappenings[i].T], allHappenings[i].EI);
                        }
                    }
                }
                return allHappenings;
            }

            o.test = function() {


                // var has = [new o.happening("end",0,0,1), new o.happening("moment",0.5,-1,1), new o.happening("momentFreeSupport",1,0,1), new o.happening("joint",2,0,1), new o.happening("momentFreeSupport",3,0,1), new o.happening("end",4,0,1)];
                //var has = [new o.happening("fixedSupport",0,0,1),  new o.happening("load",1,1,1), new o.happening("momentFreeSupport",2,0,1), new o.happening("load",2.2,0,1), new o.happening("momentFreeSupport",2.5,0,1), new o.happening("momentFreeSupport",3,0,1), new o.happening("load",4,1,1), new o.happening("momentFreeSupport",4.1,0,1), new o.happening("load",4.3,-5,1), new o.happening("momentFreeSupport",4.5,0,1), new o.happening("fixedSupport",5,0,1)];
                var has = [new o.happening("fixedSupport", 0, [0, 0], 1), new o.happening("momentFreeSupport", 1, [0, 0], 1), new o.happening("fixedRollSupport", 3, [0, 0], 1), new o.happening("load", 1.5, [0, -10], 1), new o.happening("load", 0.5, [0,
                    5
                ], 1), new o.happening("moment", 1, [-2, 0], 1), new o.happening("load", 2.5, [0, -4], 1), new o.happening("moment", 2, [-5, 0], 1), new o.happening("load", 2.9, [0, -5], 1)];
                has = o.sortHappenings(has);
                console.log(has);

                var values = o.deflection(o.createMatrix(has), has, 0.005);
                console.log(values);
                var defl = values[0]
                defl = numeric.mul(100, defl);
                defl = numeric.add(250, defl);

                var canvas = document.getElementById('myCanvas');
                var context = canvas.getContext('2d');
                context.beginPath();
                context.moveTo(0, defl[0]);
                for (var i = 1; i <= defl.length - 1; i++) {
                    context.lineTo(i, defl[i]);
                };
                context.stroke();
                context.beginPath();
                context.strokeStyle = "red";
                context.moveTo(0, 250);
                context.lineTo(1000, 250);
                context.stroke();
                context.beginPath;
                context.fillStyle = "blue";
                context.fillRect(200, 250, 4, 4);
                context.fillRect(400, 250, 4, 4);
                context.fillRect(600, 250, 4, 4);


            }
        })(calc);


            //calc.test();



    </script>
</body>

</html>
