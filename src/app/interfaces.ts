
interface Time {
    id: number;
    selected: boolean;
    start: string;
    end: string;
  }
  
export interface Loop {
    videoId: string;
    videoTitle: string;
    times: Time[];
  }

export interface Speed {
    value: string;
    viewValue: string;
}