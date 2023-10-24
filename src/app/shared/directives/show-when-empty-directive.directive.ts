import { Directive, ViewContainerRef, ElementRef, TemplateRef, Input } from '@angular/core';

@Directive({
  selector: '[appShowWhenEmpty]'
})
export class ShowWhenEmptyDirective {
  constructor(
    private elementRef: ElementRef,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set appShowWhenEmpty(template: TemplateRef<any>) {
    if (this.isEmpty()) {
      this.viewContainer.createEmbeddedView(template);
    } else {
      this.viewContainer.clear();
    }
  }

  isEmpty(): boolean {
    const nodes = this.elementRef.nativeElement.childNodes;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes.item(i);
      if (node.nodeType !== 8 && nodes.item(i).textContent.trim().length !== 0) {
        return false;
      }
    }
    return true;
  }
}
