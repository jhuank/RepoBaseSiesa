import { Injectable, Output, EventEmitter } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class ShareDataService {

	@Output() signOutEvent = new EventEmitter();
	@Output() focusOnInput = new EventEmitter();
  constructor(

  ) { }

	doSignOut(): void {
		this.signOutEvent.emit(true);
	}

	doFocusOnInput(): void {
		this.focusOnInput.emit(true);
	}
}
