
import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders, HttpParameterCodec } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { retry, map } from 'rxjs/operators';

@Injectable()
export class DashboardService {

  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private taURL = 'https://casper-miniproject.glitch.me';

  constructor(private http: HttpClient) {}

  getNoticias(): Observable<any[]> {
    return this.http.get<any[]>(this.taURL + "/noticias")
              .pipe(
                 retry(2)
               );
  }

  postNoticia(noticia : any): Observable<any> {
    
    return this.http.post<any>(this.taURL + "/noticias", noticia, {headers:this.headers})
      .pipe(
        retry(2)
      );
  }

  putNoticia(noticia : any): Observable<any> {

    return this.http.put<any>(this.taURL + "/noticias", noticia, {headers:this.headers})
      .pipe(
        retry(2)
      );
  }

  deleteNoticia(link : any): Observable<any> {
    console.log(link)
    return this.http.delete(this.taURL+"/noticias?id="+link)
  }

}
