import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ShoppingListService } from 'src/app/shared/services/shopping-list.service';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: true }) seForm: NgForm;
  subscription: Subscription;
  editMode: boolean = false;
  editModeIndex: number;
  editItem: Ingredient;

  constructor(private shoppingService: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.shoppingService.startedEditing.subscribe((i: number) => {
      this.editMode = true;
      this.editModeIndex = i;
      this.editItem = this.shoppingService.getIngredient(this.editModeIndex);
      this.seForm.setValue({
        name: this.editItem.name,
        amount: this.editItem.amount
      });
    });
  }

  onAddItem(form: NgForm) {
    const values = form.value;
    values.amount = values.amount || 0;
    const ingredient = new Ingredient(values.name, values.amount);
    if (this.editMode) {
      this.shoppingService.updateIngredient(this.editModeIndex, ingredient);
    } else {
      this.shoppingService.addToList(ingredient);
    }
    this.editMode = false;
    this.seForm.reset();
  }

  onClear() {
    this.editMode = false;
    this.seForm.reset();
  }

  onDelete() {
    this.shoppingService.deleteIngredient(this.editModeIndex);
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
