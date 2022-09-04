import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interface';

/* De esta forma se indica que los servicios seran de manera global */
@Injectable({
  providedIn: 'root'
})

export class GifsService {

  private _keyHistorialStorage: string = 'historial';
  private _keyResultSearchStorage: string = 'Result';
  private _serviceUrl: string = 'https://api.giphy.com/v1';
  private _apiKey: string = '783cBdo5ZidgL13qki8ERZc0nUE5JRiz';

  private _historial: string[] = [];
  public resultados: Gif[] = [];

  get historial(): string[] { return [...this._historial]; }

  constructor(private http: HttpClient) {
    // const historialStore = localStorage.getItem(this._keyHistorialStorage);
    // if (historialStore) this._historial = JSON.parse(historialStore);

    this._historial = JSON.parse(localStorage.getItem(this._keyHistorialStorage)!) || [];
    this.resultados = JSON.parse(localStorage.getItem(this._keyResultSearchStorage)!) || [];
  }

  buscarGifs(query: string) {
    query = query.trim().toLowerCase();

    if (this._historial.includes(query) === false) {
      this._historial.unshift(query);
      this._historial = this._historial.slice(0, 10);
      localStorage.setItem(this._keyHistorialStorage, JSON.stringify(this._historial));
    }

    // https://api.giphy.com/v1/gifs/search?api_key=783cBdo5ZidgL13qki8ERZc0nUE5JRiz&q=dragon ball z&limit=10
    // fetch('https://api.giphy.com/v1/gifs/search?api_key=783cBdo5ZidgL13qki8ERZc0nUE5JRiz&q=dragon ball z&limit=10').then(response => {
    //   response.json().then(data => { });
    // });

    const params = new HttpParams()
      .set('api_key', this._apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http.get<SearchGifsResponse>(`${this._serviceUrl}/gifs/search`, { params })
      .subscribe(response => {
        this.resultados = response.data;
        localStorage.setItem(this._keyResultSearchStorage, JSON.stringify(this.resultados));
      });
  }
}