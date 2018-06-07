import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-relationship',
  templateUrl: './relationship.component.html',
  styleUrls: ['./relationship.component.css']
})
export class RelationshipComponent implements OnInit {
  @Input() relationship: {dest:string, relationship:string, src:string};
  constructor() { }

  ngOnInit() {
  }

}
