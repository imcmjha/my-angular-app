import { ElementRef, Directive, OnInit, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[hoverHignlight]'
})
export class HoverHighlightDirective implements OnInit {
  constructor(private elementRef: ElementRef, private renderer: Renderer2){}

  ngOnInit() {
    
  }

  @HostListener('mouseenter') mounseenter() {
    this.applyStyle('red');
  }

  @HostListener('mouseleave') mouseLeave() {
    this.applyStyle('#777');
  }

  private applyStyle(color: string) {
    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', color);
  }
}