import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MainpageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Demarket';
}
