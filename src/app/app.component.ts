import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AuthenticationService } from './_services/authentication.service';
import { UserService } from './_services/user.service';
import { Subject, finalize, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { routeUrls } from './constant/shared-constant';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isCollapsed = false;
  isLoggedIn = false;
  user: any;
  chatbots: any;
  selectedChatbot: any;

  avatar =
    'assets/icons/profile-circle-2.svg';
  $destroyWatching: Subject<any> = new Subject();
  createChatbotForm: FormGroup | any;
  formLoading: boolean = false;

  isChatbotPage = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private userService: UserService,
    private fb: FormBuilder,
    private toastr: ToastrService,
  ) {

 
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.isLoggedIn = this.authService.isAuthenticated();
       
      } else if (event instanceof NavigationEnd) {
        
        if (routeUrls.includes(event.urlAfterRedirects)) {
          this.isLoggedIn = false;
          this.authService.signOut();
        }
      }
    });
  }

  ngOnInit() {
  
    this.isLoggedIn = this.authService.isAuthenticated();

    const user_:any = localStorage.getItem('COMPANY-USER');
    const user = JSON.parse(user_);
    this.avatar = user?.profilePic;
  }
 

  async signOut(): Promise<void> {
    this.isLoggedIn = false;
      this.authService.signOut();
      this.router.navigate(["/login"]);
  }
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
 
}
