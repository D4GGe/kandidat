
                function menuHelper(listGraphObj) {
                    self = this;
                    this.listGraphObj = listGraphObj;
                    this.content = document.getElementById('listm');
                    this.list = [];
                    this.addLi = function(type, content) {
                        var element = document.createElement("li");
                        element.style.padding = "18px 18px";
                     //16 heigt 12 width
                        //console.log(type);
                        switch (type) {
    
                            case 'toFofce':
                                //element.style.background = "red";
                                element.onclick = function() {};
                                break;
                            case 'cordinates':
                                var t = document.createTextNode(content);
                                element.appendChild(t);
                                break;
                            case 'rotate':
                                var t = document.createTextNode('rotate');
                                element.appendChild(t);
                                break;
                            case 'addWidth':
                                var t = document.createTextNode('+');
                                element.appendChild(t);
                                break;
                            case 'removeWidth':
                                var t = document.createTextNode('-');
                                element.appendChild(t);
                                break;
                             case 'changeLoad':
                                var t = document.createTextNode(content);
                                element.appendChild(t);
                                break;
                             case 'KN':
                                var t = document.createTextNode('KN');
                                element.appendChild(t);
                                break;
                             case 'E':
                                var t = document.createTextNode('E');
                                element.appendChild(t);
                                break;
                                //FixedRollSupportRight.svg
                            case 'toss':
                               //element.style.background = "red";
                               element.style.backgroundImage = "url('http://349.se/kandidat/img/TrashCan.svg')";
                               element.style.backgroundSize="100% 100%";
                                  break;
                             case 'MomentPositive':
                               element.style.backgroundImage = "url('http://349.se/kandidat/img/MomentPositive.svg')";
                               element.style.backgroundSize="100% 100%";
                                  break;
                             case 'changeLength':
                               element.style.backgroundImage = "url('http://349.se/kandidat/img/ChangeLengthOfBeam.svg')";
                               element.style.backgroundSize="100% 100%";
                                break;
                              case 'changeTvarsnitt':
                               element.style.backgroundImage = "url('http://349.se/kandidat/img/ChangeTvarsnitt.svg')";
                               element.style.backgroundSize="100% 100%";
                                  break;
                              case 'disLoad':
                                 element.style.backgroundImage = "url('http://349.se/kandidat/img/DistributedLoadPositive.svg')";
                                element.style.backgroundSize="100% 100%";
                                  break;
                              case 'FixedRollSupport':
                                 element.style.backgroundImage = "url('http://349.se/kandidat/img/FixedRollSupportRight.svg')";
                                element.style.backgroundSize="100% 100%";
                                  break;
                              case 'FixedSupport':
                                 element.style.backgroundImage = "url('http://349.se/kandidat/img/Fixed_support.svg')";
                                element.style.backgroundSize="100% 100%";
                                  break;
                              case 'momentfreeSuport':
                                 element.style.backgroundImage = "url('http://349.se/kandidat/img/momentfreeSuport.svg')";
                                element.style.backgroundSize="100% 100%";
                                  break;
    
    
                            default:
                            console.log('error:unown menu type '+type);
    
                        }
                        self.content.appendChild(element);
                        return element;
                    };
                    this.generateUl = function(obj) {
                        self =this;
                        self.clear();
                        //"fixedSupport" "momentFreeSupport" "load" "moment" "joint"
                        switch (obj.type) {
                            case 'load':
                                 self.addLi('toss', '').onclick = function() {
                                    self.listGraphObj.delete(obj);
                                };
                                self.addLi('cordinates', '[' + canHan.graphObjMarked.x*0.001 + ',' + canHan.graphObjMarked.x*0.001 + ']').onclick = function() {
                                    var tempx = prompt("enter new x cordinates", "");
                                    var tempy = prompt("enter new y cordinates", "");
                                    obj.moveTo(tempx, tempy);
                                };
    
                                self.addLi('MomentPositive', '').onclick = function() {
    
                                };
    
                                self.addLi('KN', '').onclick = function() {
    
                                };
                                  self.addLi('disLoad', '').onclick = function() {
    
                                };
    
                                break;
                            case 'beam':
                               self.addLi('cordinates', '[' + canHan.graphObjMarked.x*0.001 + ',' + canHan.graphObjMarked.x*0.001 + ']').onclick = function() {
                                    var tempx = prompt("enter new x cordinates", "");
                                    var tempy = prompt("enter new y cordinates", "");
                                    obj.moveTo(tempx, tempy);
                                };
    
                                self.addLi('changeLength', '').onclick = function() {
    
                                    var temp = prompt("enter new with", 100);
                                    obj.setWidth(parseInt(temp));
                                };
    
                                self.addLi('changeTvarsnitt', '').onclick = function() {
                                    var temp = prompt("enter new with", "100");
                                    obj.setWidth(temp);
                                };
                                self.addLi('E', '').onclick = function() {
                                    var temp = prompt("enter new e", "100");
                                    obj.setWidth(temp);
                                };
    
                                self.addLi('toss', '').onclick = function() {
                                    self.listGraphObj.delete(obj);
                                };
    
                                break;
                                case 'momentFreeSupport':
                                self.addLi('cordinates', '[' + canHan.graphObjMarked.x*0.001 + ',' + canHan.graphObjMarked.x*0.001 + ']').onclick = function() {
                                    var tempx = prompt("enter new x cordinates", "");
                                    var tempy = prompt("enter new y cordinates", "");
                                    obj.moveTo(tempx, tempy);
                                };
                                self.addLi('toss', '').onclick = function() {
                                    self.listGraphObj.delete(obj);
                                };
    
                                self.addLi('FixedRollSupport', '').onclick = function() {
    
                                };
    
                                self.addLi('FixedSupport', '').onclick = function() {
    
                                };
    
                                break;
                                case 'fixedSupport':
                                self.addLi('cordinates', '[' + canHan.graphObjMarked.x*0.001 + ',' + canHan.graphObjMarked.x*0.001 + ']').onclick = function() {
                                    var tempx = prompt("enter new x cordinates", "");
                                    var tempy = prompt("enter new y cordinates", "");
                                    obj.moveTo(tempx, tempy);
                                };
                                self.addLi('toss', '').onclick = function() {
                                    self.listGraphObj.delete(obj);
                                };
    
                                self.addLi('FixedRollSupport', '').onclick = function() {
    
                                };
    
                                self.addLi('momentfreeSuport', '').onclick = function() {
    
                                };
    
                                break;
    
                            default:
    
                        }
                    };
                    this.clear = function() {
                        self.content.innerHTML = "";
                        self.list = [];
                    };
    
                }