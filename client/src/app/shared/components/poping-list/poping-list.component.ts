import { Component } from '@angular/core';
import {Subscription} from "rxjs";
import {ThemeService} from "../../../services/theme.service";
import {MatDialog} from "@angular/material/dialog";

// @Component({
//   selector: 'app-poping-list',
//   templateUrl: './poping-list.component.html',
//   styleUrls: ['./poping-list.component.scss']
// })
// export class PopingListComponent {
//   private themeSubscription: Subscription;
//   isDarkMode: boolean | undefined;
//
//   constructor(private themeService: ThemeService, public dialog: MatDialog) {
//     this.themeSubscription = this.themeService.getThemeObservable().subscribe((isDarkMode) => {
//       this.isDarkMode = isDarkMode;
//     });
//   }
// }
