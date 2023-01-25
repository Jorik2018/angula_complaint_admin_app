import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
	
	public appPages = [
		{ title: 'Denuncias', url: '/folder/Inbox', icon: 'mail' },
	];

	userName:string='';

	public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

	constructor() {
		
			/*	try{
			let token_:any=JSON.parse(localStorage.getItem('token') as string);
			me.token=(token_ as any)!.token as string;
		}catch(e){}*/
	}

	async logout(){
		let location = new URL(window.location.toString()),urlParams = new URLSearchParams(location.search);
		urlParams.delete('code');
		let q = urlParams.toString();
		q = q && ('?' + q);
		await localStorage.removeItem('token');
		window.location.replace(location.protocol + '//' + location.host + location.pathname + q);
	}
  
}
