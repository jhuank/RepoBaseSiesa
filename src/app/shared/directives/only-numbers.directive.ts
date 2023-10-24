import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {

    private regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
    constructor(private el: ElementRef) {
    }

    @HostListener('keydown', [ '$event' ])
    onKeyDown(event: KeyboardEvent) {
        if (
            // permite: Delete, Backspace, Tab, Escape, Enter
            [46, 8, 9, 27, 13].indexOf(event.keyCode) !== -1 || 
            (event.keyCode === 65 && event.ctrlKey === true) || // Allow: Ctrl+A
            (event.keyCode === 67 && event.ctrlKey === true) || // Allow: Ctrl+C
            (event.keyCode === 86 && event.ctrlKey === true) || // Allow: Ctrl+V
            (event.keyCode === 88 && event.ctrlKey === true) || // Allow: Ctrl+X
            (event.keyCode === 65 && event.metaKey === true) || // Cmd+A (Mac)
            (event.keyCode === 67 && event.metaKey === true) || // Cmd+C (Mac)
            (event.keyCode === 86 && event.metaKey === true) || // Cmd+V (Mac)
            (event.keyCode === 88 && event.metaKey === true) || // Cmd+X (Mac)
            (event.keyCode >= 35 && event.keyCode <= 39) // Home, End, Left, Right
        ) {
            return;  // deja pasar los datos
        }
        let current: string = this.el.nativeElement.value;
        if (
            (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) &&
            (event.keyCode < 96 || event.keyCode > 105)
        )
        {
            event.preventDefault();
        }
        if(current.match(this.regex) === null){
            this.el.nativeElement.value = '';
        }
    }

    @HostListener('paste', ['$event'])
    onPaste(event: ClipboardEvent) {
        event.preventDefault();
        const pastedInput: string = event.clipboardData
            .getData('text/plain')
            .replace(/\D/g, ''); // get a digit-only string
        document.execCommand('+', false, pastedInput);
    }

    @HostListener('drop', ['$event'])
    onDrop(event: DragEvent) {
        event.preventDefault();
        const textData = event.dataTransfer
            .getData('text').replace(/\D/g, '');
        this.el.nativeElement.focus();
        document.execCommand('insertText', false, textData);
    }

    @HostListener("blur", ['$event'])
    onBlur(event: FocusEvent) {
        let current: String = this.el.nativeElement.value;
        if(current.match(this.regex) === null){
            this.el.nativeElement.value = '';
        }
    }

}





