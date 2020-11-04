import { Component, OnInit, Inject } from '@angular/core';
import {Router} from '@angular/router'
import {DashboardService} from '../../servicos/dashboard.service'
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import { PostScreenComponent } from '../post-screen/post-screen.component';

@Component({
  selector: 'app-dashboard-screen',
  templateUrl: './dashboard-screen.component.html',
  styleUrls: ['./dashboard-screen.component.css']
})
export class DashboardScreenComponent implements OnInit {

  constructor(private dashboardService : DashboardService,
    private router: Router, public dialog: MatDialog,
    private _snackbar: MatSnackBar
    ) { }

  noticias = []
  noticiasFilter = []
  edicao : Boolean = false
  loading : Boolean = false
  busy: Boolean = false
  filter : string = "all"

  async ngOnInit() {
    let key = localStorage.getItem('PIN')
    this.busy = true;
    console.log(key)
    if (!key) {
      this.router.navigateByUrl('')
    } else {
      await this.dashboardService.getNoticias().toPromise().then(
        as => {
          this.noticias = as
          this.noticias = this.noticias.sort((a,b) => (a.tema > b.tema ? 1 : ((b.tema > a.tema) ? -1 : 0) ))
          this.filterNoticia()
          console.log(this.noticias)
          this.busy = false
        },
        msg => {
          this.openSnackBar(msg.message, ['mat-toolbar', 'mat-warn'])
        }
      )
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(PostScreenComponent)

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.noticias.push(result)

        this.noticias = this.noticias.sort((a,b) => (a.tema > b.tema ? 1 : ((b.tema > a.tema) ? -1 : 0) ))
        this.filterNoticia()
        console.log(this.noticias)
      }
    });
  }

  openSnackBar(message: string, color: string[]) {
    this._snackbar.open(message, "Fechar",{
      panelClass: color,
      duration: 4000
    })
  }

   async continueEditing(entrie): Promise<void> {
    this.loading = true;
    if (!entrie.link || !entrie.imageurl || !entrie.titulo || !entrie.descricao) {
      this.openSnackBar("Por favor, preencher toda linha!", ['mat-toolbar', 'mat-warn'])
      this.loading = false;
    } else {
       await this.dashboardService.putNoticia(entrie).toPromise().then(
        as => {
          this.openSnackBar("Notícia atualizada com sucesso", ['mat-toolbar'])
          this.noticias.forEach(el => {
            if (el['link'] == entrie['link']) el['edit'] = false;
          });
          this.noticias = this.noticias.sort((a,b) => (a.tema > b.tema ? 1 : ((b.tema > a.tema) ? -1 : 0) ))
          this.filterNoticia()
          this.loading = false
        },
        msg => {
          this.openSnackBar(msg.error, ['mat-toolbar', 'mat-warn'])
          this.loading = false
        }
      )
    }
  }

  async deleteNoticia(linkNoticia : string) {
    console.log(linkNoticia)
    this.loading = true;
    await this.dashboardService.deleteNoticia(linkNoticia).toPromise().then(
      _ => {
        this.noticias = this.noticias.filter(el => el['link'] != linkNoticia)
        this.filterNoticia()
        this.openSnackBar("Notícia deletada com sucesso!", ['mat-toolbar'])
      },
      msg => {
        console.log(msg)
        this.openSnackBar(msg.error, ['mat-toolbar', 'mat-warn'])
      }
    )
    this.loading = false;
  }

  filterNoticia() {
    if (this.filter == 'all') this.noticiasFilter = this.noticias
    else this.noticiasFilter = this.noticias.filter(el => el['tema'] == this.filter)
  }

  quit() {
    localStorage.removeItem("PIN")
    this.router.navigateByUrl("")
  }

}
