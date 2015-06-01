
                function canHandler(listo) {
    
                    var self = this;
                    this.ofx = 0;
                    this.ofy = 0;
                    this.listGraphObj = listo;
                    this.graphObj = false;
                    this.graphObjMarked = false;
                    this.drawGraph = true;
                    this.deflScale = 10000;
                    this.menuHelper = new menuHelper(self.listGraphObj);
                    this.onClick = function(x, y) {
                        self.graphObj = self.listGraphObj.findByCord(x, y);
                        if (self.graphObj) {
                            self.ofx = x - self.graphObj.x;
                            self.ofy = y - self.graphObj.y;
                        }
                    };
                    this.calculate = function() {
    
                        // typ, xCord, [moment, kraft] EI
                        var zoom = 0.001;
                        var has = [];
                        var tempBeams = self.listGraphObj.findBeam();
                        if (tempBeams.length > 0) {
    
                            for (var num = 0; num < self.listGraphObj.list.length; num++) {
                                var tempGraph = self.listGraphObj.list[num];
    
                                if (tempGraph.type != 'beam') {
    
                                    switch (tempGraph.type) {
                                        case "load":
                                            has.push(new calc.happening(tempGraph.type, (tempGraph.x-tempGraph.xIn) * zoom, [0, tempGraph.amount,0], 1));
                                            break;
                                        case "moment":
                                            has.push(new calc.happening(tempGraph.type, (tempGraph.x-tempGraph.xIn) * zoom, [-tempGraph.amount, 0,0], 1));
                                            break;
                                         case "q1":
                                            has.push(new calc.happening("q1_start", (tempGraph.x) * zoom, [0,0, 1000], 1));
                                            has.push(new calc.happening("q1_end", (tempGraph.x+tempGraph.width) * zoom, [0,0, 1000], 1));
                                            break;
                                        default:
                                            has.push(new calc.happening(tempGraph.type, (tempGraph.x-tempGraph.xIn) * zoom, [0, 0], 1));
                                    }
                                }
                            }
                            has.push(new calc.happening('end', 0, [0, 0], 1));
                            //var has = [new calc.happening("fixedSupport", 0, [0, 0], 1), new calc.happening("momentFreeSupport", 1, [0, 0], 1), new calc.happening("fixedRollSupport", 3, [0, 0], 1), new calc.happening("load", 1.5, [0, -10], 1), new calc.happening("load", 0.5, [0,5], 1), new calc.happening("moment", 1, [-2, 0], 1), new calc.happening("load", 2.5, [0, -4], 1), new calc.happening("moment", 2, [-5, 0], 1), new calc.happening("load", 2.9, [0, -5], 1)];
                            has = calc.sortHappenings(has);
    
    
                            var values = calc.deflection(calc.createMatrix(has), has, 0.001);
    
                            var defl = values[0];
                            defl = numeric.mul(self.deflScale, defl);
                            defl = numeric.add(tempBeams[0].y + 15, defl);
    
                            var canvas = document.getElementById('myCanvas');
                            var context = canvas.getContext('2d');
                            context.strokeStyle = "#f00";
                            context.beginPath();
                            var xTempCord = parseInt(tempBeams[0].x)+parseInt(tempBeams[0].width);
                            context.moveTo(xTempCord, tempBeams[0].y+15);
    
                            for (var i = defl.length-1; xTempCord>= tempBeams[0].x; i--) {
                                xTempCord--;
                                context.lineTo(xTempCord, defl[i]);
    
                            };
                            context.stroke();
                            // 150 90
                            //////////////////////////////////////////////
                            if(self.drawGraph){
                             var defl = values[1];
                            defl = numeric.mul(-10, defl);
                            defl = numeric.add(tempBeams[0].y + 260, defl);
    
                            var canvas = document.getElementById('myCanvas');
                            var context = canvas.getContext('2d');
                            context.strokeStyle = "#0f0";
                            context.beginPath();
                            var xTempCord = parseInt(tempBeams[0].x)+parseInt(tempBeams[0].width);
                             context.moveTo(xTempCord,defl[defl.length-1]);
    
                            for (var i = defl.length-1; xTempCord>= tempBeams[0].x; i--) {
                                xTempCord--;
                                context.lineTo(xTempCord, defl[i]);
                            };
    
                             context.drawImage (nmGraf, xTempCord-25, tempBeams[0].y + 200,tempBeams[0].width+50, 80);
                            context.stroke();
    
    
                        var defl = values[2];
                            defl = numeric.mul(-0.5, defl);
                            defl = numeric.add(tempBeams[0].y + 150, defl);
    
                            var canvas = document.getElementById('myCanvas');
                            var context = canvas.getContext('2d');
                            context.strokeStyle = "#00f";
                            context.beginPath();
                             var xTempCord = parseInt(tempBeams[0].x)+parseInt(tempBeams[0].width);
                            context.moveTo(xTempCord,defl[defl.length-1]);
    
                            for (var i = defl.length-1; xTempCord>= tempBeams[0].x; i--) {
                                xTempCord--;
                                context.lineTo(xTempCord, defl[i]);
                            };
    
                             context.drawImage (nGraf, xTempCord-25, tempBeams[0].y + 90,tempBeams[0].width+50, 80);
                            context.stroke();
    
                        }
                        }
    
                    };
                    this.onMove = function(x, y) {
                        if (self.graphObj) {
                            self.graphObj.moveTo(x - self.ofx, y - self.ofy);
                        }
                    };
                    this.onUpp = function() {
                        self.graphObj = false;
                        self.ofx = 0;
                        self.ofy = 0;
                        self.listGraphObj.fixCanvas();
                        //console.log('afsfaa');
                       self.calculate();
    
    
                    };
    
                    this.onRightClick = function(x, y) {
                        if (self.graphObjMarked) {
                            self.graphObjMarked.setBorder('none');
                        }
                        self.graphObjMarked = self.listGraphObj.findByCord(x, y);
                        if (self.graphObjMarked) {
                            self.menuHelper.generateUl(self.graphObjMarked);
                            $("#menu").toggle();
                            $("#background").toggle();
                            $('#menu').css({
                                top: y - 80,
                                left: x - 150
                            });
                            /*var liss  = document.getElementById("listm").getElementsByTagName("li");
                            console.log(liss);
                            for (var i = 0; i < liss.length; i++) {
                                liss[i].style.transition = "left 1.0s ease-in-out";
                                liss[i].style.left = 300 + 'px';
                            };*/
                        }
                        
                    };
    
                    this.createRows = function() {
                        context.beginPath();
                        context.strokeStyle = "#eee";
                        for (var i = 0; i < 1500; i = i + 10) {
                            context.moveTo(0, i);
                            context.lineTo(1500, i);
                            context.moveTo(i, 0);
                            context.lineTo(i, 1500);
                        }
                        context.stroke();
                    }
                    this.markNext = function() {
                        var temp = self.listGraphObj.list;
                        self.graphObjMarked.setBorder('none');
                        //
                        //
                        //
                        // console.log(temp.indexOf(self.graphObjMarked) + 1 % (temp.length - 1));
                        self.graphObjMarked = temp[temp.indexOf(self.graphObjMarked) + 1 % (temp.length - 1)];
    
                    }
    
                    this.draw = function() {
                        context.clearRect(0, 0, canvas.width, canvas.height);
    
    
                        self.createRows();
                        for (var i = 0; i < self.listGraphObj.list.length; i++) {
                            self.listGraphObj.list[i].draw();
    
                        };
                    }
                    $(document).on("canvasChange", function(e) {
                        self.draw();
                        //  console.log(self.listGraphObj);
    
                    });
    
                }