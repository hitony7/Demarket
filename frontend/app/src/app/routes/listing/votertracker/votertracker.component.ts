import { Component } from '@angular/core';

@Component({
  selector: 'app-votertracker',
  imports: [],
  templateUrl: './votertracker.component.html',
  styleUrl: './votertracker.component.scss'
})
export class VotertrackerComponent {


  upvotes = 0;
  downvotes = 0;

  upvote(): void {
    this.upvotes++;
  }

  downvote(): void {
    this.downvotes++;
  }
}
