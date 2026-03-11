import { Component, computed, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar, faStarHalfStroke, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStarEmpty } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-ratings',
  imports: [FontAwesomeModule],
  templateUrl: './ratings.html',
  styleUrl: './ratings.css',
})
export class Ratings {

  score = input<number>(0);

  faStar: IconDefinition = faStar;
  faStarHalfStroke: IconDefinition = faStarHalfStroke;
  farStarEmpty: IconDefinition = farStarEmpty;


  // compute the number of full stars, half stars, and empty stars based on the score

  stars = computed(() => {
    const value = Math.min(this.score(), 5);
    const icons: IconDefinition[] = [];

    const solid = Math.floor(value);
    const half = value - solid >= 0.5 ? 1 : 0;
    const empty = 5 - solid - half;

    for (let i = 0; i < solid; i++) {
      icons.push(this.faStar);
    }
    if (half) {
      icons.push(this.faStarHalfStroke);
    }
    for (let i = 0; i < empty; i++) {
      icons.push(this.farStarEmpty);
    }
    return [...icons];
  })

}
