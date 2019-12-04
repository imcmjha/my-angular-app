import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { DataStorageService } from '../shared/services/data-storage.service';
import { RecipeService } from '../shared/services/recipe.service';
import { AuthService } from '../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;
  private isAuthenticated: boolean = false;

  constructor(
    private serverService: DataStorageService,
    private authService: AuthService
    ) {}

  ngOnInit() {
    this.userSubscription = this.authService.authenticatedUser.subscribe(user => {
      this.isAuthenticated = !!user;
      // console.log(user, this.isAuthenticated);
    });
  }

  onSaveData() {
    this.serverService.saveRecipes();
  }

  onLogout() {
    this.authService.logout();
  }

  onFetchData() {
    this.serverService.fetchRecipes().subscribe();
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
