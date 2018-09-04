import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  response: any;
  response2: any;
  collection: any;
  photoInfo: any;
  url = 'https://api.flickr.com/services/rest/';
  apiKey = 'a49a46011069a6d7e86e54ec74ea2463';
  userId = '35145207@N05';
  photoId: any;
  closeResult: string;
  lens: any;
  aperture: any;
  iso: any;
  exposure: any;
  page: number;
  pages: number;
  isLoading: boolean = true;

  constructor(private http: HttpClient, private modalService: NgbModal) { }  
  
  getApi(){
    this.http.get(`${this.url}?method=flickr.people.getPublicPhotos&api_key=${this.apiKey}&user_id=${this.userId}&page=${this.page}&format=json&nojsoncallback=1`)
    .subscribe((response)=>{
      this.response = response;
      this.collection = this.response.photos.photo;
      this.page = this.response.photos.page;
      this.pages = this.response.photos.pages;
      console.log(this.collection);     
      this.isLoading = false; 
    })
  }

  next(){ 
    if(this.page >= 1 && this.page < this.pages){
      this.page++
    }
    this.getApi();
    console.log(this.page);  
  }

  prev(){ 
    if(this.page > 1 && this.page <= this.pages){
      this.page--
    }
    this.getApi();
    console.log(this.page); 
  }

  viewInfo(id){
    this.photoId = id;
    this.http.get(`${this.url}?method=flickr.photos.getExif&api_key=${this.apiKey}&photo_id=${this.photoId}&format=json&nojsoncallback=1`)
    .subscribe((res)=>{  
      this.response2 = res;
      this.photoInfo = this.response2.photo;
      console.log(this.photoInfo);
      for(let i = 0 ; i < this.photoInfo.exif.length; i++){   
        if (this.photoInfo.exif[i].label === 'Lens Model'){
          this.lens = this.photoInfo.exif[i].raw._content;
          console.log(this.lens);
        }     
        if (this.photoInfo.exif[i].label === 'Aperture'){
          this.aperture = this.photoInfo.exif[i].raw._content;
          console.log(this.aperture);
        }
        if (this.photoInfo.exif[i].label === 'ISO Speed'){
          this.iso = this.photoInfo.exif[i].raw._content;
          console.log(this.iso);
        }
        if (this.photoInfo.exif[i].label === 'Exposure'){
          this.exposure = this.photoInfo.exif[i].raw._content;
          console.log(this.exposure);
        }
      }       
    })
    //console.log(id);
  }

  open(content, id) {
    this.modalService.open(content, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });    
    this.viewInfo(id);

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  ngOnInit() {
    this.getApi();
  }

}
