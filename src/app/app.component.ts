import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'recipe-book';
  loadedFeature : string = 'recipe';

  onNavigate(feature: any){
    console.log(feature);
    this.loadedFeature = feature;
  }
}
