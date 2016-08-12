
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var AppComponent = (function () {
    function AppComponent(http, elementRef) {
        var _this = this;
        this.http = http;
        this.elementRef = elementRef;
        this.iSourceLat = 12.927880;
        this.iSourceLong = 77.627600;
        this.iDestinationLat = 13.035542;
        this.iDestinationLong = 77.597100;
        this.iDestinationTime = 2400;
        /* Returns the travel time from source to destination using google maps API*/
        this.findTravelTime = function () {
            var travelTime = _this.getTravelTime();
            return travelTime;
        };
        /*Returns the time taken by uber to pick up at source from the time of hitting the API*/
        this.findUberGoArrivalTime = function () {
            var uberArrivalTime;
            _this.getUberArrivalTime().subscribe(function (result) {
                console.log("uber", result);
                _this.responseUber = result;
                for (var i = 0; i < _this.responseUber.times.length; i++) {
                    if (_this.responseUber.times[i].display_name == "uberGO") {
                        uberArrivalTime = _this.responseUber.times[i].estimate;
                        _this.uberArrivalTime = uberArrivalTime;
                        console.log("uber arrival time", _this.uberArrivalTime);
                        return uberArrivalTime; //should return uberGO with least arrival time
                    }
                    else {
                        console.log(" No UberGO available");
                        return 0;
                    }
                }
            });
            return 0;
        };
        /*Returns the time when alert should be sent to user for booking*/
        // private calculateAlertTime = () => {
        //     let alertTime = this.iDestinationTime - this.findTravelTime() - this.findUberGoArrivalTime();
        //     console.log("alert time is", alertTime);
        //     return alertTime;
        // };
        /*Returns the time when user should start his ride and depart from source*/
        this.findDepartureTime = function () {
            var departureTime = _this.iDestinationTime - _this.findTravelTime();
            return departureTime;
        };
        this.checkUber = function () {
            var that = _this;
            var date = new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            //let currentTime = 0;
            var currentTime = hours * 3600 + minutes * 60 + seconds;
            var waitingTime = _this.findDepartureTime() - currentTime;
            //let waitingTime = 700;
            var nextUberPoll;
            if (waitingTime > 3600) {
                nextUberPoll = _this.findUberPollingTime();
            }
            else {
                var uberArrivalTime = _this.findUberGoArrivalTime();
                //let uberArrivalTime = 401;
                if (waitingTime < uberArrivalTime) {
                    console.log("You won't reach destination on time");
                    return;
                }
                else {
                    if (waitingTime == uberArrivalTime) {
                        alert("Book Immediately");
                        return;
                    }
                    if ((waitingTime - uberArrivalTime) < 180) {
                        alert("Book Now");
                        return;
                    }
                    else if ((waitingTime - uberArrivalTime) < 300) {
                        console.log("check after 2 mins");
                        nextUberPoll = 120000;
                        waitForNextUberPoll();
                    }
                    else if ((waitingTime - uberArrivalTime) < 600) {
                        console.log("check after 4 mins");
                        nextUberPoll = 240000;
                        waitForNextUberPoll();
                    }
                    else if ((waitingTime - uberArrivalTime) < 900) {
                        console.log("check after 6 mins");
                        nextUberPoll = 360000;
                        waitForNextUberPoll();
                    }
                    else if ((waitingTime - uberArrivalTime) < 1200) {
                        console.log("check after 9 mins");
                        nextUberPoll = 540000;
                        waitForNextUberPoll();
                    }
                    else if ((waitingTime - uberArrivalTime) < 1800) {
                        console.log("check after 0.4*difference mins");
                        nextUberPoll = (waitingTime - uberArrivalTime) * 0.4 * 1000;
                        console.log("next check in ", nextUberPoll / 1000);
                        waitForNextUberPoll();
                    }
                    function waitForNextUberPoll() {
                        setTimeout(function () {
                            console.log("inside waiting function");
                            that.checkUber();
                        }, nextUberPoll);
                    }
                }
            }
        };
        /*something which returns 1 hour prior to departure time but -3600 is dangerous*/
        this.findUberPollingTime = function () {
            var uberPollingTime = _this.departureTime - 3600; //start looking for cabs 60 mins before departure time
            return uberPollingTime;
        };
    }
    ;
    AppComponent.prototype.ngOnChanges = function () {
        var i = 0;
        console.log("something changed" + i);
        i++;
    };
    ;
    AppComponent.prototype.onSubmit = function (value) {
        this.iSourceLat = value.iSourceLat || this.iSourceLat;
        this.iSourceLong = value.iSourceLong || this.iSourceLong;
        this.iDestinationLat = value.iDestinationLat || this.iDestinationLat;
        this.iDestinationLong = value.iDestinationLong || this.iDestinationLong;
        this.iEmail = value.iEmail;
        this.iDestinationTime = value.iDestinationTime || this.iDestinationTime;
        //console.log(value);
        //this.alertTime= this.calculateAlertTime();
        //this.checkUber();
        this.findDepartureTime();
        this.uberArrivalTime = this.findUberGoArrivalTime();
        console.log("result uberArr time", this.uberArrivalTime);
    };
    ;
    AppComponent.prototype.getTravelTime = function () {
        var _this = this;
        var urlg = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + this.iSourceLat + "," + this.iSourceLong + "&destinations=" + this.iDestinationLat + "," + this.iDestinationLong + "&key=AIzaSyB6ky0s6kmaxH15hsxsNHKuZeI6n_OG2eA";
        console.log("hitting maps api", urlg);
        this.http.get(urlg)
            .map(function (res) { return res.json(); })
            .subscribe(function (result) {
            console.log("maps", result);
            _this.responseMaps = result;
            console.log("travel time", _this.responseMaps.rows[0].elements[0].duration.value);
            return _this.responseMaps.rows[0].elements[0].duration.value;
        });
    };
    AppComponent.prototype.getUberArrivalTime = function () {
        var urlu = "https://api.uber.com/v1/estimates/time?server_token=ECWcv5urK26d-pz-OHio9c9ovHpahx4UBbQIzMTi&start_latitude=" + this.iSourceLat + "&start_longitude=" + this.iSourceLong;
        console.log("hitting uber api");
        var uberArrivalTime;
        return this.http.get(urlu)
            .map(function (res) { return res.json(); });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], AppComponent.prototype, "iSourceLat", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], AppComponent.prototype, "iSourceLong", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], AppComponent.prototype, "iDestinationLat", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], AppComponent.prototype, "iDestinationLong", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], AppComponent.prototype, "iDestinationTime", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], AppComponent.prototype, "iEmail", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], AppComponent.prototype, "iresult", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], AppComponent.prototype, "responseMaps", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], AppComponent.prototype, "responseUber", void 0);
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: "<h1> It's time to book an Uber</h1>\n                <form #form=\"ngForm\" (ngSubmit)=\"onSubmit(form.value)\">\n                <div class=\"form-group\">\n                <label for=\"iSourceLat\">source latiude</label><input type=\"text\" id=\"iSourceLat\" name=\"iSourceLat\" ngModel value=\"18.578533\">                \n                <label for=\"iSourceLong\">source longitude</label><input type=\"text\" id=\"iSourceLong\" name=\"iSourceLong\" ngModel value=\"73.785633\">\n                </div>\n                <br/>\n                <div class=\"form-group\">\n                <label for=\"iDestinationLat\">Destination latiude</label><input type=\"text\" id=\"iDestinationLat\" name=\"iDestinationLat\" ngModel value=\"18.639133, \">                \n                <label for=\"iDestinationLong\">Destination longitude</label><input type=\"text\" id=\"iDestinationLong\" name=\"iDestinationLong\" ngModel value=\"73.792238\">\n                </div>\n                <br/>\n                <div class=\"form-group\">\n                <label for=\"iDestinationTime\">Time to reach at</label><input type=\"text\" id=\"iDestinationTime\" name=\"iDestinationTime\" ngModel>\n                </div>\n                <br/>\n                <div class=\"form-group\">\n                <label for=\"iEmail\">Email id</label><input type=\"text\" id=\"iEmail\" name=\"iEmail\" ngModel>\n                </div>\n                <button type=\"submit\" class=\"btn btn-default\">Remind Me</button>\n                </form>\n                <h2>{{result}}</h2>\n               "
        }),
        __param(1, core_1.Inject(core_1.ElementRef)), 
        __metadata('design:paramtypes', [http_1.Http, core_1.ElementRef])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map