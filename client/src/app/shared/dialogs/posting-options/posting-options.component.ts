import {Component, Inject, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ThemeService} from "../../../services/theme.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";

@Component({
    selector: 'app-posting-options',
    templateUrl: './posting-options.component.html',
    styleUrls: ['./posting-options.component.scss']
})
export class PostingOptionsComponent implements OnInit{
    private themeSubscription: Subscription;
    isDarkMode: boolean | undefined;

    receivedData: any;

    selectedChannel: any = '';


    constructor(private themeService: ThemeService,
                public dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.themeSubscription = this.themeService.getThemeObservable().subscribe((isDarkMode) => {
            this.isDarkMode = isDarkMode;
        });
    }

    ngOnInit() {
        this.receivedData = this.data;
    }

    selectChannel() {
        sessionStorage.setItem('posting-channel', this.selectedChannel);
        this.selectedChannel = '';
        this.dialog.closeAll();
    }
}
