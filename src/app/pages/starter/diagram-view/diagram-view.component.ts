import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as pako from "pako"
import {encode64} from './base64-encoder';
import {mouseWheelZoom, MouseWheelZoomConfig} from 'mouse-wheel-zoom';

@Component({
  selector: 'app-diagram-view',
  templateUrl: './diagram-view.component.html',
  styleUrls: ['./diagram-view.component.scss']
})
export class DiagramViewComponent implements OnChanges {
  @Input() plantUML: string;

  diagramRoute: string;
  svgFileUrl: SafeResourceUrl;
  pngFileUrl: SafeResourceUrl;
  constructor( private sanitizer: DomSanitizer) { }


  ngOnChanges(): void {
     this.setDiagramRoutes();
  }

  ngOnInit():void{
  }


  setDiagramRoutes(): void {
    let text = encode64(pako.deflate(this.plantUML, {level: 9}));
    this.diagramRoute ='https://www.plantuml.com/plantuml/svg/~1' + text;
    console.log(text);
    //this.diagramRoute = 'https://www.plantuml.com/plantuml/png/~1' + encode64(pako.deflate(this.plantUML, {level: 9}));
    //this.diagramRoute = 'https://www.plantuml.com/plantuml/svg/~1' + encode64(pako.deflate(this.plantUML, {level: 9}));
    setTimeout(()=>{
      this.zoomDiagram();
    },500)
  }

  zoomDiagram(){
    const wz = mouseWheelZoom({
      element:(<any>document.getElementById('diagram')),
      zoomStep: .4
    });
    wz.setSrc(this.diagramRoute);
  }

  toDataURL(url: RequestInfo): Promise<string> {
    return fetch(url).then((response) => {
      return response.blob();
    }).then(blob => {
      return window.URL.createObjectURL(blob);
    });
  }

}
