import { Component, NgZone} from '@angular/core';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
	
	public appPages = [
		{ title: 'Denuncias', url: '/folder/Inbox', icon: 'mail' },
	];

	public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

	constructor(private router: Router, private zone: NgZone,private http:HttpClient) {
		this.initializeApp();
	}
	
	userName?:any;

	checked:boolean=false;

	initializeApp() {
		var me=this;
		
		let url='';
		let location = new URL(url||window.location.toString());
		let urlParams = new URLSearchParams(location.search);
		const code = urlParams.get('code');
		if(code){
			setTimeout(async ()=>{
				let data:any=await me.http.post(environment.APP_BASE_URL+'/api/denuncia/api/token', code).toPromise();
				if (data.error) {
					alert(JSON.stringify(data.error));
					me.checked=true;
				} else if (data.access_token||data.token) {
					localStorage.setItem('perms',JSON.stringify(data.perms));
					localStorage.setItem('user_nicename',data.user_nicename);
					localStorage.setItem('token', JSON.stringify({ token: data.access_token||data.token }));
					location = new URL(window.location.toString());
					urlParams = new URLSearchParams(location.search);
					urlParams.delete('code');
					let q = urlParams.toString();
					q = q && ('?' + q);
					window.location.replace(location.protocol + '//' + location.host + location.pathname + q);
				}
			});
		}else{
			me.checked=!!localStorage.getItem('token');
		}
		me.userName=localStorage.getItem('user_nicename');
		App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
			this.zone.run(async () => {
				const url = event.url;
				let location = new URL(url||window.location.toString());
				let urlParams = new URLSearchParams(location.search);
				const code = urlParams.get('code');
				if(code){
					let data:any=await me.http.post(environment.APP_BASE_URL+'/api/denuncia/api/token', code).toPromise();
					if (data.error) {
						alert(JSON.stringify(data.error));
					} else if (data.access_token||data.token) {
						localStorage.setItem('perms',JSON.stringify(data.perms));
						localStorage.setItem('user_nicename',data.user_nicename);
						localStorage.setItem('token', JSON.stringify({ token: data.access_token||data.token }));
						location = new URL(window.location.toString());
						urlParams = new URLSearchParams(location.search);
						urlParams.delete('code');
						let q = urlParams.toString();
						q = q && ('?' + q);
						window.location.replace(location.protocol + '//' + location.host + location.pathname + q);
					}
				}
			});
		});
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
