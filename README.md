import { Component, ElementRef, HostListener, Renderer2, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-your-component',
  template: `
    <input type="text" [(ngModel)]="time.s" [value]="time.s" class="time-input">
    <input type="text" [(ngModel)]="time.e" [value]="time.e" class="time-input">
    <!-- Additional sets of text boxes -->
    <input type="text" [(ngModel)]="time.x" [value]="time.x" class="time-input">
    <input type="text" [(ngModel)]="time.y" [value]="time.y" class="time-input">
  `
})
export class YourComponent {
  @ViewChildren('timeInputs') timeInputs: QueryList<ElementRef<HTMLInputElement>>;

  time = {
    s: '',
    e: '',
    x: '',
    y: ''
  };

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.timeInputs.forEach((input: ElementRef<HTMLInputElement>) => {
      this.renderer.addClass(input.nativeElement, 'time-input-target');
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const keyCode = event.keyCode || event.which;
    const arrow = { left: 37, up: 38, right: 39, down: 40 };
    const activeElement = document.activeElement as HTMLElement;

    if (activeElement.classList.contains('time-input-target')) {
      switch (keyCode) {
        case arrow.up:
          this.change(activeElement, 0.01);
          break;
        case arrow.down:
          this.change(activeElement, -0.01);
          break;
      }
    }
  }

  change(input: HTMLInputElement, incAmount: number) {
    const parts = input.value.split(':');
    // Rest of the logic remains the same
  }
}
