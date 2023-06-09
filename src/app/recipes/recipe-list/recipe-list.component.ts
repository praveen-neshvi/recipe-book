import { Component, EventEmitter, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent {

  @Output() recipeWasSelected = new EventEmitter<Recipe>();

  recipes: Recipe[] = [
    new Recipe('A test recipe', ' This is simply a test', 
    'https://www.simplyrecipes.com/thmb/4_wTLA6Q_2o7dgNO-ze0w7oeX_w=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Simply-Recipes-Homemade-Pizza-Dough-Lead-Shot-1b-ea13798d224048b3a28afb0936c9b645.jpg'),
    new Recipe('A test recipe', ' This is simply a test', 
    'https://sipbitego.com/wp-content/uploads/2021/08/Pepperoni-Pizza-Recipe-Sip-Bite-Go.jpg')
   ];

  onRecipeSelected(recipe){
    this.recipeWasSelected.emit(recipe);
  }

}
