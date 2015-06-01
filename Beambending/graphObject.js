  function graphObj(type) {
                    this.x = 0;
                    this.y = 0;
                    var self = this;
                    this.type = type;
                    this.border = 'none';
                    this.angle = 1;
                    this.Emodule = 210000000000;
                    this.Imodule = 0.000000000001;
                    this.amount = 100;
                    switch (type) {
                        case 'load':
                            this.xIn = 5;
                            this.yIn = 30;
                            this.img = arrow;
                            this.img2 = this.img;
                            this.height = 40;
                            this.width = 40;
                            this.prePoint = [{
                                x: 20,
                                y: 40
                            }];
                            break;
                        case 'beam':
                            this.img = 'square';
                            this.img2 = this.img;
                            this.height = 15;
                            this.width = 200;
                            break;
                        case 'fixedSupport':
                            this.xIn = 15;
                            this.yIn = 40;
                            this.img = fixedsuportIMG;
                            this.img2= FixedSupport_SF;
                            this.height = 100;
                            this.width = 100;
                            this.prePoint = [{
                                x: 20,
                                y: 50
                            }];
                            break;
                        case 'momentFreeSupport':
                            this.xIn = 5;
                            this.yIn = -3;
                            this.img = momentfreesuport;
                            this.img2 =  MomentFreeSupport_SF;
                            this.height = 30;
                            this.width = 40;
                            this.prePoint = {
                                x: 10,
                                y: 0
                            };
                            break;
                        case 'joint':
                            this.img = 'circ';
                            this.img2 = this.img;
                            this.height = 20;
                            this.width = 20;
                            this.prePoint = [{
                                x: 0,
                                y: 10
                            }, {
                                x: 20,
                                y: 10
                            }];
                            break;
                        case 'q1':
                            this.xIn = 0;
                            this.yIn = 36;
                            this.img = q1;
                            this.img2 =  q1;
                            this.height = 40;
                            this.width = 80;
                            break;
                                 
                    case 'moment':
                        this.amount = 10;
                         this.img = MomentPositive;
                        this.img2 = this.img;
                        this.height = 40;
                        this.width = 40;
                        this.xIn = 15;
                        this.yIn = 20;
                        break;
                        default:
                    }
    
                    this.draw = function() {
                        context.beginPath();
                      //  context.fillRect(self.x+self.xIn,self.y+self.yIn,5,5);
                        switch (self.img) {
    
                            case 'square':
                                context.fillRect(self.x, self.y, self.width, self.height);
                                break;
                            case 'circ':
                                context.arc(self.x, self.y, self.height, 0, 2 * Math.PI);
                            default:
                            if(sfMode){
                                context.drawImage(self.img2, self.x, self.y, self.width, self.height);
                            }else{
                                context.drawImage(self.img, self.x, self.y, self.width, self.height);
                            }
                        }
    
                        if (self.border != 'none') {
                            context.beginPath();
                            context.strokeStyle = self.border;
                            context.rect(self.x + 1, self.y + 1, self.width - 2, self.height - 2);
                            context.stroke();
                        }
                        context.restore();
                       
                    };
    
    
                    this.isInside = function(x, y) {
                        return x > self.x && x < (self.x + self.width) && y > self.y && y < (self.y + self.height);
                    };
    
                    this.moveTo = function(x, y) {
    
                        self.x = Math.round(x / 10) * 10;
                        self.y = Math.round(y / 10) * 10;
                        $(document).trigger("canvasChange");
    
    
                    };
                    this.setWidth = function(width) {
                        self.width = width;
                        $(document).trigger("canvasChange");
    
                    }
                    this.setBorder = function(style) {
                        self.border = style;
                        $(document).trigger("canvasChange");
                    };
    
                    this.intersect = function(obj) {
                        minFirstX = self.x;
                        maxFirstX = self.x + self.width;
                        minFirstY = self.y;
                        maxFirstY = self.y + self.height;
    
                        minSecondX = obj.x;
                        maxSecondX = obj.x + obj.width;
                        minSecondy = obj.y;
                        maxSecondy = obj.y + obj.width;
    
                        if (maxFirstX < minSecondX) return false;
                        if (minFirstX > maxSecondX) return false;
                        if (maxFirstY < minSecondy) return false;
                        if (minFirstY > maxSecondy) return false;
                        return true; // boxes overlap
                    };
                }
    