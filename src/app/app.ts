import { Component, signal } from '@angular/core';
import { Vente } from './vente/vente';

@Component({
  selector: 'app-root',
  imports: [Vente],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('restaurant-gestion');
}
