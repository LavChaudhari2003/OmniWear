import { Component } from '@angular/core';
import { Header } from './header/header';
import { CatagoryNavigation } from './catagory-navigation/catagory-navigation';
import { SideNavigation } from './side-navigation/side-navigation';
import { Products } from '../products/products';
@Component({
  selector: 'app-home',
  imports: [Header,CatagoryNavigation,SideNavigation, Products],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
