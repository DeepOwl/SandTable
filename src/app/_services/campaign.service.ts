import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Entity } from '../_models/entity'
import { Campaign, CampaignId } from '../_models/campaign'

import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private campaignCollection: AngularFirestoreCollection<Campaign>;
  constructor(private afs: AngularFirestore) { }
  entityId:string;
  campaignId:string;
  getEntities(campaignId:string):Observable<any>{
     //return this.afs.collection('campaigns').doc(campaignId).collection('entities').valueChanges();
     //var entityCollection = afs.collection<Campaign>('campaigns');
     return this.afs.collection('campaigns').doc(campaignId).collection('entities').snapshotChanges().pipe(
       map(actions => actions.map(a => {
         const data = a.payload.doc.data() as Entity;
         const id = a.payload.doc.id;
         return { id, ...data };
       }))

     );

  }

  getEntity(campaignId:string, entityId:string):Observable<Entity>{
     return this.afs.collection('campaigns').doc(campaignId).collection('entities').doc<Entity>(entityId).snapshotChanges().pipe(
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

  setCampaignId(id:string){
    this.campaignId = id;
  }
  setEntityId(id:string){
    this.entityId = id;
  }

  addEntity(campaignId:string, entity: Entity){
    return this.afs.collection('campaigns').doc(campaignId).collection('entities').add(entity);
  }
  deleteEntity(entityId:string){
    return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').doc(entityId).delete();
  }


}
