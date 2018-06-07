import { Component, OnInit, Input } from '@angular/core';
import { Entity } from '../../_models/entity'

@Component({
  selector: 'app-entity-mini',
  templateUrl: './entity-mini.component.html',
  styleUrls: ['./entity-mini.component.css']
})
export class EntityMiniComponent implements OnInit {
  @Input() entity:Entity;
  constructor() { }

  ngOnInit() {
  }

}
