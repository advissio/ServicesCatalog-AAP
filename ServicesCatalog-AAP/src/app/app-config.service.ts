import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
//import {
//  Http,
//  Headers,
//  RequestOptions
//}                     from '@angular/http';
import { 
  HttpClient,
  HttpHeaders
 } from '@angular/common/http';

@Injectable()
export class ConfigService {

  private config: Object
  private env: Object

  private configBaseUrl: string = 'config/';
  private configUrl: string = this.configBaseUrl.concat('env.json');
  
  constructor(private http: HttpClient) {}

  /**
   * Loads the environment config file first. Reads the environment variable from the file
   * and based on that loads the appropriate configuration file - development or production
   */
  load() {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'DataType': 'application/json' });
      
      this.http.get(this.configUrl)
      .subscribe((env_data) => {
        this.env = env_data;
        this.http.get(this.configBaseUrl + (<any>env_data).env + '.json')
          .pipe(
            catchError((error: any) => {
              return Observable.throw(error.json().error || 'Server error');
            }))
          .subscribe((data) => {
            this.config = data;
            resolve(true);
          });
      });
    });
  }

  /**
   * Returns environment variable based on given key
   *
   * @param key
   */
  getEnv(key: any) {
    return this.env[key];
  }

  /**
   * Returns configuration value based on given key
   *
   * @param key
   */
  get(key: any) {
    return this.config[key];
  }
}