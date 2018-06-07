import { Component, OnInit, Input } from '@angular/core';
import { Entity } from '../../_models/entity'
import { RelationshipComponent } from '../relationship/relationship.component'
@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent implements OnInit {
  @Input() entity:Entity;
  constructor() { }

  ngOnInit() {
  }

}
