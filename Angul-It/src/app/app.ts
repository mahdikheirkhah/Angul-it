import { Component } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { routeAnimations } from './animations'; // 1. Import our animation

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [routeAnimations] // 2. Add the animation to the component
})
export class App {
  title = 'Angul-It';

  // 3. Inject the contexts
  constructor(private contexts: ChildrenOutletContexts) {}

  // 4. Create the method to get the animation data
  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}