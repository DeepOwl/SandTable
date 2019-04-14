import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { Entity } from '../_models/entity'
import { Campaign, CampaignId } from '../_models/campaign'
import {Subject} from 'rxjs/Subject';
import { map, mergeMap } from 'rxjs/operators';
import {AuthService } from '../core/auth.service';
import { Relationship } from '../_models/relationship';
import { Note } from '../_models/note';
import { User } from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  private campaignCollection: AngularFirestoreCollection<Campaign>;
  private entitySubject = new Subject<string>();
  entityChanged$ = this.entitySubject.asObservable();
  private sidenavSubject = new Subject<boolean>();
  sidnavToggle$ = this.sidenavSubject.asObservable();
  private user;
  constructor(private afs: AngularFirestore, private auth: AuthService) {
    auth.user.subscribe(user=>{this.user=user});
  }
  entityId:string;
  campaignId:string;
  getEntities():Observable<Entity[]>{
     //return this.afs.collection('campaigns').doc(campaignId).collection('entities').valueChanges();
     //var entityCollection = afs.collection<Campaign>('campaigns');
     return this.afs.collection('campaigns').doc(this.campaignId).collection('entities', ref=>ref.orderBy("pin", 'desc').orderBy("touched_at", 'desc')).snapshotChanges().pipe(
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
         if(a.payload.exists){
           const data = a.payload.data() as Entity;
           const id = a.payload.id;
           return {id, ...data }
         }
       })

     );
  }

  getCampaignList(){
    this.campaignCollection = this.afs.collection<Campaign>('campaigns', ref=>ref.where(`roles.${this.user.uid}`, '==', 'owner'));
    return this.campaignCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Campaign;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getCampaignListGuest(){
    this.campaignCollection = this.afs.collection<Campaign>('campaigns', ref=>ref.where(`roles.${this.user.uid}`, '==', 'guest'));
    return this.campaignCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Campaign;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))

    );
  }

  getRelationships(direction:string):Observable<Relationship[]>{

    return this.afs.collection<Campaign>('campaigns').doc(this.campaignId).collection<Relationship>('relationships', ref=>ref.where(direction, '==',this.entityId)).snapshotChanges().pipe(
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


    getCampaignByInviteCode(code:string){
      var campaignRef = this.afs.collection<Campaign>('campaigns', ref=>ref.where('invite', '==', code).limit(1));
      return campaignRef.snapshotChanges().pipe(
        mergeMap(actions=>actions.map(a=>{
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      )
        
    }

    joinCampaignByInviteCode(code:string, campaignId:string){
      var updateObj = {}
      updateObj[`roles.${this.user.uid}`]='guest'
      return this.afs.collection('campaigns').doc(campaignId).update(updateObj);
    }

  addRelationship(srcEntity: Entity, relationship:string, destEntity:Entity){
    var newRelationship = {src:srcEntity.id, relationship:relationship, dest:destEntity.id }
    return this.afs.collection('campaigns').doc(this.campaignId).collection('relationships').add(newRelationship);
  }

  addEntity(entity: Entity){
    return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').add(entity);
  }

  getNotes(entity:Entity):Observable<Note[]>{
    return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').doc(entity.id).collection<Note>('notes',
      ref => ref.orderBy('created_at')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  addNote(entity:Entity){
    return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').doc(entity.id).collection('notes')
      .add({'user':this.user.uid, text:'', created_at:Date.now()});
  }

  updateNote(entity:Entity, note:Note){
    return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').doc(entity.id).collection('notes').doc(note.id)
      .update({'text':note.text});
  }
  deleteNote(entity:Entity, note:Note){
    return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').doc(entity.id).collection('notes').doc(note.id)
      .delete();
  }

  deleteEntity(entityId:string){
    return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').doc(entityId).delete();
  }
  deleteRelationship(relationshipId:string){
    return this.afs.collection('campaigns').doc(this.campaignId).collection('relationships').doc(relationshipId).delete();
  }
  updateRelationship(relationshipId:string, newRelationship:string){
    return this.afs.collection('campaigns').doc(this.campaignId).collection('relationships').doc(relationshipId).update({
        'relationship':newRelationship
    });
  }

  swapRelationship(relationshipId: string, newSrc:string, newDest:string){
    return this.afs.collection('campaigns').doc(this.campaignId).collection('relationships').doc(relationshipId).update({
      'src':newSrc,
      'dest':newDest
    });
  }

  updateEntityName(entityId:string, name:string):Promise<void>{
    return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').doc(entityId).update({
      'name':name,
      'updated_at':new Date()
    })
  }

  addEntityTag(entityId:string , tag:string){
    var tagsUpdate = {};
    tagsUpdate[`tags.${tag}`]=true;
    return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').doc(entityId).update(
      tagsUpdate
    )
  }
  removeEntityTag(entityId:string , tag:string){
    var tagsUpdate = {};
    tagsUpdate[`tags.${tag}`]=firebase.firestore.FieldValue.delete();
    return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').doc(entityId).update(
      tagsUpdate
    )
  }
  updateEntityImage(entityId: string, image: string) {
    return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').doc(entityId).update({
      'image':image,
      'updated_at':new Date()
    });
  }

  updateEntityTouched(entity:Entity):Promise<void>{
    return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').doc(entity.id).update({
      'touched_at':new Date()
    })
  }
  updateEntityPin(entityId:string, isPinned:boolean):Promise<void>{
    return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').doc(entityId).update({
      'pin':isPinned,
      'updated_at':new Date()
    })
  }

  updateEntitySubtitle(entityId:string, subtitle:string):Promise<void>{
    return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').doc(entityId).update({
      'subtitle':subtitle,
      'updated_at':new Date()
    })
  }
  updateEntityDescription(entityId:string, description:string):Promise<void>{
    return this.afs.collection('campaigns').doc(this.campaignId).collection('entities').doc(entityId).update({
      'description':description,
      'updated_at':new Date()
    })
  }

  addCampaign(campaign:Campaign){
    return this.afs.collection('campaigns').add(campaign);
  }

  toggleSidenav(){
    this.sidenavSubject.next(true);
  }

}
