import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router'
import {environment} from '../../../environments/environment'

@Component({
  selector: 'app-auth-screen',
  templateUrl: './auth-screen.component.html',
  styleUrls: ['./auth-screen.component.css']
})
export class AuthScreenComponent implements OnInit {

  constructor(private router:Router, private _snackbar: MatSnackBar) { }

  pin = "";

  ngOnInit(): void{
    let key = localStorage.getItem('PIN')
    console.log(key)
    if (key) {
      this.router.navigateByUrl('/dashboard')
    }
  }

  btnClick(): void {
    if (this.pin == environment.acessoBot) {
      localStorage.setItem("PIN", this.pin)
      this.router.navigateByUrl('/dashboard')
    } else {
      this.openSnackBar("Pin incorreto", ['mat-toolbar', 'mat-warn'])
    }
    this.pin = ""
  }

  openSnackBar(message: string, color: string[]) {
    this._snackbar.open(message, "Fechar",{
      panelClass: color,
      duration: 4000
    })
  }

}
