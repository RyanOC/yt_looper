import * as Interfaces from './interfaces';

export const DOC_TITLE_PREFIX: string = 'YouTube Looper - '
export const PLAYER_TITLE_PREFIX: string = 'YouTube Looper -';

export const ON_READY = 'onReady';
export const ON_STATE_CHANGE = 'onStateChange';

export const INIT_TIMEOUT_INTERVAL: number = 10;
export const FIRST_INDEX: number = 0;
export const INIT_START_TIME: number = 0;
export const INIT_END_TIME: number = 0;
export const INIT_SPEED: string = '0';
export const INIT_TIME_MESSAGE: string = "00:00";
export const INIT_SELECTED_SPEED_VALUE: string = "1.0";

export const PLAYER_STOPED: number = 1;
export const PLAYER_STARTED: number = 2;
export const SECONDS_IN_MINUTE: number = 60;
 
export const SPEEDS: Interfaces.Speed[] = [
    { value: '0.25', viewValue: '0.25' },
    { value: '0.5', viewValue: '0.5' },
    { value: '0.75', viewValue: '0.75' },
    { value: '1.0', viewValue: '1.0' },
    { value: '1.5', viewValue: '1.5' },
    { value: '2.0', viewValue: '2.0' },
];

export const INIT_LOOP: Interfaces.Loop = {
  videoId: '',
  videoTitle: '',
  times: []
};
