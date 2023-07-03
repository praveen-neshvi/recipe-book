import { Component, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent {
  @Output() newItems = new EventEmitter<Ingredient>();

  @ViewChild('NameInput') name : ElementRef;
  @ViewChild('AmountInput') amount: ElementRef; 

  OnAdd(){
    const IngName = this.name.nativeElement.value;
    const IngAmount = this.amount.nativeElement.value;
    const newIngredient = new Ingredient(IngName, IngAmount);
    this.newItems.emit(newIngredient)
  }
}
