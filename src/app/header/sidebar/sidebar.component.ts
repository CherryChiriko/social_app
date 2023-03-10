import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IChatBox } from 'src/app/interfaces/interfaces';
import { ChatService } from 'src/app/services/chat.service';
import { SidebarService } from '../../services/sidebar.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  constructor( private users: UserService, private sidebar: SidebarService, 
    private eRef: ElementRef, private chats: ChatService
    ){}

  loginId : number = -1;   
  loginIdSubs ?: Subscription; 

  barChat : IChatBox[] = [];   
  barChat$ ?: Subscription; 

  searchBody: string = '';
  friendsIds ?: number[];

  ngOnInit(): void {
    this.loginIdSubs = this.users.getLoginId().subscribe(
      val => this.loginId = val
    );
    this.friendsIds = this.users.getUserInfo(this.loginId).friends;

    this.barChat$ = this.chats.getBarChatsSubject().subscribe(
      val => this.barChat = val
    );
  }

  public text!: String;
  hostElem = this.eRef.nativeElement;

  // ngAfterViewInit() {
  //   console.log(this.hostElem.children);
  //   console.log(this.hostElem.parentNode);
  // }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if(!this.eRef.nativeElement.contains(event.target) && 
    !this.hostElem.parentNode.contains(event.target) ) {
      this.turnOff();}
  }

  turnOff(){ 
    this.sidebar.turnOffSidebar();
  }
  
  getFriendInfo(id: number){  return this.users.getUserInfo(id)}

  search(){
    let result = this.users.filterSearch(this.searchBody);
    this.friendsIds = [... result.map(res => res.id)];
  }
  searchContent(event: any){    this.searchBody = event.target.value;  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.key == 'Enter'){
      this.search()
    }
  }

  openNewChat(friendId : number){
    this.chats.openNewChat(friendId)
  }

  ngOnDestroy(){
    this.loginIdSubs?.unsubscribe();
    this.barChat$?.unsubscribe();
  }
}
