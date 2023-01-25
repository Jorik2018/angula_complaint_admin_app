import { Component, OnInit , ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { ColumnMode ,SelectionType } from '@swimlane/ngx-datatable';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'
  ],
})
export class FolderPage implements OnInit {
	
	public folder!: string;
	public data: any;
	public columns: any;
	public rows: any[]=[];
	
	public columnMode:any=ColumnMode.force;
	public selectionType :any=SelectionType.multi;
	token:string='';
	selected:any[] = [];
	o:any={};

	constructor(private http: HttpClient,private activatedRoute: ActivatedRoute,private loadingCtrl: LoadingController) {
		var me=this;
		me.columns = [
			{ name: 'descripcion' },
			{ name: 'created_at' },
			{ name: 'Genre' }
		];
		me.retrieve();
		me.selected=[];
		me.o={};
		try{
			let token_:any=JSON.parse(localStorage.getItem('token') as string);
			me.token=(token_ as any)!.token as string;
		}catch(e){}
	}

	retrieve(){
		let me=this, reqHeader = new HttpHeaders({ 
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + me.token
		});
		this.http.get<any>('../../assets/movies.json',{ headers: reqHeader }).subscribe((res) => {
			console.log(res);
			this.rows = res.data;
		});
	}

	ngOnInit() {
		this.folder = 'Denuncias';//this.activatedRoute.snapshot.paramMap.get('id') as string;
	}
	
	atender(item:any){
		console.log(item);
		this.o=item;
		this.isModalOpen=true;
	}

	async send(){
		let me=this;
		const loading = await this.loadingCtrl.create({message: 'Enviando...',});
		loading.present();
		var reqHeader = new HttpHeaders({ 
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + me.token
		});
		me.http.post<any>('http://localhost:8100/folder/Favorites', me.o, { headers: reqHeader }).subscribe(data => {
			loading.dismiss();
			me.isModalOpen=false;
			me.retrieve();
		},(error)=>{
			console.log(error);
			setTimeout(()=>{
				loading.dismiss();
				me.isModalOpen=false;
				me.retrieve();
			},2000);
		})
	}

	onSelect(event:any){
		let selected=event.selected;
		console.log('Select Event', selected, this.selected);
		this.selected.splice(0, this.selected.length);
		this.selected.push(...selected);
	}

	onActivate(event:any) {
		//console.log('Activate Event', event);
	}

	@ViewChild(IonModal) 
	modal?: IonModal;
	message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
	name: string='';
	isModalOpen:boolean=false;
	
	cancel() {
		this.modal!.dismiss(null, 'cancel');
	}

	confirm() {
		this.modal!.dismiss(this.name, 'confirm');
	}

	onWillDismiss(event: Event) {
		const ev = event as CustomEvent<OverlayEventDetail<string>>;
		if (ev.detail.role === 'confirm') {
			this.message = `Hello, ${ev.detail.data}!`;
		}
	}

}
