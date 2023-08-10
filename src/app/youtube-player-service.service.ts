import { Injectable, Output, EventEmitter } from '@angular/core';

let _window: any = window;

@Injectable()
export class YoutubePlayerService {
  
  public yt_player: any;
  private currentVideoId: any;

  @Output() videoChangeEvent: EventEmitter<any> = new EventEmitter(true);
  @Output() playPauseEvent: EventEmitter<any> = new EventEmitter(true);
  @Output() currentVideoText: EventEmitter<any> = new EventEmitter(true);

  constructor(
  ) {}

  // createPlayer(): void {
  //   // https://developers.google.com/youtube/iframe_api_reference
  //   this.yt_player = new new _window.YT.Player('yt-player', {
  //       height: '200',
  //       width: '300',
  //       videoId: 'drCd6QWOunQ',
  //       playerVars: { loop: 0 },     
  //       events: {
  //           'onReady': function() { alert('ready') },
  //       }
  //   });
  // }

  // onPlayerReady(event: any) {
  //   event.target.playVideo();
  // }

  // onPlayerStateChange(event: any) {
  //   const state = event.data;
  //   switch (state) {
  //     case 0:
  //       this.videoChangeEvent.emit(true);
  //       this.playPauseEvent.emit('pause');
  //       break;
  //     case 1:
  //       this.playPauseEvent.emit('play');
  //       break;
  //     case 2:
  //       this.playPauseEvent.emit('pause');
  //       break;
  //   }
  // }

  playVideo(videoId: string, videoText?: string): void {
    if (!this.yt_player) {
      //this.notificationService.showNotification('Player not ready.');
      return;
    }

    this.yt_player.setPlaybackRate(2.0);
    this.yt_player.loadVideoById(videoId);
    
    this.currentVideoId = videoId;
    this.currentVideoText.emit(videoText);
    //this.browserNotification.show(videoText);
  }

  // pausePlayingVideo(): void {
  //   this.yt_player.pauseVideo();
  // }

  // playPausedVideo(): void {
  //   this.yt_player.playVideo();
  // }

  // getCurrentVideo(): string {
  //   return this.currentVideoId;
  // }

  // resizePlayer(width: number, height: number) {
  //   this.yt_player.setSize(width, height);
  // }

  // getShuffled(index: number, max: number): any {
  //   if (max < 2) {
  //     return;
  //   }

  //   let i = Math.floor(Math.random() * max);
  //   return i !== index ? i : this.getShuffled(index, max);
  // }
}