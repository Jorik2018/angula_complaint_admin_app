import { NgModule,Injectable  } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes,CanActivate } from '@angular/router';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class IsAdmin implements CanActivate {
	
    constructor(
        private http:HttpClient
    ){}


    async canActivate(){
		let me=this;
		
		
		let url='';
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
		
		
		var token=localStorage.getItem('token');
		if (token)  {
			console.log(token);
			return true; // all fine
		} else {
			var client_id = environment.APP_OAUTH_CLIENT_ID;
			var oauth_url = environment.APP_OAUTH_URL;
			window.location.href = `${oauth_url}/authorize?response_type=code&client_id=${client_id}&scope=profile`;
			return false;
		}
    }


}

const canActivate=async () =>{
	let me=this;
	let url='';
		let location = new URL(window.location.toString());
    let urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
	if(code){
		/*let t=me.http.post(environment.APP_BASE_URL+'/api/auth/token', code).toPromise();//;.subscribe((data) => {
       console.log(t);*/
	   
	   /*if (data.error) {
          setMsg(JSON.stringify(data.error));
        } else if (data.access_token||data.token) {
          localStorage.setItem('perms',JSON.stringify(data.perms));
          localStorage.setItem('user_nicename',data.user_nicename);
          setToken({ token: data.access_token||data.token });
          location = new URL(window.location);
          urlParams = new URLSearchParams(location.search);
          urlParams.delete('code');
          let q = urlParams.toString();
          q = q && ('?' + q);
          console.log(location.protocol + '//' + location.host + location.pathname + q);
          window.location.replace(location.protocol + '//' + location.host + location.pathname + q);
        }
      });*/
	}
	var token=localStorage.getItem('token');
	
	if (token)  {
		return true; // all fine
	} else {
		var client_id = environment.APP_OAUTH_CLIENT_ID;
		var oauth_url = environment.APP_OAUTH_URL;
		window.location.href = `${oauth_url}/authorize?response_type=code&client_id=${client_id}&scope=profile`;
		return false;
	}
}


const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule),
		canActivate: [IsAdmin],
		pathMatch: 'full'
	}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
