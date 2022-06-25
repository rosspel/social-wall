import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { finalize } from 'rxjs/operators';
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y/input-modality/input-modality-detector';
import { PostService } from 'src/app/services/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  constructor(public userService : UserService, private router : Router, private storage : AngularFireStorage, public postService : PostService, private snackbar : MatSnackBar) { }

  ngOnInit(): void {
    if(this.userService.user == undefined || this.userService.user == null) {
       let str = localStorage.getItem('user');
       if(str != null) {
        this.userService.user = JSON.parse(str); //se ricarico pagina non ritorno a login, user conservato in local storage
       } else {
       this.router.navigate(['/login']);
      }
    }
    this.postService.getPosts().then((res : any) => {
      this.posts = res;
      for(let post of this.posts) {   //per evitare che commento in input di un post si riproduca in tutti i post
        this.commentText.push('');
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  selectedFile: any;
  text = '';
  posts: Array<any> = [];
  commentText : Array<string> = [];

  onFileSelected(event : any) {
    this.selectedFile = event.target.files[0];
  }

  post() {
    this.snackbar.open('Creating the post...', '', {duration: 15000})
    if(this.selectedFile != undefined || this.selectedFile != null) {
      this.uploadImage().then((imageURL) => {
        console.log(imageURL);
        let postObj = {
          username: this.userService.user.username,
          text: this.text,
          imageURL: imageURL,
          likes: [],
          comments: []
        };
        this.posts.push(postObj);
        this.postService.saveNewPost(postObj).then((res) => {
          console.log(res);
          this.snackbar.open('Posted succesfully', 'OK');
        }).catch((err) => {
          console.log(err);
        });
        this.selectedFile = undefined;
      }).catch((err) => {
        console.log(err);
      })
    } else {                                         //se utente pubblica solo testo senza immagine
      let postObj = {
        username: this.userService.user.username,
        text: this.text,
        imageURL: '',
        likes: [],
        comments: []
      };
      this.posts.push(postObj);
      this.postService.saveNewPost(postObj).then((res) => {
        console.log(res);
        this.snackbar.open('Posted succesfully', 'OK');
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  uploadImage() {
    return new Promise((resolve, reject) => {
      let n = Date.now();
      const file = this.selectedFile;
      const filePath = `images/${n}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`images/${n}`, file);
      task.snapshotChanges().pipe(
        finalize(() => {
          let imageURL = fileRef.getDownloadURL();
          imageURL.subscribe((url: any) => {
            if (url) {
              console.log(url);
              resolve(url);
            }
          });
        })
      ).subscribe(
        (url)=>{
          if(url){
            console.log(url);
          }
        }
      );
    });
  }

  like(postId : any) {
    for(let i=0; i<this.posts.length; i++) {
     if(this.posts[i].id== postId) {
      if(this.posts[i].likes.indexOf(this.userService.user.id) >=0) {
        this.posts[i].likes.splice(this.posts[i].likes.indexOf(this.userService.user.id),1) //per togliere like
      }
      else {
      this.posts[i].likes.push(this.userService.user.id); //mettere like
     }
     this.postService.updateLikes(this.posts[i]).then((res) => {
      console.log(res);
     }).catch((err) => {
      console.log(err);
     })
     }
    }
  }

  comment(postId : any, commentIndex : any) {
    for(let i=0; i<this.posts.length; i++) {
      if(this.posts[i].id== postId) {
        let commentObj = {
          username: this.userService.user.username,
          comment: this.commentText[commentIndex]
        };
        this.posts[i].comments.push(commentObj);
        this.commentText[commentIndex]= "";                    //svuota input dopo che clicco comment
        this.postService.updateComments(this.posts[i]);        //salva commenti in db
      }
     }
  }

  postSchema = {
    username : '',
    imageURL: '',
    text: '',
    likes: [],
    comments: [{username:'', comment:''}]
  }


}
