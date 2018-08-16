import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Entity } from '../../_models/entity'

@Component({
  selector: 'app-entity-mini',
  templateUrl: './entity-mini.component.html',
  styleUrls: ['./entity-mini.component.css']
})
export class EntityMiniComponent implements OnInit {
  @Input() entity:Entity;
  @Output() link: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  clickedLink(event){
    console.log(event);
    this.link.emit(null);
    event.stopPropagation();
  }

}
