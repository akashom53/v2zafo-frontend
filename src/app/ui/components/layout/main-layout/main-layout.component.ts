import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../auth/auth.service';
import { filter } from 'rxjs';

interface NavItem {
  label: string;
  route: string;
  icon: string;
  isActive?: boolean;
}
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})

export class MainLayoutComponent implements OnInit {
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.navItems.map(
        item => item.isActive = (item.route === event.url.replaceAll('/', ''))
      )
    });
  }
  isNavExpanded = false;
  navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '',
      icon: 'fa-solid fa-table-columns',
      isActive: true,
    },
    {
      label: 'Chat',
      route: 'chat',
      icon: 'fa-solid fa-comment'
    },
    {
      label: 'Users',
      route: 'users',
      icon: 'fa-solid fa-users'
    },
    {
      label: 'Logout',
      route: 'logout',
      icon: 'fa-solid fa-right-from-bracket'
    },
  ]

  private router = inject(Router)
  private authService = inject(AuthService)


  setActiveNavItem(item: NavItem) {
    if (item.route === 'logout') {
      this.authService.logout();
      return;
    }
    this.router.navigate([item.route])
    this.navItems = this.navItems.map((navItem) => {
      return {
        ...navItem,
        isActive: navItem.label === item.label,
      };
    })
  }

  toggleNav() {
    this.isNavExpanded = !this.isNavExpanded;
  }


}
