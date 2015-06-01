 var calc = calc || {};
            (function(o) {
             o.happening = function(type, xCord, load, EI) {

                this.M = load[0];
                this.T = load[1];
                this.q = load[2];
                this.l=0;
                self = this;
                this.xCord = xCord;
                this.type = type;
                this.length = length;
                this.EI = 1/EI;
                this.ekv = [
                    [EI, 0, 0, 0],
                    [xCord * EI, EI, 0, 0],
                    [xCord * xCord / 2 * EI, xCord * EI, EI, 0],
                    [xCord * xCord * xCord / 6 * EI, xCord * xCord / 2 * EI, xCord * EI, EI]
                ];
                this.qW = function(x){return 0;};
                this.qT = function(x){return 0;};
                this.qM = function(x){return 0;};

                this.fMid = [];
                this.q_x =function(x){return 0};        // Ta bort denna! 
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
                        this.vecMid = [self.ekv[3].concat([0, 0, 0, 0]), ([0, 0, 0, 0]).concat(numeric.neg(self.ekv[3])), self.ekv[2].concat(numeric.neg(self.ekv[2])), self.ekv[1].concat(numeric.neg(self.ekv[1]))];
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
                        this.vecMid = [self.ekv[3].concat(numeric.neg(self.ekv[3])),
                                       self.ekv[0].concat(numeric.neg(self.ekv[0])),
                                       self.ekv[1].concat([0, 0, 0, 0]),
                                       ([0, 0, 0, 0]).concat(self.ekv[1])];
                        this.fMid = [0, -this.T * EI, 0, 0];
                        this.vecEnd = [self.ekv[1], self.ekv[0]];
                        this.fEnd = [0, -this.T * EI];
                        break;
                    case "end":
                        this.vecEnd = [self.ekv[1], self.ekv[0]];
                        this.fEnd = [-this.M * EI, -this.T * EI];
                        break;
                    case "fixedRollSupport":
                        this.vecEnd = [self.ekv[0], self.ekv[2]];
                        this.fEnd = [-this.T * EI, 0];
                        break;
                    case "q1_start":
                        this.vecMid = [self.ekv[3].concat(numeric.neg(self.ekv[3])),
                                       self.ekv[2].concat(numeric.neg(self.ekv[2])),
                                       self.ekv[1].concat(numeric.neg(self.ekv[1])),
                                       self.ekv[0].concat(numeric.neg(self.ekv[0]))];

                        this.generateL = function(l,hap){
                            hap.l = l;
                            hap.fMid = [0,0,0,0];
                            hap.qW = function(x){
                                return hap.EI*hap.q * (x - hap.xCord)*(x - hap.xCord)*(x - hap.xCord)*(x - hap.xCord)/24;
                            };
                            hap.qM = function(x){
                                return hap.EI*hap.q *(x-hap.xCord)*(x-hap.xCord)/2;
                            };
                            hap.qT = function(x){
                                return hap.EI*hap.q*(x-hap.xCord);
                            };
                            
                        };
                        break;
                    case "q1_end":
                        this.vecMid = [self.ekv[3].concat(numeric.neg(self.ekv[3])),
                                       self.ekv[2].concat(numeric.neg(self.ekv[2])),
                                       self.ekv[1].concat(numeric.neg(self.ekv[1])),
                                       self.ekv[0].concat(numeric.neg(self.ekv[0]))];
                        this.generateL = function(l,hap){
                            hap.l = l;
                            q = hap.q;
                            EI = hap.EI;
                            hap.fMid = [-EI*q*Math.pow(l,4)/24, 
                            -EI*q*Math.pow(l,3)/6,
                            -EI*q*Math.pow(l,2)/2, 
                            -EI*q*l];
                        };
                        break;
                    case "q2_start":
                        this.vecMid = [self.ekv[3].concat(numeric.neg(self.ekv[3])),
                                       self.ekv[2].concat(numeric.neg(self.ekv[2])),
                                       self.ekv[1].concat(numeric.neg(self.ekv[1])),
                                       self.ekv[0].concat(numeric.neg(self.ekv[0]))];

                        this.generateL = function(l,hap){
                            hap.l = l;
                            hap.fMid = [0,0,0,0];
                            hap.qW = function(x){
                                return hap.EI * hap.q * (x - hap.xCord)*(x - hap.xCord)*(x - hap.xCord)*(x - hap.xCord)*(x - hap.xCord)/(120*l);
                            };
                            hap.qM = function(x){
                                return hap.EI*hap.q * (x - hap.xCord)*(x - hap.xCord)*(x - hap.xCord)/(6*hap.l);
                            };
                            hap.qT = function(x){
                                return hap.EI*hap.q * (x - hap.xCord)*(x - hap.xCord)/(2*hap.l);
                            };
                            
                        };
                        break;
                    case "q2_end":
                        this.vecMid = [self.ekv[3].concat(numeric.neg(self.ekv[3])), self.ekv[2].concat(numeric.neg(self.ekv[2])), self.ekv[1].concat(numeric.neg(self.ekv[1])), self.ekv[0].concat(numeric.neg(self.ekv[0]))];
                        this.generateL = function(l,hap){
                            hap.l = l;
                            q = hap.q;
                            EI = hap.EI;
                            hap.fMid = [-EI*q*l*l*l*l/120, -EI*q*l*l*l/24, -EI*q*l*l/6, -EI*q*l/2];
                        };
                        break;
                    case "q3_start":
                        this.vecMid = [self.ekv[3].concat(numeric.neg(self.ekv[3])),
                                       self.ekv[2].concat(numeric.neg(self.ekv[2])),
                                       self.ekv[1].concat(numeric.neg(self.ekv[1])),
                                       self.ekv[0].concat(numeric.neg(self.ekv[0]))];

                        this.generateL = function(l,hap){
                            hap.l = l;
                            hap.fMid = [0,0,0,0];
                            hap.qW = function(x){
                                output = hap.EI*hap.q*(x-hap.xCord)*(x-hap.xCord)*(x-hap.xCord)*(x-hap.xCord)/24 - hap.EI*hap.q*(x-hap.xCord)*(x-hap.xCord)*(x-hap.xCord)*(x-hap.xCord)*(x-hap.xCord)/(120*hap.l);
                                return output;
                            };
                            hap.qM = function(x){
                                return hap.EI*hap.q * (x - hap.xCord)*(x - hap.xCord)/(2)-hap.EI*hap.q * (x - hap.xCord)*(x - hap.xCord)*(x - hap.xCord)/(6*hap.l);
                            };
                            hap.qT = function(x){
                                return hap.EI*hap.q * (x - hap.xCord)-hap.EI*hap.q * (x - hap.xCord)*(x - hap.xCord)/(2*hap.l);
                            };
                            
                        };
                        break;
                    case "q3_end":
                        this.vecMid = [self.ekv[3].concat(numeric.neg(self.ekv[3])),
                                       self.ekv[2].concat(numeric.neg(self.ekv[2])),
                                       self.ekv[1].concat(numeric.neg(self.ekv[1])),
                                       self.ekv[0].concat(numeric.neg(self.ekv[0]))];
                        this.generateL = function(l,hap){
                            hap.l = l;
                            q = hap.q;
                            EI = hap.EI;
                            hap.fMid = [-(l*l*l*l*EI*q/24 - EI*q*l*l*l*l*l/(120*l)), 
                            -(l*l*l*EI*q/6 - EI*q*l*l*l*l/(24*l)), 
                            -(l*l*EI*q/2 - EI*q*l*l*l/(6*l)), 
                            -(l*EI*q - EI*q*l*l/(2*l))];
                        };
                        break;

                }
            };

            o.addZeroes=function(index, vec, len) {
                var before = [];
                var after = [];
                for (var i = 0; i < 4 * (index - 1); i++) {
                    before.push(0);
                };
                for (var i = 0; i < 4 * (len - index - 2); i++) {
                    after.push(0);
                };
                return before.concat(vec.concat(after));
            };

            o.createMatrix=function(has) {
                console.log(has);
                var len = has.length;
                var matrix = [];
                var fVec = [];
                for (var i = 0; i < len; i++) {
                    var hap = has[i];
                    if(hap.type == 'q1_start' || hap.type == 'q2_start' || hap.type == 'q3_start'){
                        hap.generateL(hap.xCord-has[i+1].xCord, hap);
                    }
                    if(hap.type == 'q1_end' || hap.type == 'q2_end' || hap.type == 'q3_end'){
                        hap.generateL(hap.xCord-has[i-1].xCord, hap);
                    }
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
                    //console.log(matrix);

                };

                var ainv = numeric.inv(matrix);
                var ans = numeric.dot(ainv, fVec);
                return ans;

            };

            o.deflection=function(k, has, h) {
                w = [];
                T = [];
                M = [];
                for (var i = 0; i < has.length - 1; i++) {
                    constVec = [k[4 * i], k[4 * i + 1], k[4 * i + 2], k[4 * i + 3]];
                    var EI = has[i].EI;
                    var count = 0;
                    for (var x = has[i].xCord; x < has[i + 1].xCord; x = x + h) {
                        count++;
                        var wEkv = [EI * x * x * x / 6, EI * x * x / 2, EI * x, EI];
                        var TEkv = [-x, -1, 0, 0];
                        var MEkv = [-1, 0, 0, 0];
                        w.push(numeric.dot(wEkv, constVec)+has[i].qW(x));
                        //console.log(wEkv + ' : ' + constVec);
                        
                        M.push(numeric.dot(TEkv, constVec)+has[i].qM(x));
                        T.push(numeric.dot(MEkv, constVec)+has[i].qT(x));
                    };
                };
                return [w, M, T];
            };
            o.checkType= function(object){
                switch (object.type) {
                    case 'moment':
                        return 'f';
                        break;
                    case 'load':
                        return 'f';
                        break;
                    case 'q1':
                        return 'f';
                        break;
                    case 'q1_start':
                        return 'f';
                        break;
                    case 'q1_end':
                        return 'f';
                        break;
                    case 'fixedSupport':
                        return 's';
                        break;
                    case 'momentFreeSupport':
                        return 's'
                        break;
                    case 'joint':
                        return 's';
                        break;
                    case 'fixedRollSupport':
                        return 's';
                        break;
                    case 'end':
                        return 'e';
                        break;
                    default:
                        console.log('Error'+type+'not exsists');
                        return '';
                }

            };
            o.sortHappenings = function(allHappenings) {

                allHappenings.sort(function(a, b) {
                    return a.xCord - b.xCord;
                });
                var ready = false;
                var count = 0;

                while (allHappenings.length > count+1){
    
                    var i = allHappenings[count];
                    var j = allHappenings[count+1];
                    if(i.xCord == j.xCord){
                        if(o.checkType(i)=='f' && !(o.checkType(j)=='e')){
                            if(j.xCord == 0){
                                j.M = -j.M - i.M;
                                j.T = -j.T - i.T;
                            }else {
                                j.M = j.M + i.M;
                                j.T = j.T + i.T;
                            };
                            allHappenings.splice(count, 2);
                            allHappenings.push(new o.happening(j.type,j.xCord,[j.M, j.T, 0], j.EI));
                            count = -1;
                            allHappenings.sort(function(a, b) {
                                return a.xCord - b.xCord;
                            });
                        }else if(o.checkType(j)=='f' && !(o.checkType(i)=='e')) {
                            if(j.xCord == 0){
                                i.M = -j.M - i.M;
                                i.T = -j.T - i.T;
                            }else {
                                i.M = j.M + i.M;
                                i.T = j.T + i.T;
                            };
                            allHappenings.splice(count, 2);
                            allHappenings.push(new happening(i.type, i.xCord, [i.M, i.T, 0], i.EI));
                            count = -1;
                            allHappenings.sort(function(a, b) {
                                return a.xCord - b.xCord;
                            });
                        }else if(o.checkType(j)=='e' ){
                            if(i.xCord == 0){
                                i.M = - i.M;
                                i.T = - i.T;
                            };
                            allHappenings.splice(count, 2);
                            allHappenings.push(new o.happening(i.type, i.xCord, [i.M, i.T, 0], i.EI));
                            count = -1;
                            allHappenings.sort(function(a, b) {
                                return a.xCord - b.xCord;
                            });
                        }else {
                            if(j.xCord == 0){
                                j.M = - j.M;
                                j.T = - j.T;
                            };
                            allHappenings.splice(count, 2);
                            allHappenings.push(new o.happening(j.type, j.xCord, [j.M, j.T, 0], j.EI));
                            count = -1;
                            allHappenings.sort(function(a, b) {
                                return a.xCord - b.xCord;
                            });
                        }
                    }
                    count++;
                }
                return allHappenings;
            };

            
            })(calc);
    
    