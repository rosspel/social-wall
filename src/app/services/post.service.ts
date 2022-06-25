import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http : HttpClient) { }

  saveNewPost(postObj : any) {
    return new Promise((resolve,reject) => {
     this.http.post('http://localhost:3000/posts', postObj).subscribe( //memorizza nuovi post
      (res) => {
        resolve(res);
      },
      (err) => {
        reject(err);
      }
     )
    })
  }

  getPosts(){
    return new Promise((resolve,reject)=> {
       this.http.get('http://localhost:3000/posts').subscribe(  //get dei post salvati prima
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
       )
    })
  }

  updateLikes(postObj : any) {
    return new Promise((resolve,reject) => {
      this.http.put('http://localhost:3000/posts/' + postObj.id, postObj).subscribe(  //conserva numero likes
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
       )
    })
  }

  updateComments(postObj :any) {
    return new Promise((resolve,reject) => {
      this.http.put('http://localhost:3000/posts/' + postObj.id, postObj).subscribe(  //conserva commenti
        (res) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
       )
    })
  }
}
