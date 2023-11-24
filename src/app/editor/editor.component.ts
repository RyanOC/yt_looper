import { Component, NgZone, ElementRef, HostListener,  ViewChildren, QueryList, OnDestroy, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as Interfaces from './../interfaces';
import * as Constants from './../constants';
import { EditorService } from './../editor.service'; 
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

let _window: any = window;

interface VideoLink {
  url: string;
  title: string;
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnDestroy {
  

  constructor(private ngZone: NgZone, private editorService: EditorService, private http: HttpClient){}

  @ViewChildren('timeInputs') timeInputs: QueryList<ElementRef<HTMLInputElement>> | undefined;
  @ViewChild('clearDiv') divToClear!: ElementRef;

  player: any;
  selectedSpeedValue: any = Constants.INIT_SELECTED_SPEED_VALUE;
  selectedIndex: number = Constants.FIRST_INDEX;
  startTime: number = Constants.INIT_START_TIME;
  endTime: number = Constants.INIT_END_TIME;
  loop: Interfaces.Loop = Constants.INIT_LOOP;
  speeds: Interfaces.Speed[] = Constants.SPEEDS;
  timeoutInterval: number | undefined = Constants.INIT_TIMEOUT_INTERVAL;
  currentTimeMessage: string = Constants.INIT_TIME_MESSAGE;
  timeInterval: any;
  isLoopChecked: boolean = true;
  currentTimeMessage$: BehaviorSubject<string> = new BehaviorSubject<string>(Constants.INIT_TIME_MESSAGE);
  formColor: string = "#fff";

  libraryData: any;
  loading: boolean = false;
  errorMessage: string = '';
  videoLinks: VideoLink[] = [];

@HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const keyCode = event.keyCode || event.which;
    const arrow = { left: 37, up: 38, right: 39, down: 40 };
    const activeElement = event.target as HTMLInputElement;

    if (activeElement.classList.contains('time-input')) {

      let idParts = activeElement.id.split('_');
      let direction = idParts[0];
      let skipToEnd = false;

      switch (keyCode) {
        case arrow.up:
          this.changeSelectedBit(activeElement, 0.01);
          if(direction == "time-input-end") skipToEnd = true; //skip to end...
          this.startTimeManager(true, skipToEnd);       
          break;
        case arrow.down:
          this.changeSelectedBit(activeElement, -0.01);
          if(direction == "time-input-end") skipToEnd = true; //skip to end...
          this.startTimeManager(true, skipToEnd);
          break;
        case 13: // enter key
          if (activeElement.id.includes("time-input-end_")) {
            // play the last few seconds to help perfect the loop...
            if(direction == "time-input-end") skipToEnd = true;
            this.startTimeManager(true, skipToEnd);
          }
      }
    }
  }

  // lifecycle
  ngOnInit() {
    // get library data, and use the first index as default...
    this.getLibraryData().subscribe(
      loopData => {
        this.loop = loopData;
        document.title = Constants.DOC_TITLE_PREFIX + loopData.videoTitle;
        this.editorService.loadStateFromHash(loopData.times);
      },
      error => {
        // Handle the error
        console.error(error);
      }
    );  
  
    // If the YouTube API is already loaded, directly call the initialization function
    if (window['YT'] && window['YT'].Player) {
      this.onYouTubePlayerAPIReady();
    } else {
      // If the YouTube API is not loaded, set the callback which the YouTube IFrame player API will call
      window.onYouTubeIframeAPIReady = () => {
        this.onYouTubePlayerAPIReady();
      };
    }
  }

  ngAfterContentInit() {
    let url = "https://www.youtube.com/iframe_api";
    var scripts = document.getElementsByTagName('script');

    for (var i = scripts.length; i--;) {
      if (scripts[i].src == url) {
        return;
      }
    }

    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api"; // target/origin errors will be thrown if ssl and non ssl are used between the youtube api url and the host url runnning this application
    var firstScriptTag:any = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  ngOnDestroy(): void {
    this.clearDivContent();
    clearInterval(this.timeInterval); 
    this.destroyPlayer();
  }

  private clearDivContent(): void {
    if (this.divToClear && this.divToClear.nativeElement) {
      this.divToClear.nativeElement.innerHTML = '';
    }
  }

  onYouTubePlayerAPIReady(): void {
    this.player = new window.YT.Player('player', {
      height: '100%',
      width: '100%',
      videoId: this.loop.videoId,
      playerVars: { 
        loop: 0, 
        autoplay: 0, 
        controls: 1, 
        autohide: 1, 
        wmode: 'opaque',
        // Add the 'enablejsapi' parameter to enable the player's JavaScript API
        enablejsapi: 1 
      },
      events: {
        'onReady': this.onPlayerReady.bind(this)
      }
    });
  }

  onPlayerReady(e:any) {
    this.loop.times[0].selected = true; //auto select the first time range
    this.startTimeManager(true);
  }

  onPlayerStateChange(e:any) {
    if (e.data == 2) {
        // player stopped (1 is stopped) 
        clearInterval(this.timeInterval);    
    }
    else if(e.data == 1){
      // player started
      this.startTimeManager(false);
    }
  }

  // player actions
  changeSelectedBit(input: HTMLInputElement, incAmount: any) {

    let timeParts = input.value.split(':');
    let seconds: number;
    let minutes: number;
    let idParts = input.id.split('_');

    if(timeParts.length > 1){
      minutes = parseInt(timeParts[0]);
      seconds = parseFloat(timeParts[1]);    
    }
    else{
      minutes = 0;
      seconds = parseFloat(timeParts[0]);      
    }

    var el = input;
    var currentSecondsValue = seconds;

    var newSecondsValue = (currentSecondsValue + incAmount);
  
    if (minutes > 0 || newSecondsValue >= 0) {

      if (newSecondsValue >= 59.99){
        newSecondsValue = 0;
        minutes += 1;
      }
      else if (newSecondsValue < 0){
        newSecondsValue = 59.95;
        minutes -= 1;
      }

      newSecondsValue = newSecondsValue.toFixed(2);
      newSecondsValue = this.editorService.formatNumberWithLeadingZero(newSecondsValue);
      el.value =  `${minutes}:${newSecondsValue}`;

      if(idParts[0] == "time-input-start"){
        this.loop.times[parseInt(idParts[1])].start = `${minutes}:${newSecondsValue}`;
      }
      else{
        this.loop.times[parseInt(idParts[1])].end = `${minutes}:${newSecondsValue}`;
      }
    }
  }

  onSpeedSelection(){
    this.player.setPlaybackRate(parseFloat(this.selectedSpeedValue));
  }

  startTimeManager(startPlayer: boolean, skipToEnd?: boolean) {
    clearInterval(this.timeInterval);
    clearInterval(this.timeInterval);

    this.startTime = this.editorService.convertTime(this.loop.times[this.selectedIndex].start);
    this.endTime = this.editorService.convertTime(this.loop.times[this.selectedIndex].end);

    // using ngZone to help change detection since it is missed from the async method on the window event.
    this.ngZone.runOutsideAngular(() => {
      const intervalId = setInterval(() => {
        this.ngZone.run(() => {
          var message = this.TrackCurrentVideoTime();
          this.currentTimeMessage$.next(message);
        });
      }, this.timeoutInterval);
    });

    if(startPlayer){    
      if(skipToEnd){
        this.player.loadVideoById(this.loop.videoId, this.endTime - 2); // go to the last 2 seconds
      }
      else{
        this.player.loadVideoById(this.loop.videoId, this.startTime);
      }
      
      this.player.playVideo(); 
    }  
  }

  selectBit(event:any, time:any) {
    if(time && time.id != -1){
      this.loop.times[this.selectedIndex].selected = false;
      this.selectedIndex = time.id;  
      this.loop.times[time.id].selected = true;
    }
    else if(!time){
      return;
    }
    this.startTimeManager(true);
  }

  TrackCurrentVideoTime() {
      let currentTime = this.player.getCurrentTime();

      if(!currentTime) currentTime = 0;

      if (currentTime >= this.endTime) {          
          if(this.isLoopChecked){
            this.player.seekTo(this.startTime);    
          }
          else{
            clearInterval(this.timeInterval); 
            this.player.stopVideo(); 
          }         
      }

      try {
        currentTime = (currentTime == undefined ? 0 : currentTime.toFixed(2));
      }
      catch (ex) {
          console.log(ex);
      }

      var minutes = Math.floor(currentTime / 60);
      var seconds = (currentTime % 60).toFixed(2);

      return minutes + ":" + seconds;
  }

  getLibraryData(): Observable<Interfaces.Loop> {
    this.loading = true;
    const jsonUrl = 'https://raw.githubusercontent.com/RyanOC/yt_looper/main/src/data/library.json';

    return this.http.get(jsonUrl).pipe(
      map((response: any): Interfaces.Loop => {
        if (response && response.library && Array.isArray(response.library) && response.library.length > 0) {
          const firstVideoEntry = response.library[0]; // Get only the first item from the array
          const videoId = Object.keys(firstVideoEntry)[0];
          const paramsString = firstVideoEntry[videoId];
          const titleMatch = paramsString.match(/t=([^&]*)/);
          const videoTitle = titleMatch ? decodeURIComponent(titleMatch[1]) : 'Unknown Title';

          // Extract times data
          const timesData = paramsString.split('&&').slice(1); // split the params string by '&&' and ignore the first element which is the title
          const times: Interfaces.Time[] = timesData.map((paramString: string) => {
            const params = paramString.split('&').reduce((acc, current) => {
              const [key, value] = current.split('=');
              if (key && value) {
                acc[key] = decodeURIComponent(value);
              }
              return acc;
            }, {} as any);

            // Convert params into Time object
            return {
              id: parseInt(params.id),
              selected: params.selected === 'true',
              start: params.start,
              end: params.end
            };
          });

          return {
            videoId: videoId,
            videoTitle: videoTitle.trim() === '' ? 'Create New Loop' : videoTitle,
            times: times
          };
        } else {
          throw new Error('Data is not in the expected format or the array is empty');
        }
      }),
      catchError((error) => {
        this.errorMessage = error.message || 'An error occurred while loading the library';
        return throwError(() => error);
      }),
      finalize(() => {
        this.loading = false;
      })
    );
  }

  // persistance
  save(){
   // <a href="#" id="seek" (click)="SetVideoId(true)">set</a><br />
    this.startTimeManager(true);
    document.title = Constants.DOC_TITLE_PREFIX + this.loop.videoTitle;
    this.editorService.saveStateToHash(this.loop);
    this.selectBit(null, null);
  }

  // cleanup
  destroyPlayer(): void {
    if (this.player) {
      this.player.destroy();
    }
  }
}