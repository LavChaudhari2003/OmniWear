import { Component } from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome'
import {faSearch} from '@fortawesome/free-solid-svg-icons/faSearch'
@Component({
  selector: 'app-header',
  imports: [FontAwesomeModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  faSearch = faSearch;
}
