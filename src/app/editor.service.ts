import { Injectable } from '@angular/core';
import * as Constants from './constants';

@Injectable({
  providedIn: 'root'
})
export class EditorService { 

  constructor() { }

  convertTime(input:any) {
    var parts = input.split(':'),
        minutes = +parts[0],
        seconds = +parts[1];
    return (minutes * 60 + seconds);
  }

  serializeTimes(times:any){
    var timesString = '';
    times.forEach(function(element:any) {
      if(element.e != '0:00'){
        var queryString = Object.keys(element).map(key => key + '=' + element[key]).join('&');
        timesString += queryString + ',';
      }
    });

    timesString = timesString.replace(/(^,)|(,$)/g, ""); 
    return timesString;
  }

  parseParams(str:any) {
    return str.split('&').reduce(function (params:any, param:any) {
        var paramSplit = param.split('=').map(function (value:any) {
            return decodeURIComponent(value.replace('+', ' '));
        });
        params[paramSplit[0]] = paramSplit[1];
        return params;
    }, {});
  }

  serializeLoop(loop:any){
    var loopString = 'v=' + loop.videoId + '&' + 't=' + loop.videoTitle;
    return loopString;
  }

  formatNumberWithLeadingZero(value: number): string {
    let formattedValue: string;
  
    if (isNaN(value)) {
      formattedValue = "00";
    } else {
      const intValue = Math.floor(Math.abs(value)); // Extract the integer part
      const formattedIntValue = intValue.toString().padStart(2, '0'); // Add leading zero if necessary
      const decimalPart = Math.abs(value) - intValue; // Extract the decimal part
  
      formattedValue = `${formattedIntValue}${decimalPart.toFixed(2).substr(1)}`;
    }
  
    return formattedValue;
  }

  loadStateFromHash(loop:any){
    var hash = window.location.hash.substr(1);

    if(hash != ''){
      var res = hash.split('&&');
      var loopDetails = this.parseParams(res[0]);

      loop.videoId = loopDetails.v;
      loop.videoTitle = loopDetails.t;

      document.title = Constants.DOC_TITLE_PREFIX + loop.videoTitle;

      res.forEach((item: any) => {
        var time = this.parseParams(item);
        if (time.id !== undefined) {
          loop.times[time.id].selected = false;
          loop.times[time.id].start = time.start;
          loop.times[time.id].end = time.end;
        }
      });

      loop.times[0].selected = true;
    }
  }

  saveStateToHash(loop:any){

    let loopClone = JSON.parse(JSON.stringify(loop))

    delete loopClone.times[0].selected;
    delete loopClone.times[1].selected;
    delete loopClone.times[2].selected;
    delete loopClone.times[3].selected;
    delete loopClone.times[4].selected;

    var urlStateString = (this.serializeLoop(loop) + '&&' + this.serializeTimes(loop.times));

    urlStateString = urlStateString.replace(/,/g, '&&');
    urlStateString = urlStateString.replace(/&sl=true/g, '');
    urlStateString = urlStateString.replace(/&sl=false/g, '');

    setTimeout(function (e:any) {
        window.location.hash = e;
    }, 10, urlStateString);
  }
}