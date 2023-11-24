import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface VideoLink {
  url: string;
  title: string;
}

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  libraryData: any;
  loading: boolean = false;
  errorMessage: string = '';
  videoLinks: VideoLink[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getLibraryData();
  }

  getLibraryData(): void {
    this.loading = true;
    const jsonUrl = 'https://raw.githubusercontent.com/RyanOC/yt_looper/main/src/data/library.json';
    this.http.get(jsonUrl).subscribe(
      (response: any) => { // Added type any here to handle the response in a more generic way
        // Check if the response contains the 'library' property and it's an array
        if (response && response.library && Array.isArray(response.library)) {
          this.videoLinks = response.library.map((item: any) => {
            console.log(item);
            const videoId = Object.keys(item)[0];
            const params = item[videoId];
            const titleMatch = params.match(/t=([^&]*)/);
            const title = titleMatch ? decodeURIComponent(titleMatch[1]) : 'Unknown Title';
            return {
              url: `editor/#v=${videoId}&t=${encodeURIComponent(title)}&${params}`,
              title: title.trim() === '' ? 'Create New Loop' : title
            };
          });
        } else {
          throw new Error('Data is not in the expected format');
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.errorMessage = error.message || 'An error occurred while loading the library';
      }
    );
  }
}
