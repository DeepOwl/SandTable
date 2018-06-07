import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Entity } from '../_models/entity'
import { CampaignService }  from '../_services/campaign.service'
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  private campaignCollection: AngularFirestoreCollection<Campaign>;
  constructor(private afs: AngularFirestore) { }

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
     return this.afs.collection('campaigns').doc(campaignId).collection('entities').doc<Entity>(entityId).valueChanges();
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


}
