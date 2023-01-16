import { Injectable, OnInit } from '@angular/core';
import { IChat, IChatBox } from '../interfaces/interfaces';
import chatsData from '../data/chats.json'
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService{

  chats : IChat[] = chatsData
  barChats : IChatBox[] =  [];
  
  chatsSubject = new BehaviorSubject(this.chats);

  loginId : number = -1;  
  loginIdSubs ?: Subscription;

  constructor(private users: UserService) { 
    this.loginIdSubs = this.users.getLoginId().subscribe(
      val => this.loginId = val
    );
    this.barChats = [];
  }

  getChatsSubject(): Observable<IChat[]> { return this.chatsSubject}

  getChatWithFriend(friendId : number){
    return this.chats.filter(chat => {
      let ids = [chat.senderId, chat.receiverId];
      return (ids.indexOf(friendId)> -1)
      }
    )
  }

  getChatWithFriends(arr: IChat[], friendId : number){
    return arr.filter(chat => {
      let ids = [chat.senderId, chat.receiverId];
      return (ids.indexOf(friendId)> -1)
      }
    )
  }

  addMsg(body: string, friendId: number){
    this.chatsSubject.pipe(take(1)).subscribe(val =>
      {
        let chatsWithFriend = this.getChatWithFriends(val, friendId);
        let lastMsg = chatsWithFriend[chatsWithFriend.length-1];
        let chatMsg = val[val.indexOf(lastMsg)];

        if (chatMsg?.senderId === this.loginId){
          chatMsg.content.push(body);
          this.chatsSubject.next(val);
        }
        else {
          const newMsg = {senderId: this.loginId, receiverId: friendId, content: [body]}
          this.chatsSubject.next([...val, newMsg])
        }
      }
    )

    // let chatsWithFriend = this.getChatWithFriend(friendId);
    // let lastMsg = chatsWithFriend[chatsWithFriend.length-1];
    // let chatMsg = this.chats[this.chats.indexOf(lastMsg)];

    // if (chatMsg?.senderId === this.loginId){
    //   this.chatsSubject.pipe(take(1)).subscribe(val =>
    //     {
    //       chatMsg.content.push(body);
    //       this.chatsSubject.next(this.chats)
    //     }
    //     )
    // }
    // else {
    // this.chatsSubject.pipe(take(1)).subscribe(val =>
    //   {
    //     const newMsg = {senderId: this.loginId, receiverId: friendId, content: [body]}
    //     this.chatsSubject.next([...val, newMsg])
    //   }
    //   )}




    // let chatsWithFriend = this.getChatWithFriend(friendId);
    // let lastMsg = chatsWithFriend[chatsWithFriend.length-1];
    
    // let chatMsg = this.chats[this.chats.indexOf(lastMsg)];

    // if (chatMsg?.senderId === this.loginId){
    //   chatMsg.content.push(body);
    // }
    // else {
    //   this.chats.push( {senderId: this.loginId, receiverId: friendId, content: [body]});
    // }
  }

// let chatMsg = this.chats.find(msg => msg === lastMsg);
  reduceAll(){ this.barChats.map( chat => chat.isOpen = false); }
  closeChat(chat: IChatBox){ 
    const index = this.barChats.indexOf(chat);
    this.barChats.splice(index, 1);   
  }
  reduceChat(chat: IChatBox){
    this.reduceAll();     chat.isOpen = false;
  }
  toggleChat(chat: IChatBox){
    this.reduceAll();     chat.isOpen = !chat.isOpen;
    return this.barChats;
  }

  openNewChat(friendId: number) {
    let foundCorrespondence = false;
    this.barChats.map(chat => console.log(friendId))
    this.barChats.map(
      chat => {
        if (chat.friendId === friendId) {
          foundCorrespondence = true;
          this.toggleChat(chat)
        }
      }
    )
    if (!foundCorrespondence) {
      this.barChats.length === 3 ? this.barChats.shift() : null;
      this.reduceAll();
      this.barChats.push({ friendId: friendId, isOpen: true });
    }
    console.log("barchats ", this.barChats)
    // return this.barChats
  }

  ngOnDestroy(){
    this.loginIdSubs?.unsubscribe();
  }
}


  // toggleChat(arr : boolean[], index: number){
  //   arr.map( (_, i) =>
  //   i !== index ? arr[i]=false : arr[i] = !arr[i])
  //   return arr[index]
  // }

  // openNewChat(friendId : number){
    // let foundCorrespondence = false;
    // barChats.map(
    //     chat => 
    //    { 
    //        if (chat.friend === friendId) { 
    //        foundCorrespondence = true; 
    //        barChats.map( chat => chat.isOpen = false);
    //        chat.isOpen = true}
    //    }
    // )
    // if (!foundCorrespondence) { 
    //     barChats.length === 3 ? barChats.shift() : null;
    //     barChats.map( chat => chat.isOpen = false);
    //     barChats.push({friend: friendId, isOpen: true});
    // }


    // if (this.barChats.indexOf(friendId)<= -1){
    // this.barChats.length === 3 ? this.barChats.shift() : null;
    // this.barChats.push(friendId);}
  // }

  // closeChat(friendId: number){
    // const index = this.barChats.indexOf(friendId);
    // this.barChats.splice(index, 1);
  // }
  // reduceChat(arr : boolean[], friendId: number){
    // let index = this.barChats.indexOf(friendId);
    // // this.toggleChat(arr, index)
    // arr[index] = false;
    // return arr;
  // }