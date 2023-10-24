import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
    selector: '[appOnlyLetters]'
})
export class OnlyLettersDirective {
    private regex: RegExp = new RegExp(/^[ a-zA-ZÀ-ÿ\u00f1\u00d1]*$/g);
    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

    constructor(private el: ElementRef) {
    }

    @HostListener('keydown', [ '$event' ])
    onKeyDown(event: KeyboardEvent) {
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        const current: string = this.el.nativeElement.value;
        const next: string = current.concat(event.key);
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }

    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent) {
        event.preventDefault();
        const pastedInput: string = event.clipboardData
            .getData('text/plain')
            .replace(/\d/g, '');
        document.execCommand('insertText', false, pastedInput);
    }

    @HostListener('drop', ['$event'])
    onDrop(event: DragEvent) {
        event.preventDefault();
        const textData = event.dataTransfer
            .getData('text').replace(/\d/g, '');
        this.el.nativeElement.focus();
        document.execCommand('insertText', false, textData);
    }

}





