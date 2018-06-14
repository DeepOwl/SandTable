import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Entity } from '../_models/entity'
import { Campaign, CampaignId } from '../_models/campaign'
import {Subject} from 'rxjs/Subject';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private campaignCollection: AngularFirestoreCollection<Campaign>;
  private entitySubject = new Subject<string>();
  entityChanged$ = this.entitySubject.asObservable();
  constructor(private afs: AngularFirestore) { }
  entityId:string;
  campaignId:string;
  getEntities():Observable<any>{
     //return this.afs.collection('campaigns').doc(campaignId).collection('entities').valueChanges();
     //var entityCollection = afs.collection<Campaign>('campaigns');
     return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').snapshotChanges().pipe(
       map(actions => actions.map(a => {
         const data = a.payload.doc.data() as Entity;
         const id = a.payload.doc.id;
         return { id, ...data };
       }))

     );

  }

  getEntity(entityId:string):Observable<Entity>{
     return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').doc<Entity>(entityId).snapshotChanges().pipe(
       map(a => {
         console.log(a);
         if(a.payload.exists){
           const data = a.payload.data() as Entity;
           const id = a.payload.id;
           return {id, ...data }
         }
       })

     );
  }

  getCampaignList(){
    this.campaignCollection = this.afs.collection<Campaign>('campaigns');
    return this.campaignCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Campaign;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))

    );
  }

  getRelationships(){
    return this.afs.collection<Campaign>('campaigns').doc(this.campaignId).collection('relationships', ref=>ref.where("src",'==',this.entityId)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))

    );
  }

  setCampaignId(id:string){
    this.campaignId = id;
  }
  setEntityId(id:string){
    this.entityId = id;
    this.entitySubject.next(id);
  }

  addRelationship(srcEntity: Entity, relationship:string, destEntity:Entity){
    var newRelationship = {src:srcEntity.id, relationship:relationship, dest:destEntity.id }
    console.log(newRelationship);
    return this.afs.collection('campaigns').doc(this.campaignId).collection('relationships').add(newRelationship);
  }

  addEntity(campaignId:string, entity: Entity){
    return this.afs.collection('campaigns').doc(campaignId).collection('entities').add(entity);
  }
  deleteEntity(entityId:string){
    return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').doc(entityId).delete();
  }

  updateEntityName(entityId:string, name:string):Promise<void>{
    return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').doc(entityId).update({
      'name':name
    })
  }
  updateEntitySubtitle(entityId:string, subtitle:string):Promise<void>{
    return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').doc(entityId).update({
      'subtitle':subtitle
    })
  }
  updateEntityDescription(entityId:string, description:string):Promise<void>{
    return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').doc(entityId).update({
      'description':description
    })
  }


}
