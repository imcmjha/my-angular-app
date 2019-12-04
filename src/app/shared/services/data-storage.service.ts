import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { RecipeService } from './recipe.service';
import { Recipe } from 'src/app/recipes/recipe.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  private endPointURL: string = 'https://recipe-book-51833.firebaseio.com/';
  private url = `${this.endPointURL}/recipes.json`;

  constructor(
    private httpClient: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) { }

  public saveRecipes() {
    const recipes: Recipe[] = this.recipeService.getRecipes();
    this.httpClient.put(this.url, recipes).subscribe();
  }

  public fetchRecipes() {
    return this.httpClient.get<Recipe[]>(
      this.url
    ).pipe(
      map((recipes) => {
        return recipes.map(rec => {
          return { ...rec, ingredients: rec.ingredients ? rec.ingredients : [] };
        });
      }),
      tap((recipes) => {
        this.recipeService.setRecipes(recipes);
      }));
  }
}
