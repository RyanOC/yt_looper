import { TestBed } from '@angular/core/testing';

import { YoutubePlayerServiceService } from './youtube-player-service.service';

describe('YoutubePlayerServiceService', () => {
  let service: YoutubePlayerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YoutubePlayerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
