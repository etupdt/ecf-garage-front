import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[orientable]'
})
export class OrientableDirective implements OnInit {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { }


  ngOnInit(): void {
    if(this.el.nativeElement.naturalHeight > this.el.nativeElement.naturalWidth){
      this.renderer.addClass(this.el.nativeElement, "image-v")
    } else {
      this.renderer.addClass(this.el.nativeElement, "image-h")
    }
  }

}
