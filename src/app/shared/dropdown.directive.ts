import { Directive, ElementRef, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector: '[DropdownDirective]'
})

export class DropdownDirective{

    @HostBinding('class.open') isOpen = false; 

    @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
        this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false; //event.target is the element that triggered the event. It gives an html element that caused the event 
      }

      constructor(private elRef: ElementRef) {}
}