import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private isDarkTheme: boolean = false;
  private themeSubject = new BehaviorSubject<boolean>(this.isDarkTheme);

  constructor() { }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
    this.themeSubject.next(this.isDarkTheme);
  }

  isDarkMode() {
    return this.isDarkTheme;
  };

  getThemeObservable() {
    return this.themeSubject.asObservable();
  }
}
