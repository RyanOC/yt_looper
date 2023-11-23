import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  libraryData: any;
  loading: boolean = false;
  errorMessage: any;
  //videoLinks: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getLibraryData();
  }

  // ngOnInit() {
  //   this.http.get<any[]>('path_to_your_json').subscribe(videos => {
  //     this.videoLinks = videos.map(video => 
  //       `http://localhost:4200/editor/#v=${video.videoId}&t=${encodeURIComponent(video.title)}&...otherParams...`);
  //   });
  // }

  getLibraryData(): void {
    this.loading = true;
    // http://localhost:4200/editor/#v=0fWTKslGOWY&t=Cult%20of%20Personality%20Guitar&&id=0&selected=true&start=0:00.00&end=0:02.79&&id=1&selected=false&start=0:58&end=1:02&&id=2&selected=false&start=0:00&end=0:00&&id=3&selected=false&start=0:00&end=0:00&&id=4&selected=false&start=0:00&end=0:00
    const jsonUrl = 'https://raw.githubusercontent.com/RyanOC/yt_looper/main/src/data/library.json';
    //const jsonUrl = 'https://swapi.dev/api/people/1/';
    this.http.get(jsonUrl).subscribe(
      (data) => {
        this.libraryData = data;
        console.log(this.libraryData);
        this.loading = false;
      },
      (error) => {
        this.errorMessage = error;
        this.loading = false;
      }
    );
  }
}