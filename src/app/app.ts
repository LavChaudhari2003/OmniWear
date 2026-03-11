import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/home/header/header'; 
import { CatagoryNavigation } from './components/home/catagory-navigation/catagory-navigation';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header,CatagoryNavigation],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('OmniWear');
}
