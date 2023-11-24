export interface Loop {
  videoId: string;
  videoTitle: string;
  times: Time[];
} 
export interface Time {
  id: number;
  selected: boolean;
  start: string;
  end: string;
}
  
export interface Speed {
  value: string;
  viewValue: string;
}

export interface VideoLink {
  url: string;
  title: string;
}