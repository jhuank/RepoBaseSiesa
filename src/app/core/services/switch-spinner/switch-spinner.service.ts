import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class SwitchSpinnerService {
    private switch = false;

    constructor() { }

    get state() {
        return this.switch;
    }

    on() {
        this.switch = true;
    }

    off() {
        this.switch = false;
    }
}