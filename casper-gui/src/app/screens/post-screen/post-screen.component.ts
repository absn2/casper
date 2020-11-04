import { Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import { DashboardService } from 'src/app/servicos/dashboard.service';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-post-screen',
  templateUrl: './post-screen.component.html',
  styleUrls: ['./post-screen.component.css']
})
export class PostScreenComponent {

  constructor(
    public dialogRef: MatDialogRef<PostScreenComponent>,
    private dashboardService : DashboardService,
    private _snackBar: MatSnackBar
  ) { }

  tema : string = "esportes";
  linkNoticia : string = "";
  imgUrl : string = "";
  descricao : string = "";
  titulo : string = "";

  onCancelClick() : void {
    this.dialogRef.close()
  }

  checkValues() : Boolean {
    if (this.tema.length > 0 && this.linkNoticia.length > 0 &&
      this.imgUrl.length > 0 && this.descricao.length > 0 && this.titulo.length > 0) {
      return true;
    }
    return false;
  }

  async onClick() {
    let noticia = {
      "tema": this.tema,
      "link": this.linkNoticia,
      "imageurl": this.imgUrl,
      "descricao": this.descricao,
      "titulo": this.titulo
    }
    await this.dashboardService.postNoticia(noticia).toPromise().then(
      as => {
        this.dialogRef.close(noticia)
        this.openSnackBar("Noticia cadastrada com sucesso!", ['mat-toolbar'])
      },
      msg => {
        console.log(msg)
        this.openSnackBar(msg.error, ['mat-toolbar','mat-warn'])
      }
    )
  }

  openSnackBar(message: string, color: string[]) {
    this._snackBar.open(message, "Fechar",{
      duration: (color.filter(el => el =='mat-warn')).length > 0 ? 4000 : undefined,
      panelClass: color
    });
  }

}
